// backend/lib/resolverPromocion.js

// Requiere que la promo venga cargada con:
//   productos_promociones: [{ id_producto }]
//   promociones_etiquetas: [{ etiqueta: { productos_etiquetas: [{ id_producto }] } }]
//
// Devuelve una lista plana de id_producto a los que aplica (directos +
// todos los que tengan alguna de las etiquetas asociadas), y un flag que
// indica si la promo no tiene ninguna restricción configurada (en cuyo
// caso aplica a CUALQUIER producto, sin importar que la lista esté vacía).
export function resolverPromocion(promo) {
  const directos = promo.productos_promociones.map(pp => pp.id_producto)

  const viaEtiquetas = (promo.promociones_etiquetas || []).flatMap(pe =>
    (pe.etiqueta?.productos_etiquetas || []).map(pet => pet.id_producto)
  )

  const productos_aplicables = [...new Set([...directos, ...viaEtiquetas])]

  const sin_restriccion =
    promo.productos_promociones.length === 0 &&
    (promo.promociones_etiquetas || []).length === 0

  return { productos_aplicables, sin_restriccion }
}

// Include de Prisma necesario para poder usar resolverPromocion() sobre
// el resultado. Se reutiliza en getPromocionesVigentes.js y
// construirVenta.js para no repetir la forma del include en dos lugares.
export const includeParaResolver = {
  productos_promociones: { select: { id_producto: true } },
  promociones_etiquetas: {
    include: {
      etiqueta: {
        include: { productos_etiquetas: { select: { id_producto: true } } }
      }
    }
  }
}
