// backend/controllers/dispositivo/identificarHuella.js
import prisma from '../../db.js'
import jwt from 'jsonwebtoken'
import { publicarLoginPorHuella, publicarErrorLoginPorHuella } from '../../lib/loginHuellaState.js'
import { metodoLoginPermitido, MENSAJE_LOGIN_DESHABILITADO } from '../../lib/configuracion.js'
import { hayVentaPendiente, obtenerVentaPendiente, resolverVentaPendiente } from '../../lib/ventaPendienteState.js'
import { hayMovimientoPendiente, obtenerMovimientoPendiente, resolverMovimientoPendiente } from '../../lib/movimientoPendienteState.js'
import { guardarVenta } from '../venta/construirVenta.js'

const JWT_SECRET = process.env.JWT_SECRET

// Llamado por el ESP32 (main.cpp -> enviarHuellaAlBackend) cada vez que el
// AS608 reconoce localmente una huella. Tiene TRES usos posibles, según el
// contexto en el que se identifique a alguien:
//
// 1) Hay una venta de caja compartida esperando confirmación (alguien
//    apretó "Confirmar pago" en una caja modo_autenticacion = por_venta):
//    esa huella CONFIRMA esa venta puntual, atribuyéndosela a quien la
//    puso, sin importar quién abrió la caja. No se publica login en este
//    caso: el gesto significa "autorizo esta venta", no "iniciá mi sesión
//    web".
//
// 2) Hay un ingreso/egreso manual de caja compartida esperando
//    confirmación (alguien apretó "Confirmar" en el mini formulario de
//    Dinero en Caja): esa huella CONFIRMA ese movimiento puntual,
//    atribuyéndoselo a quien la puso. Mismo criterio que el caso 1: no
//    se publica login.
//
// 3) No hay ninguna venta ni movimiento pendiente: comportamiento de
//    siempre, login por huella (identifica al trabajador y publica el
//    resultado para que la pantalla de login web lo recoja).
export const identificarHuella = async (req, res) => {
  try {
    const { fingerprintId } = req.body

    if (fingerprintId === undefined || fingerprintId === null) {
      return res.status(400).json({ error: 'fingerprintId es obligatorio.' })
    }

    const trabajador = await prisma.trabajador.findUnique({
      where: { hash_huella: String(fingerprintId) },
      include: {
        rol: {
          include: {
            roles_funcionalidades: {
              where: { activo: true },
              include: { funcionalidad: true }
            }
          }
        }
      }
    })

    if (!trabajador) {
      return res.status(404).json({
        error: 'Esa huella no está vinculada a ningún trabajador.'
      })
    }

    if (trabajador.huella_pendiente) {
      return res.status(409).json({
        error: 'Esta huella todavía no fue confirmada por el sistema.'
      })
    }

    // --- CASO 1: hay una venta de caja compartida esperando huella ---
    if (hayVentaPendiente()) {
      const pendiente = obtenerVentaPendiente()

      try {
        const venta = await guardarVenta({
          itemsConDescuento: pendiente.itemsConDescuento,
          total: pendiente.total,
          metodoPago: pendiente.metodoPago,
          datos_pago: pendiente.datos_pago,
          idClienteValidado: pendiente.idClienteValidado,
          id_trabajador: trabajador.id_trabajador,
          id_caja: pendiente.id_caja,
          id_log_huella_trabajador: trabajador.id_trabajador
        })

        resolverVentaPendiente({
          success: true,
          venta,
          trabajador: { nombre: trabajador.nombre, apellido: trabajador.apellido }
        })

        return res.json({
          success: true,
          message: `Venta confirmada por ${trabajador.nombre} ${trabajador.apellido}.`
        })
      } catch (errorVenta) {
        console.error('Error confirmando venta pendiente:', errorVenta)
        resolverVentaPendiente({
          success: false,
          error: 'Error al registrar la venta (ej. sin stock). Volvé a intentar desde cero.'
        })
        return res.status(500).json({ error: 'No se pudo confirmar la venta pendiente.' })
      }
    }

    // --- CASO 2: hay un movimiento manual (ingreso/egreso) de caja ---
    // --- compartida esperando huella                               ---
    if (hayMovimientoPendiente()) {
      const pendiente = obtenerMovimientoPendiente()

      try {
        const movimiento = await prisma.movimiento_Caja.create({
          data: {
            id_caja: pendiente.id_caja,
            tipo_movimiento: pendiente.tipo,
            monto: pendiente.monto,
            descripcion: pendiente.descripcion,
            id_trabajador_registra: trabajador.id_trabajador
          }
        })

        resolverMovimientoPendiente({
          success: true,
          movimiento,
          trabajador: { nombre: trabajador.nombre, apellido: trabajador.apellido }
        })

        return res.json({
          success: true,
          message: `Movimiento confirmado por ${trabajador.nombre} ${trabajador.apellido}.`
        })
      } catch (errorMovimiento) {
        console.error('Error confirmando movimiento pendiente:', errorMovimiento)
        resolverMovimientoPendiente({
          success: false,
          error: 'Error al registrar el movimiento. Volvé a intentar desde cero.'
        })
        return res.status(500).json({ error: 'No se pudo confirmar el movimiento pendiente.' })
      }
    }

    // --- CASO 3: comportamiento normal, login por huella ---

    // El admin puede restringir el sistema a un solo método de acceso
    // desde Administración -> Configuración. El botón "Usar lector de
    // huellas" del login sigue disponible siempre; acá simplemente no
    // dejamos que el login se complete y avisamos el motivo por el mismo
    // polling que usa la pantalla de login.
    if (!(await metodoLoginPermitido('huella'))) {
      publicarErrorLoginPorHuella(MENSAJE_LOGIN_DESHABILITADO.huella)
      return res.status(403).json({ error: MENSAJE_LOGIN_DESHABILITADO.huella })
    }

    await prisma.asistencia.create({
      data: {
        id_trabajador: trabajador.id_trabajador,
        fecha_hora_entrada: new Date(),
        tipo_autenticacion: 'huella'
      }
    })

    const funcionalidades = trabajador.rol?.roles_funcionalidades
      ?.map(rf => rf.funcionalidad.nombre_func) || []

    const token = jwt.sign(
      {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    const trabajadorRespuesta = {
      id: trabajador.id_trabajador,
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      dni: trabajador.dni,
      rol: { nombre_rol: trabajador.rol?.nombre_rol }
    }

    res.json({ token, trabajador: trabajadorRespuesta, funcionalidades })
    publicarLoginPorHuella({ token, trabajador: trabajadorRespuesta, funcionalidades })
  } catch (error) {
    console.error('Error en identificarHuella:', error)
    res.status(500).json({ error: 'Error en el servidor al identificar la huella.' })
  }
}
