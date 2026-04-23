import { renderOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

function formatSlugTitle(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function OpenGraphImage({ params }: { params: { slug: string } }) {
  return renderOgImage({
    title: formatSlugTitle(params.slug),
    subtitle: 'Wpis blogowy Regulski o zachowaniu psow i kotow.',
  })
}
