import type { CollectionAfterReadHook, Endpoint } from 'payload'

import { fallbackGallery, qrPng } from '../quantum/processing/qr'
import { getServerSideURL } from '../utilities/getURL'

/**
 * A product with no image is shown by the QR code of its own address, and each of its variations by the code of that
 * variation's URL. The gallery is added only when the shop reads the product through the local API, never for the
 * admin or REST, so nothing synthetic is ever shown in an edit form or saved. A product that has images keeps them.
 */
export const qrGalleryFallback: CollectionAfterReadHook = ({ doc, req }) => {
  if (req.payloadAPI !== 'local' || !doc || typeof doc !== 'object') return doc
  const gallery = fallbackGallery(doc, getServerSideURL())
  return gallery ? { ...doc, gallery } : doc
}

/**
 * GET /api/qr?to=/products/<slug>… answers the QR code of this site's own product address as a PNG. Only a product
 * path of this site is drawn: the code always encodes this origin, so it cannot be made to point anywhere else.
 */
export const qrEndpoint: Endpoint = {
  path: '/qr',
  method: 'get',
  handler: (req) => {
    const to = new URL(req.url ?? '', getServerSideURL()).searchParams.get('to') ?? ''
    if (!/^\/products\/[^/?#]+(\?[^#]*)?$/.test(to)) return new Response(null, { status: 400 })
    const { png } = qrPng(`${getServerSideURL().replace(/\/$/, '')}${to}`)
    return new Response(new Blob([png as BlobPart], { type: 'image/png' }), { headers: { 'cache-control': 'public, max-age=31536000, immutable', 'content-type': 'image/png' } })
  },
}
