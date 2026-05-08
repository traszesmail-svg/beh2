import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    title: 'Behawiorysta online dla całej Polski',
    subtitle: 'Pomoc online dla opiekunów psów i kotów z całej Polski.',
  })
}
