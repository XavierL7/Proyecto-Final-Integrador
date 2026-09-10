import prisma from '../../db.js'

export const obtenerResumenCajaActiva = async (req, res) => {
  try {
    // 1. Buscar la caja que actualmente esté en estado "abierta"
    const cajaActiva = await prisma.caja.findFirst({
      where: {
        estado: 'abierta',
      },
      orderBy: {
        fecha_hora_apertura: 'desc',
      },
      select: {
        id_caja: true,
        monto_inicial: true,
      },
    });

    if (!cajaActiva) {
      return res.status(404).json({ error: 'No hay ninguna caja abierta actualmente.' });
    }

    const montoInicial = Number(cajaActiva.monto_inicial) || 0;

    // 2. Agrupar los pagos de las ventas registradas en la caja activa
    const pagosAgrupados = await prisma.detalle_Pago_Venta.groupBy({
      by: ['id_metodo_pago'],
      _sum: {
        monto: true,
      },
      where: {
        venta: {
          id_caja: cajaActiva.id_caja,
        },
      },
    });

    // 3. Consultar nombres de los métodos de pago registrados
    const metodosPago = await prisma.metodoPago.findMany({
      where: {
        activo: true,
      },
      select: {
        id_metodo_pago: true,
        nombre: true,
      },
    });

    // Mapear id_metodo_pago a su nombre correspondiente
    const mapaMetodos = new Map(metodosPago.map((m) => [m.id_metodo_pago, m.nombre]));

    let totalVentas = 0;
    const desglose = pagosAgrupados.map((item) => {
      const montoMetodo = Number(item._sum.monto) || 0;
      totalVentas += montoMetodo;

      return {
        metodo_pago: mapaMetodos.get(item.id_metodo_pago) || `Método #${item.id_metodo_pago}`,
        monto: montoMetodo,
      };
    });

    // 4. Dinero total acumulado
    const totalEnCaja = montoInicial + totalVentas;

    return res.json({
      monto_inicial: montoInicial,
      total_ventas: totalVentas,
      total_en_caja: totalEnCaja,
      desglose: desglose,
    });
  } catch (error) {
    console.error('Error al obtener resumen de caja con Prisma:', error);
    return res.status(500).json({ error: 'Error interno al consultar estado de caja.' });
  }
};

