// backend/controllers/dispositivo/identificarHuella.js
import prisma from '../../db.js'
import jwt from 'jsonwebtoken'
import { publicarLoginPorHuella } from '../../lib/loginHuellaState.js'
import { hayVentaPendiente, obtenerVentaPendiente, resolverVentaPendiente } from '../../lib/ventaPendienteState.js'
import { guardarVenta } from '../venta/construirVenta.js'

const JWT_SECRET = process.env.JWT_SECRET

// Llamado por el ESP32 (main.cpp -> enviarHuellaAlBackend) cada vez que el
// AS608 reconoce localmente una huella. Tiene DOS usos posibles, según el
// contexto en el que se identifique a alguien:
//
// 1) Hay una venta de caja compartida esperando confirmación (alguien
//    apretó "Confirmar pago" en una caja modo_autenticacion = por_venta):
//    esa huella CONFIRMA esa venta puntual, atribuyéndosela a quien la
//    puso, sin importar quién abrió la caja. No se publica login en este
//    caso: el gesto significa "autorizo esta venta", no "iniciá mi sesión
//    web".
//
// 2) No hay ninguna venta pendiente: comportamiento de siempre, login por
//    huella (identifica al trabajador y publica el resultado para que la
//    pantalla de login web lo recoja).
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

    // --- CASO 2: comportamiento normal, login por huella ---
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
