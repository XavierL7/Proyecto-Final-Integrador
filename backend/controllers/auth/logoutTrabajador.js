import prisma from '../../db.js';

export const registrarSalida = async (req, res) => {
  try {
    const userId = req.userId; // Extraído por verificarToken

    const asistenciaActiva = await prisma.asistencia.findFirst({
      where: {
        id_trabajador: userId,
        fecha_hora_salida: null
      },
      orderBy: {
        fecha_hora_entrada: 'desc'
      }
    });

    if (asistenciaActiva) {
      await prisma.asistencia.update({
        where: { id_asistencia: asistenciaActiva.id_asistencia },
        data: { fecha_hora_salida: new Date() }
      });
    }

    return res.json({ success: true, message: 'Salida registrada con éxito.' });
  } catch (error) {
    console.error('Error al registrar la salida:', error);
    return res.status(500).json({ error: 'Error interno al registrar la salida.' });
  }
};