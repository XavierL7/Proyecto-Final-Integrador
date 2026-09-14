// backend/scripts/backfillColoresEtiqueta.js
//
// Correr UNA sola vez, después de aplicar la migración que agrega la
// columna "color" a Etiqueta (npx prisma migrate dev).
//
// Antes, el color de cada etiqueta salía de "id_etiqueta % 10" contra
// una paleta fija. Este script les asigna a las etiquetas que ya
// existen (color = null) esa misma posición, así no cambian de color
// de un día para el otro. Las etiquetas nuevas que se creen de acá en
// más van a elegir su color al crearse (a mano o al azar).
//
// Uso:
//   node backend/scripts/backfillColoresEtiqueta.js
import prisma from '../db.js'
import { COLORES_ETIQUETA_VALIDOS } from '../constants/coloresEtiqueta.js'

async function main() {
  const etiquetasSinColor = await prisma.etiqueta.findMany({
    where: { color: null },
    orderBy: { id_etiqueta: 'asc' }
  })

  if (etiquetasSinColor.length === 0) {
    console.log('No hay etiquetas sin color. No hace falta hacer nada.')
    return
  }

  console.log(`Asignando color a ${etiquetasSinColor.length} etiqueta(s)...`)

  for (const etiqueta of etiquetasSinColor) {
    const color = COLORES_ETIQUETA_VALIDOS[etiqueta.id_etiqueta % COLORES_ETIQUETA_VALIDOS.length]
    await prisma.etiqueta.update({
      where: { id_etiqueta: etiqueta.id_etiqueta },
      data: { color }
    })
    console.log(`  #${etiqueta.id_etiqueta} "${etiqueta.nombre_etiqueta}" -> ${color}`)
  }

  console.log('Listo.')
}

main()
  .catch(e => {
    console.error('Error en el backfill de colores:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
