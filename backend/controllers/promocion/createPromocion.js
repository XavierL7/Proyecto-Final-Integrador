// backend/controllers/promocion/createPromocion.js
import prisma from '../../db.js'

const TIPOS_VALIDOS = ['descuento_directo', 'por_volumen', 'por_metodo_pago']

// Valida que, según el tipo de promo, estén los campos que necesita.
// Devuelve un mensaje de error o null si está todo bien.
function validarSegunTipo({ tipo_promo, porcentaje_descuento, cantidad_minima, metodo_pago_requerido }) {
  if (!TIPOS_VALIDOS.includes(tipo_promo)) {
    return `Tipo de promoción inválido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`
  }
  if (porcentaje_descuento === undefined || porcentaje_descuento === null || Number(porcentaje_descuento) <= 0 || Number(porcentaje_descuento) > 100) {
    return 'El porcentaje de descuento debe ser un número entre 1 y 100.'
  }
  if (tipo_promo === 'por_volumen' && (!cantidad_minima || Number(cantidad_minima) < 2)) {
    return 'Las promociones "por volumen" necesitan una cantidad mínima de al menos 2 unidades.'
  }
  if (tipo_promo === 'por_metodo_pago' && !metodo_pago_requerido) {
    return 'Las promociones "por método de pago" necesitan indicar qué método de pago la activa.'
  }
  return null
}

// POST /api/promociones
// body: { nombre_promo, tipo_promo, porcentaje_descuento, cantidad_minima?,
//         metodo_pago_requerido?, fecha_inicio, fecha_fin, activa?, id_productos? }
// id_productos: array de ids de Producto a los que aplica. Si se omite o
// se manda vacío, la promo aplica a CUALQUIER producto (descuento general).
export const createPromocion = async (req, res) => {
  try {
    const {
      nombre_promo,
      tipo_promo,
      porcentaje_descuento,
      cantidad_minima,
      metodo_pago_requerido,
      fecha_inicio,
      fecha_fin,
      activa,
      id_productos
    } = req.body

    if (!nombre_promo || !tipo_promo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'nombre_promo, tipo_promo, fecha_inicio y fecha_fin son obligatorios.' })
    }

    const errorTipo = validarSegunTipo({ tipo_promo, porcentaje_descuento, cantidad_minima, metodo_pago_requerido })
    if (errorTipo) {
      return res.status(400).json({ error: errorTipo })
    }

    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      return res.status(400).json({ error: 'La fecha de fin tiene que ser posterior a la fecha de inicio.' })
    }

    const nuevaPromocion = await prisma.$transaction(async (tx) => {
      const promo = await tx.promocion.create({
        data: {
          nombre_promo,
          tipo_promo,
          porcentaje_descuento: Number(porcentaje_descuento),
          // Solo guardamos estos campos si el tipo los usa; si no, quedan null
          // para no confundir a futuro ("¿por qué tiene cantidad_minima si es descuento_directo?").
          cantidad_minima: tipo_promo === 'por_volumen' ? Number(cantidad_minima) : null,
          metodo_pago_requerido: tipo_promo === 'por_metodo_pago' ? metodo_pago_requerido : null,
          fecha_inicio: new Date(fecha_inicio),
          fecha_fin: new Date(fecha_fin),
          activa: activa !== undefined ? Boolean(activa) : true
        }
      })

      if (Array.isArray(id_productos) && id_productos.length > 0) {
        await tx.productos_Promociones.createMany({
          data: id_productos.map(id_producto => ({
            id_producto: Number(id_producto),
            id_promocion: promo.id_promocion
          }))
        })
      }

      return promo
    })

    res.status(201).json(nuevaPromocion)
  } catch (error) {
    console.error('Error creando promoción:', error)
    res.status(500).json({ error: 'Error al crear la promoción' })
  }
}
