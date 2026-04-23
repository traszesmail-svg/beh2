import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    title: 'Pomoc behawioralna dla kotow',
    subtitle: 'Kuweta, stres i relacje miedzy kotami uporzadkowane spokojnie online.',
  })
}
