import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    title: 'Behawiorysta psów i kotów online',
    subtitle: '15-minutowa konsultacja behawioralna, konsultacje online i spokojny pierwszy krok.',
  })
}
