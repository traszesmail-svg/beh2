import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    title: 'Kontakt i rezerwacja konsultacji',
    subtitle: 'Formularz, e-mail i spokojny start do rozmowy o psie albo kocie.',
  })
}
