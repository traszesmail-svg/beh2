import 'server-only'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import React, { type ReactNode } from 'react'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SPECIALIST_NAME } from '@/lib/site'

export type BlogTopic = 'pies' | 'koty' | 'konsultacja'

export type BlogSupportLink = {
  label: string
  href: string
  description: string
}

type BlogPostConfig = {
  slug: string
  fileName: string
  publishedAt: string
  categoryLabel: string
  categoryHref: string
  topic: BlogTopic
  audioHref: string
  supportLinks: BlogSupportLink[]
}

type Frontmatter = {
  slug?: string
  title_seo?: string
  meta_description?: string
  h1?: string
  author?: string
  publishedAt?: string
}

export type BlogMarkdownHeadingBlock = {
  type: 'heading'
  depth: number
  text: string
}

export type BlogMarkdownParagraphBlock = {
  type: 'paragraph'
  text: string
}

export type BlogMarkdownListBlock = {
  type: 'list'
  ordered: boolean
  items: string[]
}

export type BlogMarkdownQuoteBlock = {
  type: 'blockquote'
  text: string
}

export type BlogMarkdownCodeBlock = {
  type: 'code'
  text: string
}

export type BlogMarkdownRuleBlock = {
  type: 'hr'
}

export type BlogMarkdownBlock =
  | BlogMarkdownHeadingBlock
  | BlogMarkdownParagraphBlock
  | BlogMarkdownListBlock
  | BlogMarkdownQuoteBlock
  | BlogMarkdownCodeBlock
  | BlogMarkdownRuleBlock

export type BlogPost = {
  slug: string
  title: string
  seoTitle: string
  excerpt: string
  metaDescription: string
  h1: string
  author: string
  publishedAt: string
  publishedAtLabel: string
  readingTimeMinutes: number
  wordCount: number
  categoryLabel: string
  categoryHref: string
  topic: BlogTopic
  audioHref: string
  supportLinks: BlogSupportLink[]
  path: string
  fileName: string
  rawBody: string
  blocks: BlogMarkdownBlock[]
}

type BlogListingMetadataInput = {
  title: string
  description: string
  path: string
}

type BlogPostMetadataInput = {
  post: BlogPost
  description: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog-mvp')
export const BLOG_ROUTE_BASE = '/blog'
const BLOG_AUTHOR_NAME = SPECIALIST_NAME

const BLOG_POST_CONFIGS: BlogPostConfig[] = [
  {
    slug: 'dlaczego-moj-pies-szczeka-na-inne-psy',
    fileName: '02-wpis-pies-szczeka-na-inne-psy.md',
    publishedAt: '2026-04-16',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
    supportLinks: [
      {
        label: 'Reaktywność na smyczy',
        href: '/psy/reaktywnosc-na-smyczy',
        description: 'Pełniejsza strona problemowa o spacerach i napięciu na smyczy.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Więcej tematów związanych ze spacerem, regulacją i codzienną pracą z psem.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
        description: 'Dobry start, jeśli chcesz odnieść ten temat do swojego psa.',
      },
      {
        label: 'Niezbędnik',
        href: '/niezbednik',
        description: 'Materiały, do których możesz wrócić po lekturze.',
      },
    ],
  },
  {
    slug: 'pies-wyje-kiedy-zostaje-sam',
    fileName: '03-wpis-pies-wyje-kiedy-zostaje-sam.md',
    publishedAt: '2026-04-15',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
    supportLinks: [
      {
        label: 'Lęk separacyjny u psa',
        href: '/psy/lek-separacyjny',
        description: 'Pełniejszy przewodnik, jeśli problem powtarza się albo szybko narasta.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Zobacz inne tematy związane z zachowaniem psa.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
        description: 'Jeśli chcesz ustalić pierwszy plan dla swojego psa.',
      },
      {
        label: 'Niezbędnik',
        href: '/niezbednik',
        description: 'Materiały pomocnicze do spokojnej pracy między kolejnymi krokami.',
      },
    ],
  },
  {
    slug: 'kot-zalatwia-sie-poza-kuweta',
    fileName: '04-wpis-kot-zalatwia-sie-poza-kuweta.md',
    publishedAt: '2026-04-14',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot'),
    supportLinks: [
      {
        label: 'Załatwianie poza kuwetą',
        href: '/koty/zalatwianie-poza-kuweta',
        description: 'Pełniejsza strona problemowa o filtrach diagnostycznych i pierwszych decyzjach.',
      },
      {
        label: 'Koty',
        href: '/koty',
        description: 'Więcej tematów związanych z kuwetą, stresem i codziennym funkcjonowaniem kota.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot'),
        description: 'Jeśli chcesz ustalić, od czego zacząć w swojej sytuacji.',
      },
      {
        label: 'Niezbędnik',
        href: '/niezbednik',
        description: 'Materiały, które pomagają wrócić do tematu spokojnie i po kolei.',
      },
    ],
  },
  {
    slug: 'jak-wyglada-konsultacja-behawioralna-online',
    fileName: '05-wpis-jak-wyglada-konsultacja-behawioralna-online.md',
    publishedAt: '2026-04-13',
    categoryLabel: 'Konsultacja',
    categoryHref: '/konsultacja-behawioralna-online',
    topic: 'konsultacja',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min'),
    supportLinks: [
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min'),
        description: 'Najprostszy sposób, żeby spokojnie omówić swoją sytuację.',
      },
      {
        label: 'O mnie',
        href: '/o-mnie',
        description: 'Jeśli chcesz sprawdzić kwalifikacje, sposób pracy i publiczne punkty odniesienia.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Przejdź do pomocy dla opiekunów psów.',
      },
      {
        label: 'Koty',
        href: '/koty',
        description: 'Przejdź do pomocy dla opiekunów kotów.',
      },
    ],
  },
  {
    slug: 'pies-cignnie-na-smyczy',
    fileName: '07-wpis-pies-cignie-na-smyczy.md',
    publishedAt: '2026-04-12',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
    supportLinks: [
      {
        label: 'Reaktywność na smyczy',
        href: '/psy/reaktywnosc-na-smyczy',
        description: 'Pełniejsza strona problemowa, jeśli samo ciągnięcie jest częścią większego napięcia.',
      },
      {
        label: 'Szczekanie na inne psy',
        href: '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
        description: 'Powiązany wpis o trudnościach spacerowych.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Więcej tematów związanych ze spacerem i regulacją psa.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
        description: 'Jeśli chcesz ustalić, czy to nawyk, czy już szerszy problem.',
      },
    ],
  },
  {
    slug: 'kot-drapie-meble',
    fileName: '08-wpis-kot-drapie-meble.md',
    publishedAt: '2026-04-11',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot'),
    supportLinks: [
      {
        label: 'Załatwianie poza kuwetą',
        href: '/koty/zalatwianie-poza-kuweta',
        description: 'Jeśli obok drapania widzisz też napięcie środowiskowe lub problem toaletowy.',
      },
      {
        label: 'Koty',
        href: '/koty',
        description: 'Więcej tematów o stresie, kuwecie i relacjach w domu.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot'),
        description: 'Jeśli chcesz uporządkować, co stoi za zachowaniem kota.',
      },
      {
        label: 'Niezbędnik',
        href: '/niezbednik',
        description: 'Materiały pomocnicze do samodzielnej pracy i spokojnego powrotu do zaleceń.',
      },
    ],
  },
  {
    slug: 'nowy-pies-pierwsze-72-godziny',
    fileName: '09-wpis-nowy-pies-pierwsze-72-godziny.md',
    publishedAt: '2026-04-10',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
    supportLinks: [
      {
        label: 'Psy',
        href: '/psy',
        description: 'Przejdź do pomocy dla opiekunów psów i podobnych tematów.',
      },
      {
        label: 'Pierwsze dni po adopcji',
        href: '/niezbednik',
        description: 'Konkretny materiał, jeśli jesteś na starcie po adopcji.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
        description: 'Dobry start, jeśli chcesz ustalić plan na pierwsze dni z psem.',
      },
      {
        label: 'Niezbędnik',
        href: '/niezbednik',
        description: 'Materiały do spokojnego uporządkowania tematu po lekturze.',
      },
    ],
  },
  {
    slug: 'kiedy-behawiorysta-kiedy-trener-psa',
    fileName: '10-wpis-kiedy-behawiorysta-kiedy-trener.md',
    publishedAt: '2026-04-09',
    categoryLabel: 'Konsultacja',
    categoryHref: '/konsultacja-behawioralna-online',
    topic: 'konsultacja',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min'),
    supportLinks: [
      {
        label: 'O mnie',
        href: '/o-mnie',
        description: 'Jak pracuję i skąd wynika moje podejście do takich tematów.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min'),
        description: 'Jeśli chcesz spokojnie sprawdzić, jaki rodzaj pomocy ma sens.',
      },
      {
        label: 'Opinie',
        href: '/opinie',
        description: 'Krótkie głosy opiekunów po rozmowach i konsultacjach.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Przejdź do strony dla opiekunów psów.',
      },
    ],
  },
  {
    slug: 'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic',
    fileName: '11-wpis-behawiorysta-zoopsycholog-trener.md',
    publishedAt: '2026-04-08',
    categoryLabel: 'Konsultacja',
    categoryHref: '/konsultacja-behawioralna-online',
    topic: 'konsultacja',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min'),
    supportLinks: [
      {
        label: 'O mnie',
        href: '/o-mnie',
        description: 'Jeśli chcesz sprawdzić kwalifikacje i sposób pracy.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min'),
        description: 'Dobry start, jeśli chcesz ustalić, do kogo zgłosić się z własnym tematem.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Pomoc dla opiekunów psów.',
      },
      {
        label: 'Koty',
        href: '/koty',
        description: 'Pomoc dla opiekunów kotów.',
      },
    ],
  },
  {
    slug: 'ile-kosztuje-konsultacja-behawioralna',
    fileName: '12-wpis-ile-kosztuje-konsultacja-behawioralna.md',
    publishedAt: '2026-04-07',
    categoryLabel: 'Cennik',
    categoryHref: '/cennik',
    topic: 'konsultacja',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min'),
    supportLinks: [
      {
        label: 'Cennik',
        href: '/cennik',
        description: 'Aktualne ceny i publiczne warianty pomocy.',
      },
      {
        label: 'Konsultacja online',
        href: '/konsultacja-behawioralna-online',
        description: 'Szczegóły dłuższej konsultacji 60 min.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min'),
        description: 'Najprostszy pierwszy krok, jeśli chcesz zacząć bez dużego progu.',
      },
      {
        label: 'O mnie',
        href: '/o-mnie',
        description: 'Jeśli chcesz sprawdzić, jak pracuję.',
      },
    ],
  },
  {
    slug: 'czym-jest-coape-behawiorysta-po-tej-szkole',
    fileName: '13-wpis-czym-jest-coape.md',
    publishedAt: '2026-04-06',
    categoryLabel: 'O mnie',
    categoryHref: '/o-mnie',
    topic: 'konsultacja',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min'),
    supportLinks: [
      {
        label: 'O mnie',
        href: '/o-mnie',
        description: 'Kwalifikacje, afiliacje i sposób pracy opisane w jednym miejscu.',
      },
      {
        label: 'Behawiorysta czy trener',
        href: '/blog/behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic',
        description: 'Powiązany wpis o wyborze odpowiedniej pomocy.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min'),
        description: 'Jeśli chcesz omówić swój temat po lekturze.',
      },
      {
        label: 'Psy',
        href: '/psy',
        description: 'Przejdź do strony dla opiekunów psów.',
      },
    ],
  },
]

const BLOG_POST_ORDER = BLOG_POST_CONFIGS.map((config) => config.slug)
const BLOG_POSTS = BLOG_POST_CONFIGS.map(buildBlogPostFromConfig)
const BLOG_POST_BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post] as const))

function readBlogFile(fileName: string): string {
  return readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim()

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function parseFrontmatter(source: string): { frontmatter: Frontmatter; body: string } {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)

  if (!match) {
    return { frontmatter: {}, body: source }
  }

  const frontmatterLines = match[1].split(/\r?\n/)
  const frontmatter: Frontmatter = {}

  for (const line of frontmatterLines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf(':')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = stripWrappingQuotes(trimmed.slice(separatorIndex + 1))

    if (!value) {
      continue
    }

    if (key === 'slug' || key === 'title_seo' || key === 'meta_description' || key === 'h1' || key === 'author' || key === 'publishedAt') {
      frontmatter[key] = value
    }
  }

  return {
    frontmatter,
    body: match[2],
  }
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function normalizeForComparison(value: string): string {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[„”"]/g, '')
    .replace(/\u00a0/g, ' ')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isSafeHref(href: string): boolean {
  const normalized = href.trim().toLowerCase()

  return (
    normalized.startsWith('/') ||
    normalized.startsWith('#') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('tel:')
  )
}

function normalizeBlogHref(href: string, audioHref: string): string | null {
  const trimmed = href.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.toLowerCase().startsWith('/call')) {
    return audioHref
  }

  if (isSafeHref(trimmed)) {
    return trimmed
  }

  return null
}

function renderInlineMarkdown(text: string, audioHref: string): string {
  let html = escapeHtml(text)

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const normalizedHref = normalizeBlogHref(href, audioHref)

    if (!normalizedHref) {
      return label
    }

    return `<a href="${escapeHtml(normalizedHref)}">${label}</a>`
  })

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(?!\s)(.+?)(?<!\s)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  return html
}

function parseMarkdownBlocks(source: string): BlogMarkdownBlock[] {
  const normalizedSource = source.replace(/\r\n/g, '\n')
  const lines = normalizedSource.split('\n')
  const blocks: BlogMarkdownBlock[] = []
  let index = 0

  const isHeadingLine = (line: string) => /^#{1,6}\s+/.test(line)
  const isListLine = (line: string) => /^(?:- |\* |\d+\.\s+)/.test(line)

  while (index < lines.length) {
    const line = lines[index] ?? ''
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      index += 1
      const codeLines: string[] = []

      while (index < lines.length && !(lines[index]?.trim() ?? '').startsWith('```')) {
        codeLines.push(lines[index] ?? '')
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push({
        type: 'code',
        text: codeLines.join('\n'),
      })
      continue
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []

      while (index < lines.length && (lines[index]?.trim() ?? '').startsWith('>')) {
        quoteLines.push((lines[index] ?? '').replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push({
        type: 'blockquote',
        text: quoteLines.join(' '),
      })
      continue
    }

    if (isHeadingLine(trimmed)) {
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/)

      if (headingMatch) {
        blocks.push({
          type: 'heading',
          depth: headingMatch[1].length,
          text: headingMatch[2]?.trim() ?? '',
        })
      }

      index += 1
      continue
    }

    if (isListLine(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed)
      const items: string[] = []

      while (index < lines.length && isListLine((lines[index] ?? '').trim())) {
        const currentLine = (lines[index] ?? '').trim()
        const currentItem = ordered
          ? currentLine.replace(/^\d+\.\s+/, '')
          : currentLine.replace(/^(?:- |\* )/, '')

        items.push(currentItem)
        index += 1
      }

      blocks.push({
        type: 'list',
        ordered,
        items,
      })
      continue
    }

    const paragraphLines: string[] = []

    while (index < lines.length) {
      const currentLine = lines[index] ?? ''
      const currentTrimmed = currentLine.trim()

      if (!currentTrimmed) {
        break
      }

      if (currentTrimmed.startsWith('```') || currentTrimmed.startsWith('>') || isHeadingLine(currentTrimmed) || isListLine(currentTrimmed)) {
        break
      }

      paragraphLines.push(currentTrimmed)
      index += 1
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraphLines.join(' '),
      })
      continue
    }

    index += 1
  }

  return blocks
}

function isSkipSectionHeading(text: string): boolean {
  return /linkowanie wewnętrzne/i.test(text)
}

function classifySectionHeading(text: string): 'intro' | 'faq' | 'cta' | 'default' {
  const normalized = normalizeForComparison(text)

  if (normalized === 'lead') {
    return 'intro'
  }

  if (normalized === 'faq') {
    return 'faq'
  }

  if (/^(chcesz|jeśli chcesz|jeżeli chcesz|jeśli dotarł|jeżeli dotarł)/i.test(normalized)) {
    return 'cta'
  }

  return 'default'
}

function countWords(source: string): number {
  const matches = source.match(/\p{L}[\p{L}\p{M}\p{N}'’-]*/gu)

  return matches?.length ?? 0
}

function estimateReadingTimeMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 190))
}

function formatDateLabel(dateValue: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateValue}T12:00:00.000Z`))
}

function renderMarkdownBlock(
  block: BlogMarkdownBlock,
  key: string,
  audioHref: string,
): ReactNode {
  switch (block.type) {
    case 'heading':
      return React.createElement(`h${Math.min(block.depth, 6)}`, {
        key,
        dangerouslySetInnerHTML: {
          __html: renderInlineMarkdown(block.text, audioHref),
        },
      })
    case 'paragraph':
      return React.createElement('p', {
        key,
        dangerouslySetInnerHTML: {
          __html: renderInlineMarkdown(block.text, audioHref),
        },
      })
    case 'list':
      return React.createElement(
        block.ordered ? 'ol' : 'ul',
        { key },
        block.items.map((item, index) =>
          React.createElement('li', {
            key: `${key}-${index}`,
            dangerouslySetInnerHTML: {
              __html: renderInlineMarkdown(item, audioHref),
            },
          }),
        ),
      )
    case 'blockquote':
      return React.createElement(
        'blockquote',
        { key },
        React.createElement('p', {
          dangerouslySetInnerHTML: {
            __html: renderInlineMarkdown(block.text, audioHref),
          },
        }),
      )
    case 'code':
      return React.createElement('pre', { key }, React.createElement('code', null, block.text))
    case 'hr':
      return React.createElement('hr', { key })
  }
}

function renderBlogSection(
  section: {
    heading: BlogMarkdownHeadingBlock | null
    blocks: BlogMarkdownBlock[]
    key: string
  },
  audioHref: string,
): ReactNode {
  const headingText = section.heading?.text ?? ''
  const sectionType = section.heading ? classifySectionHeading(section.heading.text) : 'default'
  const sectionClasses = ['blog-content-section']

  if (sectionType !== 'default') {
    sectionClasses.push(`blog-content-section--${sectionType}`)
  }

  if (section.heading?.depth === 2 && /faq/i.test(headingText)) {
    sectionClasses.push('blog-content-section--faq')
  }

  const headingNode =
    section.heading && sectionType !== 'intro'
      ? React.createElement(`h${Math.min(section.heading.depth, 6)}`, {
          key: `${section.key}-heading`,
          className: 'blog-content-heading',
          dangerouslySetInnerHTML: {
            __html: renderInlineMarkdown(section.heading.text, audioHref),
          },
        })
      : section.heading && sectionType === 'intro'
        ? React.createElement(
            'div',
            {
              key: `${section.key}-heading`,
              className: 'blog-content-kicker',
            },
            section.heading.text,
          )
        : null

  return React.createElement(
    'section',
    {
      key: section.key,
      className: sectionClasses.join(' '),
    },
    headingNode,
    React.createElement(
      'div',
      { className: 'blog-content-section-body' },
      section.blocks.map((block, blockIndex) =>
        renderMarkdownBlock(block, `${section.key}-${blockIndex}`, audioHref),
      ),
    ),
  )
}

function renderBlogContentBlocks(post: BlogPost): ReactNode[] {
  const nodes: ReactNode[] = []
  let currentSection: { heading: BlogMarkdownHeadingBlock | null; blocks: BlogMarkdownBlock[]; key: string } | null = null
  let sectionCount = 0
  let skippedArticleTitle = false
  let skipSection = false

  const flushSection = () => {
    if (!currentSection) {
      return
    }

    if (currentSection.heading === null && currentSection.blocks.length === 0) {
      currentSection = null
      return
    }

    nodes.push(renderBlogSection(currentSection, post.audioHref))
    currentSection = null
  }

  for (const block of post.blocks) {
    if (block.type === 'heading' && block.depth === 1 && !skippedArticleTitle) {
      skippedArticleTitle = true
      continue
    }

    if (block.type === 'heading' && block.depth <= 2) {
      flushSection()
      skipSection = isSkipSectionHeading(block.text)

      if (skipSection) {
        continue
      }

      currentSection = {
        heading: block,
        blocks: [],
        key: `${post.slug}-section-${sectionCount += 1}`,
      }
      continue
    }

    if (skipSection) {
      continue
    }

    if (!currentSection) {
      currentSection = {
        heading: null,
        blocks: [],
        key: `${post.slug}-section-${sectionCount += 1}`,
      }
    }

    currentSection.blocks.push(block)
  }

  flushSection()

  return nodes
}

function buildBlogPostFromConfig(config: BlogPostConfig): BlogPost {
  const source = readBlogFile(config.fileName)
  const { frontmatter, body } = parseFrontmatter(source)
  const blocks = parseMarkdownBlocks(body)
  const slug = frontmatter.slug ?? config.slug
  const title = frontmatter.h1 ?? frontmatter.title_seo ?? config.slug
  const seoTitle = frontmatter.title_seo ?? title
  const metaDescription = frontmatter.meta_description ?? `Wpis blogowy marki ${SITE_SHORT_NAME}.`
  const excerpt = metaDescription
  const publishedAt = frontmatter.publishedAt ?? config.publishedAt
  const author = frontmatter.author ?? BLOG_AUTHOR_NAME
  const bodyWordCount = countWords(
    body
      .replace(/^##\s+Linkowanie wewnętrzne[\s\S]*$/im, '')
      .replace(/^#\s+.*$/m, '')
      .replace(/^---[\s\S]*?---\s*/m, ''),
  )

  return {
    slug,
    title,
    seoTitle,
    metaDescription,
    excerpt,
    h1: frontmatter.h1 ?? title,
    author,
    publishedAt,
    publishedAtLabel: formatDateLabel(publishedAt),
    readingTimeMinutes: estimateReadingTimeMinutes(bodyWordCount),
    wordCount: bodyWordCount,
    categoryLabel: config.categoryLabel,
    categoryHref: config.categoryHref,
    topic: config.topic,
    audioHref: config.audioHref,
    supportLinks: config.supportLinks,
    path: `${BLOG_ROUTE_BASE}/${slug}`,
    fileName: config.fileName,
    rawBody: body,
    blocks,
  }
}

export function listBlogPosts(): BlogPost[] {
  return [...BLOG_POST_ORDER.map((slug) => BLOG_POST_BY_SLUG.get(slug)).filter((post): post is BlogPost => Boolean(post))]
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return BLOG_POST_BY_SLUG.get(slug) ?? null
}

export function listBlogRoutePaths(): string[] {
  return [BLOG_ROUTE_BASE, ...BLOG_POSTS.map((post) => post.path)]
}

export function getBlogListingMetadata({ title, description, path: routePath }: BlogListingMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: routePath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ${SITE_SHORT_NAME}`,
      description,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'pl_PL',
      url: routePath,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_SHORT_NAME}`,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  }
}

export function getBlogPostMetadata({ post, description }: BlogPostMetadataInput): Metadata {
  return {
    title: post.seoTitle,
    description,
    alternates: {
      canonical: post.path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${post.seoTitle} | ${SITE_SHORT_NAME}`,
      description,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'pl_PL',
      url: post.path,
      section: post.categoryLabel,
      authors: [BLOG_AUTHOR_NAME],
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.seoTitle} | ${SITE_SHORT_NAME}`,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  }
}

export function getBlogArticleJsonLd(post: BlogPost, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle,
    description: post.metaDescription,
    author: {
      '@type': 'Person',
      name: BLOG_AUTHOR_NAME,
      url: new URL('/o-mnie', baseUrl).toString(),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: new URL(SITE_OG_IMAGE.url, baseUrl).toString(),
        width: SITE_OG_IMAGE.width,
        height: SITE_OG_IMAGE.height,
      },
    },
    mainEntityOfPage: new URL(post.path, baseUrl).toString(),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.categoryLabel,
    image: [new URL(SITE_OG_IMAGE.url, baseUrl).toString()],
    wordCount: post.wordCount,
    inLanguage: 'pl-PL',
  }
}

export function renderBlogPostContent(post: BlogPost): ReactNode[] {
  return renderBlogContentBlocks(post)
}

export const BLOG_POSTS_SITE_WIDE = BLOG_POSTS
