// backend/controllers/venta/getVentas.js
import prisma from '../../db.js'

export const getVentas = async (req, res) => {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        trabajador: {
          select: { nombre: true, apellido: true }
        },
        cliente: {
          select: { id_cliente: true, nombre: true, apellido: true, dni: true }
        },
        detalle_ventas: {
          include: {
            producto: {
              select: { nombre_producto: true }
            }
          }
        },
        detalle_pago_venta: {
          include: {
            metodo_pago: true
          }
        }
      },
      orderBy: { fecha_hora: 'desc' },
      take: 50
    })

    res.json(ventas)
  } catch (error) {
    console.error('Error obteniendo ventas:', error)
    res.status(500).json({ error: 'Error al obtener ventas' })
  }
}
