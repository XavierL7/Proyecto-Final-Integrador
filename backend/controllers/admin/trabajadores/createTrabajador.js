// backend/controllers/admin/trabajadores/createTrabajador.js
import prisma from '../../../db.js'
import bcrypt from 'bcrypt'

const MAX_HUELLAS = 127 // límite físico del sensor AS608

export const createTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, dni, password, id_rol, registrarHuella } = req.body

    if (!nombre || !apellido || !dni || !password || !id_rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const existe = await prisma.trabajador.findFirst({
      where: { dni: parseInt(dni) }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un trabajador con ese DNI' })
    }

    const salt = await bcrypt.genSalt(10)
    const contraseña_hash = await bcrypt.hash(password, salt)

    let hash_huella = null
    let huella_pendiente = false
    let fingerprintIdAsignado = null

    // El admin tildó "registrar huella también" al crear el trabajador:
    // le reservamos el próximo número de la secuencia (arranca en 5, sube
    // solo con cada nuevo trabajador que registre huella). Todavía no está
    // capturada físicamente: eso lo hace el ESP32 cuando la vea "pendiente".
    if (registrarHuella) {
      const [{ id }] = await prisma.$queryRaw`SELECT nextval('huella_id_seq') AS id`
      fingerprintIdAsignado = Number(id)

      if (fingerprintIdAsignado > MAX_HUELLAS) {
        return res.status(400).json({
          error: `No quedan IDs de huella libres (máximo ${MAX_HUELLAS} en el sensor). Contactá a soporte para ampliar o reciclar IDs.`
        })
      }

      hash_huella = String(fingerprintIdAsignado)
      huella_pendiente = true
    }

    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        contraseña_hash,
        id_rol: parseInt(id_rol),
        hash_huella,
        huella_pendiente
      },
      include: { rol: true }
    })

    res.status(201).json({
      ...nuevoTrabajador,
      // le indicamos al front si hay que mostrar el cartel de
      // "llevá al empleado al lector para completar el registro"
      huellaAsignada: fingerprintIdAsignado
    })
  } catch (error) {
    console.error('Error creando trabajador:', error)
    res.status(500).json({ error: 'Error al crear el trabajador' })
  }
}
