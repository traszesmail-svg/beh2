import { notFound } from 'next/navigation'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

type Params = { slug: string }

const ALLOWED_SLUGS = [
  'kwadrans',
  'kwadrans-na-juz',
  'konsultacja-30-min',
  'konsultacja-behawioralna-online',
] as const

const SLUG_TITLES: Record<string, string> = {
  'kwadrans': 'Jak się przygotować do Kwadransa z behawiorystą',
  'kwadrans-na-juz': 'Jak się przygotować do Kwadransa na już',
  'konsultacja-30-min': 'Jak się przygotować do Dwóch Kwadransów',
  'konsultacja-behawioralna-online': 'Jak się przygotować do Pełnej Konsultacji',
}

function getGuideContent(slug: string): string | null {
  if (!(ALLOWED_SLUGS as readonly string[]).includes(slug)) return null
  try {
    const filePath = path.join(process.cwd(), 'content', 'prep-guides', `${slug}.md`)
    return readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

// Minimal Markdown → HTML: headings, bold, paragraphs, horizontal rules
function renderMarkdown(md: string): string {
  return md
    .split('\n')
    .reduce<string[]>((acc, line) => {
      if (line.startsWith('# ')) return [...acc, `<h1>${line.slice(2)}</h1>`]
      if (line.startsWith('## ')) return [...acc, `<h2>${line.slice(3)}</h2>`]
      if (line.startsWith('### ')) return [...acc, `<h3>${line.slice(4)}</h3>`]
      if (line.startsWith('---')) return [...acc, '<hr />']
      if (line.startsWith('- ')) return [...acc, `<li>${line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`]
      if (line.trim() === '') return [...acc, '</p><p>']
      return [...acc, line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')]
    }, ['<p>'])
    .concat(['</p>'])
    .join('\n')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>\s*<h/g, '<h')
    .replace(/<\/h(\d)>\s*<\/p>/g, '</h$1>')
    .replace(/<p>\s*<hr/g, '<hr')
    .replace(/<\/hr>\s*<\/p>/g, '<hr />')
    .replace(/<p>\s*<li>/g, '<ul><li>')
    .replace(/<\/li>\s*<\/p>/g, '</li></ul>')
}

export async function generateStaticParams() {
  return ALLOWED_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const title = SLUG_TITLES[params.slug] ?? 'Jak się przygotować'
  return {
    title: `${title} · Regulski Behawiorysta`,
    description: 'Krótki poradnik przygotowawczy przed konsultacją behawioralną online.',
  }
}

export default function PrepGuidePage({ params }: { params: Params }) {
  const content = getGuideContent(params.slug)

  if (!content) {
    notFound()
  }

  const html = renderMarkdown(content)

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', fontFamily: 'Georgia, serif', lineHeight: 1.7, color: '#1f1a17' }}>
      <article
        style={{ fontSize: 16 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <hr style={{ margin: '40px 0', borderColor: '#e9dfcf' }} />
      <p style={{ fontSize: 13, color: '#6b625b' }}>
        Regulski Behawiorysta · Krzysztof Regulski
      </p>
    </main>
  )
}
