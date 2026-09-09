// controllers/asistenciaController.js
import prisma from '../db.js'

export const getHistorialAsistencias = async (req, res) => {
  try {
    const { desde, hasta, id_trabajador } = req.query;

    // Filtros por fecha (por defecto toma el día de hoy si no se envían parámetros)
    const fechaInicio = desde 
      ? new Date(`${desde}T00:00:00`) 
      : new Date(new Date().setHours(0, 0, 0, 0));
    
    const fechaFin = hasta 
      ? new Date(`${hasta}T23:59:59`) 
      : new Date(new Date().setHours(23, 59, 59, 999));

    const whereClause = {
      fecha_hora_entrada: {
        gte: fechaInicio,
        lte: fechaFin
      }
    };

    if (id_trabajador) {
      whereClause.id_trabajador = Number(id_trabajador);
    }

    // Traer las asistencias con sus trabajadores relacionados
    const asistencias = await prisma.asistencia.findMany({
      where: whereClause,
      include: {
        trabajador: {
          select: {
            id_trabajador: true,
            nombre: true,
            apellido: true,
            dni: true,
            rol: {
              select: {
                nombre_rol: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_hora_entrada: 'desc'
      }
    });

    // Calcular horas trabajadas y total de ventas por turno
    const historialProcesado = await Promise.all(
      asistencias.map(async (registro) => {
        const inicio = new Date(registro.fecha_hora_entrada);
        const fin = registro.fecha_hora_salida ? new Date(registro.fecha_hora_salida) : new Date();

        // 1. Duración en horas del turno
        const duracionMs = fin - inicio;
        const horasTrabajadas = Number((duracionMs / (1000 * 60 * 60)).toFixed(2));

        // 2. Suma total de ventas realizadas por el trabajador durante ESTE turno
        const resumenVentas = await prisma.venta.aggregate({
          _sum: {
            total_neto: true
          },
          _count: {
            id_venta: true
          },
          where: {
            id_trabajador: registro.id_trabajador,
            fecha_hora: {
              gte: inicio,
              lte: fin
            }
          }
        });

        return {
          id_asistencia: registro.id_asistencia,
          trabajador: {
            id: registro.trabajador.id_trabajador,
            nombre_completo: `${registro.trabajador.nombre} ${registro.trabajador.apellido}`,
            dni: registro.trabajador.dni,
            rol: registro.trabajador.rol.nombre_rol
          },
          fecha_hora_entrada: registro.fecha_hora_entrada,
          fecha_hora_salida: registro.fecha_hora_salida,
          turno_activo: !registro.fecha_hora_salida,
          tipo_autenticacion: registro.tipo_autenticacion,
          horas_trabajadas: horasTrabajadas,
          metricas_turno: {
            cantidad_ventas: resumenVentas._count.id_venta || 0,
            total_facturado: Number(resumenVentas._sum.total_neto || 0)
          }
        };
      })
    );

    return res.status(200).json(historialProcesado);
  } catch (error) {
    console.error('Error al obtener el historial de asistencias:', error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar el historial.' });
  }
};

