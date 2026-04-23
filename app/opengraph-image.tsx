import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    title: 'Behawiorysta psow i kotow online',
    subtitle: 'Kwadrans z behawiorysta, konsultacje online i spokojny pierwszy krok.',
  })
}
