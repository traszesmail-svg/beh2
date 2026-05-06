import 'server-only'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import React, { type ReactNode } from 'react'
import { buildBookHref } from '@/lib/booking-routing'
import { repairCopy } from '@/lib/copy'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SPECIALIST_NAME } from '@/lib/site'

export type BlogTopic = 'pies' | 'koty' | 'konsultacja'

export type BlogSupportLink = {
  label: string
  href: string
  description: string
}

export type BlogPostCover = {
  src: string
  alt: string
  width: number
  height: number
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
  cover: BlogPostCover
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
const DOG_AUDIO_HREF = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const CAT_AUDIO_HREF = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const GENERIC_AUDIO_HREF = buildBookHref(null, 'szybka-konsultacja-15-min')
const BLOG_COVER_WIDTH = 640
const BLOG_COVER_HEIGHT = 400

const BLOG_COVER_BY_SLUG: Record<string, BlogPostCover> = {
  'szczeniak-pierwsza-noc': {
    src: '/branding/niezbednik/pdf-puppy.jpg',
    alt: 'Młody pies w domowym otoczeniu podczas pierwszych dni po adopcji.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'dlaczego-moj-pies-szczeka-na-inne-psy': {
    src: '/images/cutover/dog-spacer-reactivity.png',
    alt: 'Pies na smyczy obserwujący otoczenie podczas spaceru.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'pies-wyje-kiedy-zostaje-sam': {
    src: '/images/cutover/dog-separation.png',
    alt: 'Pies sam w domu obserwujący świat zza okna.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'kot-zalatwia-sie-poza-kuweta': {
    src: '/images/cutover/cat-kuweta.png',
    alt: 'Kot przy kuwecie w domowej przestrzeni.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-wyglada-konsultacja-behawioralna-online': {
    src: '/blog-covers/consultation.jpg',
    alt: 'Biurko przygotowane do konsultacji behawioralnej online.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'pies-ciagnie-na-smyczy': {
    src: '/images/cutover/dog-spacer-reactivity.png',
    alt: 'Pies na smyczy podczas pracy nad spokojnym spacerem.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'kot-drapie-meble': {
    src: '/branding/niezbednik/product-cat-scratcher.jpg',
    alt: 'Domowy drapak jako bezpieczne miejsce do drapania dla kota.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'nowy-pies-pierwsze-72-godziny': {
    src: '/branding/topic-cards/dog-resting-home.jpg',
    alt: 'Pies odpoczywający w domu po zmianie otoczenia.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'kiedy-behawiorysta-kiedy-trener-psa': {
    src: '/blog-covers/specialist.jpg',
    alt: 'Notatki specjalisty podczas omawiania problemu psa.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic': {
    src: '/blog-covers/specialist.jpg',
    alt: 'Materiały konsultacyjne na biurku specjalisty.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'ile-kosztuje-konsultacja-behawioralna': {
    src: '/blog-covers/money.jpg',
    alt: 'Notatnik i dokumenty używane przy porównaniu kosztu konsultacji.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'czym-jest-coape-behawiorysta-po-tej-szkole': {
    src: '/blog-covers/specialist.jpg',
    alt: 'Biurko specjalisty z materiałami edukacyjnymi.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-przygotowac-sie-do-konsultacji-behawioralnej-online': {
    src: '/blog-covers/consultation.jpg',
    alt: 'Laptop i notatki przygotowane do konsultacji online.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy': {
    src: '/images/cutover/dog-spacer-reactivity.png',
    alt: 'Pies na smyczy podczas ćwiczenia spokojniejszego spaceru.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-nagrac-psa-zostawionego-samemu': {
    src: '/images/cutover/dog-separation.png',
    alt: 'Pies zostawiony sam w domu, obserwowany przy oknie.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'rutyna-wyjscia-oswajanie-psa-z-samotnoscia': {
    src: '/branding/topic-cards/dog-window-alone.jpg',
    alt: 'Pies czekający w domu przy oknie podczas pracy nad samotnością.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-wybrac-kuwete-i-zwirek-dla-kota': {
    src: '/images/cutover/cat-kuweta.png',
    alt: 'Kot przy kuwecie i spokojnie zorganizowanej przestrzeni.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'stres-kota-a-zachowania-toaletowe': {
    src: '/images/cutover/cat-stress.png',
    alt: 'Kot obserwujący otoczenie w napięciu.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-wprowadzic-nowego-kota-do-domu': {
    src: '/images/cutover/cat-conflict.png',
    alt: 'Dwa koty w domu podczas spokojnego zapoznawania.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'agresja-przekierowana-u-kota': {
    src: '/branding/topic-cards/cats/cat-touch-defensive.jpg',
    alt: 'Kot reagujący napięciem podczas bliskiego kontaktu z opiekunem.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'pies-ciagnie-na-smyczy-od-czego-zaczac': {
    src: '/images/cutover/dog-spacer-reactivity.png',
    alt: 'Pies na smyczy podczas pierwszych ćwiczeń spacerowych.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-nauczyc-psa-zostawania-samemu': {
    src: '/images/cutover/dog-separation.png',
    alt: 'Pies sam w domu podczas treningu zostawania samemu.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-ustawic-kuwete-dla-kota': {
    src: '/images/cutover/cat-kuweta.png',
    alt: 'Kot przy kuwecie ustawionej w spokojnym miejscu.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
  'jak-zapoznac-dwa-koty': {
    src: '/images/cutover/cat-conflict.png',
    alt: 'Dwa koty w jednym domu podczas stopniowego zapoznawania.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  },
}

function getFallbackBlogCover(categoryHref: string): BlogPostCover {
  if (categoryHref === '/koty') {
    return {
      src: '/blog-covers/cat-general.jpg',
      alt: 'Kot w domowym otoczeniu.',
      width: BLOG_COVER_WIDTH,
      height: BLOG_COVER_HEIGHT,
    }
  }

  if (categoryHref === '/psy') {
    return {
      src: '/blog-covers/dog-reactive.jpg',
      alt: 'Pies podczas spaceru z opiekunem.',
      width: BLOG_COVER_WIDTH,
      height: BLOG_COVER_HEIGHT,
    }
  }

  return {
    src: '/blog-covers/consultation.jpg',
    alt: 'Notatki i laptop przygotowane do konsultacji online.',
    width: BLOG_COVER_WIDTH,
    height: BLOG_COVER_HEIGHT,
  }
}

export function getBlogPostCover(post: Pick<BlogPost, 'slug' | 'categoryHref'>): BlogPostCover {
  return BLOG_COVER_BY_SLUG[post.slug] ?? getFallbackBlogCover(post.categoryHref)
}

const SERVICE_LANDING_LINK: BlogSupportLink = {
  label: 'Behawiorysta psow i kotow online',
  href: '/behawiorysta-online-polska',
  description: 'Glowna strona uslugi, jesli chcesz przejsc z tresci edukacyjnej do pelniejszego opisu pomocy.',
}

const CONSULTATION_PAGE_LINK: BlogSupportLink = {
  label: 'Konsultacja behawioralna online',
  href: '/konsultacja-behawioralna-online',
  description: 'Opis pelnej konsultacji, przebiegu rozmowy i tego, kiedy warto wejsc w szersza konsultacje.',
}

const PREP_GUIDE_LINK: BlogSupportLink = {
  label: 'Bezplatny material przygotowujacy',
  href: '/bezplatne-materialy/przygotowanie-do-konsultacji-online',
  description: 'Lekki przewodnik, jesli chcesz najpierw uporzadkowac opis problemu i przygotowanie do rozmowy.',
}

const REACTIVITY_LANDING_LINK: BlogSupportLink = {
  label: 'Reaktywnosc na smyczy',
  href: '/psy/reaktywnosc-na-smyczy',
  description: 'Glowny landing problemowy dla spacerow, szczekania, napiecia i pracy ponizej progu.',
}

const REACTIVITY_GUIDE_LINK: BlogSupportLink = {
  label: 'Bezplatny przewodnik dla reaktywnego psa',
  href: '/bezplatne-materialy/pies-reaktywnosc-5-krokow',
  description: 'Piec pierwszych krokow i prosty plan obserwacji, zanim zaczniesz dokladac kolejne techniki.',
}

const SEPARATION_LANDING_LINK: BlogSupportLink = {
  label: 'Lek separacyjny u psa',
  href: '/psy/lek-separacyjny',
  description: 'Glowny landing problemowy o zostawaniu samemu, diagnozie i pierwszym bezpiecznym planie.',
}

const SEPARATION_GUIDE_LINK: BlogSupportLink = {
  label: 'PDF: pies zostaje sam',
  href: '/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow',
  description: 'Material startowy o samotnosci psa, jesli chcesz najpierw spokojnie przeczytac plan pierwszych krokow.',
}

const LITTER_LANDING_LINK: BlogSupportLink = {
  label: 'Zalatwianie poza kuweta',
  href: '/koty/zalatwianie-poza-kuweta',
  description: 'Glowny landing problemowy o zdrowiu, kuwecie, stresie i kolejnosci sprawdzania przyczyn.',
}

const LITTER_GUIDE_LINK: BlogSupportLink = {
  label: 'Bezplatna checklista kuwety',
  href: '/bezplatne-materialy/kot-kuweta-checklista',
  description: 'Lista kontrolna zdrowia, kuwety i srodowiska, zanim zaczniesz zmieniac wszystko naraz.',
}

const CAT_CONFLICT_LANDING_LINK: BlogSupportLink = {
  label: 'Konflikt miedzy kotami',
  href: '/koty/konflikt-miedzy-kotami',
  description: 'Glowny landing problemowy dla napiecia, gonitw, blokowania zasobow i trudnych relacji w domu.',
}

const CAT_CONFLICT_GUIDE_LINK: BlogSupportLink = {
  label: 'PDF: konflikt miedzy kotami',
  href: '/oferta/poradniki-pdf/konflikt-miedzy-kotami-w-domu',
  description: 'Dalszy material, jesli chcesz przejsc od pojedynczego artykulu do spokojniejszego planu pracy w domu.',
}

const BLOG_POST_CONFIGS: BlogPostConfig[] = [
  {
    slug: 'szczeniak-pierwsza-noc',
    fileName: '30-wpis-szczeniak-pierwsza-noc.md',
    publishedAt: '2026-04-24',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
    supportLinks: [
      {
        label: 'Szczeniak / mlody pies',
        href: '/psy',
        description: 'Hub tematow psich, jesli pierwsza noc laczy sie z gryzieniem, pobudzeniem albo separacja.',
      },
      {
        label: 'PDF: Szczeniak pierwsze 30 dni',
        href: '/oferta/poradniki-pdf/szczeniak-pierwsze-30-dni',
        description: 'Szerszy material o pierwszym miesiacu, rytmie dnia, snie i bezpiecznych nawykach.',
      },
      {
        label: FUNNEL_CTA_LABELS.primary,
        href: buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies'),
        description: 'Dobry start, jesli chcesz omowic pierwsze noce i ustawic spokojniejszy rytm.',
      },
      {
        label: 'Quiz',
        href: '/quiz',
        description: 'Krotki wybor sciezki, jesli nie wiesz, czy wystarczy Kwadrans czy potrzeba szerszej rozmowy.',
      },
    ],
  },
  {
    slug: 'dlaczego-moj-pies-szczeka-na-inne-psy',
    fileName: '02-wpis-pies-szczeka-na-inne-psy.md',
    publishedAt: '2026-03-18',
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
    publishedAt: '2026-02-11',
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
    publishedAt: '2026-01-07',
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
    publishedAt: '2025-12-03',
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
    slug: 'pies-ciagnie-na-smyczy',
    fileName: '07-wpis-pies-cignie-na-smyczy.md',
    publishedAt: '2025-11-12',
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
    publishedAt: '2025-10-08',
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
    publishedAt: '2025-09-03',
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
    publishedAt: '2025-08-13',
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
    publishedAt: '2025-07-09',
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
    publishedAt: '2025-06-04',
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
        description: 'Szczegoly dluzszej konsultacji online.',
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
    publishedAt: '2025-05-14',
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
  {
    slug: 'jak-przygotowac-sie-do-konsultacji-behawioralnej-online',
    fileName: '14-wpis-jak-przygotowac-sie-do-konsultacji-online.md',
    publishedAt: '2025-04-02',
    categoryLabel: 'Konsultacja',
    categoryHref: '/konsultacja-behawioralna-online',
    topic: 'konsultacja',
    audioHref: GENERIC_AUDIO_HREF,
    supportLinks: [
      CONSULTATION_PAGE_LINK,
      PREP_GUIDE_LINK,
      {
        label: 'Cennik',
        href: '/cennik',
        description: 'Jesli po przygotowaniu chcesz od razu porownac dostepne formaty przed rezerwacja.',
      },
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy',
    fileName: '19-wpis-cwiczenie-luznej-smyczy.md',
    publishedAt: '2025-03-19',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: DOG_AUDIO_HREF,
    supportLinks: [
      REACTIVITY_LANDING_LINK,
      {
        label: 'Pies szczeka na inne psy',
        href: '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
        description: 'Warto to przeczytac razem z praktyka luznej smyczy, zeby lepiej nazwac emocje i wyzwalacze na spacerze.',
      },
      REACTIVITY_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-nagrac-psa-zostawionego-samemu',
    fileName: '20-wpis-jak-nagrac-psa-samemu.md',
    publishedAt: '2025-02-05',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: DOG_AUDIO_HREF,
    supportLinks: [
      SEPARATION_LANDING_LINK,
      {
        label: 'Pies wyje, kiedy zostaje sam',
        href: '/blog/pies-wyje-kiedy-zostaje-sam',
        description: 'Najblizszy artykul, jesli chcesz najpierw odroznic lek separacyjny od innych scenariuszy.',
      },
      SEPARATION_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'rutyna-wyjscia-oswajanie-psa-z-samotnoscia',
    fileName: '21-wpis-rutyna-wyjscia-oswajanie-z-samotnosciq.md',
    publishedAt: '2025-01-22',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: DOG_AUDIO_HREF,
    supportLinks: [
      SEPARATION_LANDING_LINK,
      {
        label: 'Jak nagrac psa zostawionego samemu',
        href: '/blog/jak-nagrac-psa-zostawionego-samemu',
        description: 'Daje material do oceny, jesli po pracy nad rutyna potrzebujesz lepiej zobaczyc, co napedza problem.',
      },
      SEPARATION_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-wybrac-kuwete-i-zwirek-dla-kota',
    fileName: '22-wpis-jak-wybrac-kuwete-i-zwirek.md',
    publishedAt: '2024-12-11',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      LITTER_LANDING_LINK,
      {
        label: 'Jak ustawic kuwete dla kota',
        href: '/blog/jak-ustawic-kuwete-dla-kota',
        description: 'Najblizszy tekst, jesli po wyborze kuwety chcesz od razu dopiac jej lokalizacje i liczbe.',
      },
      LITTER_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'stres-kota-a-zachowania-toaletowe',
    fileName: '23-wpis-stres-kota-a-zachowania-toaletowe.md',
    publishedAt: '2024-11-06',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      LITTER_LANDING_LINK,
      {
        label: 'Kot zalatwia sie poza kuweta',
        href: '/blog/kot-zalatwia-sie-poza-kuweta',
        description: 'Najszerszy wpis startowy, jesli chcesz zobaczyc cala sekwencje filtrow przed dalsza praca.',
      },
      LITTER_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-wprowadzic-nowego-kota-do-domu',
    fileName: '24-wpis-jak-wprowadzic-nowego-kota.md',
    publishedAt: '2024-10-23',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      CAT_CONFLICT_LANDING_LINK,
      {
        label: 'Jak zapoznac dwa koty',
        href: '/blog/jak-zapoznac-dwa-koty',
        description: 'Rozpisuje szerzej sam proces zapoznania, jesli ten etap w domu dopiero przed toba.',
      },
      CAT_CONFLICT_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'agresja-przekierowana-u-kota',
    fileName: '25-wpis-agresja-przekierowana-u-kota.md',
    publishedAt: '2024-09-18',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      CAT_CONFLICT_LANDING_LINK,
      {
        label: 'Jak zapoznac dwa koty',
        href: '/blog/jak-zapoznac-dwa-koty',
        description: 'Dobry kolejny tekst, jesli konflikt jest zwiazany z granicami, dystansem i powolnym wprowadzaniem kontaktu.',
      },
      CAT_CONFLICT_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'pies-ciagnie-na-smyczy-od-czego-zaczac',
    fileName: '26-wpis-pies-ciagnie-od-czego-zaczac.md',
    publishedAt: '2024-08-07',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: DOG_AUDIO_HREF,
    supportLinks: [
      REACTIVITY_LANDING_LINK,
      {
        label: 'Luzna smycz z reaktywnym psem',
        href: '/blog/reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy',
        description: 'Przechodzi z pojedynczej zasady w bardziej uporzadkowana procedure spacerowa.',
      },
      REACTIVITY_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-nauczyc-psa-zostawania-samemu',
    fileName: '27-wpis-jak-nauczyc-psa-zostawania-samemu.md',
    publishedAt: '2024-07-24',
    categoryLabel: 'Pies',
    categoryHref: '/psy',
    topic: 'pies',
    audioHref: DOG_AUDIO_HREF,
    supportLinks: [
      SEPARATION_LANDING_LINK,
      {
        label: 'Rutyna wyjscia i oswajanie z samotnoscia',
        href: '/blog/rutyna-wyjscia-oswajanie-psa-z-samotnoscia',
        description: 'Dalej porzadkuje prace krok po kroku, jesli chcesz utrzymac plan bez przeskakiwania etapow.',
      },
      SEPARATION_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-ustawic-kuwete-dla-kota',
    fileName: '28-wpis-jak-ustawic-kuwete-dla-kota.md',
    publishedAt: '2024-06-12',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      LITTER_LANDING_LINK,
      {
        label: 'Jak wybrac kuwete i zwirek',
        href: '/blog/jak-wybrac-kuwete-i-zwirek-dla-kota',
        description: 'Najblizszy tekst, jesli po ustawieniu kuwety chcesz jeszcze sprawdzic rozmiar, zwirek i typowe bledy wyboru.',
      },
      LITTER_GUIDE_LINK,
      SERVICE_LANDING_LINK,
    ],
  },
  {
    slug: 'jak-zapoznac-dwa-koty',
    fileName: '29-wpis-jak-zapoznac-dwa-koty.md',
    publishedAt: '2024-05-08',
    categoryLabel: 'Kot',
    categoryHref: '/koty',
    topic: 'koty',
    audioHref: CAT_AUDIO_HREF,
    supportLinks: [
      CAT_CONFLICT_LANDING_LINK,
      {
        label: 'Jak wprowadzic nowego kota do domu',
        href: '/blog/jak-wprowadzic-nowego-kota-do-domu',
        description: 'Dobry tekst siostrzany, jesli chcesz zaczac jeszcze krok wczesniej od calego procesu wdrozenia nowego kota.',
      },
      CAT_CONFLICT_GUIDE_LINK,
      SERVICE_LANDING_LINK,
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
  let html = escapeHtml(repairCopy(text))

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
  const repairedBody = repairCopy(body)
  const blocks = parseMarkdownBlocks(repairedBody)
  const slug = frontmatter.slug ?? config.slug
  const title = repairCopy(frontmatter.h1 ?? frontmatter.title_seo ?? config.slug)
  const seoTitle = repairCopy(frontmatter.title_seo ?? title)
  const metaDescription = repairCopy(frontmatter.meta_description ?? `Wpis blogowy marki ${SITE_SHORT_NAME}.`)
  const excerpt = metaDescription
  const publishedAt = frontmatter.publishedAt ?? config.publishedAt
  const author = repairCopy(frontmatter.author ?? BLOG_AUTHOR_NAME)
  const bodyWordCount = countWords(
    repairedBody
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
    h1: repairCopy(frontmatter.h1 ?? title),
    author,
    publishedAt,
    publishedAtLabel: formatDateLabel(publishedAt),
    readingTimeMinutes: estimateReadingTimeMinutes(bodyWordCount),
    wordCount: bodyWordCount,
    categoryLabel: repairCopy(config.categoryLabel),
    categoryHref: config.categoryHref,
    topic: config.topic,
    audioHref: config.audioHref,
    supportLinks: config.supportLinks.map((link) => ({
      ...link,
      label: repairCopy(link.label),
      description: repairCopy(link.description),
    })),
    cover: getBlogPostCover({ slug, categoryHref: config.categoryHref }),
    path: `${BLOG_ROUTE_BASE}/${slug}`,
    fileName: config.fileName,
    rawBody: repairedBody,
    blocks,
  }
}

export function listBlogPosts(): BlogPost[] {
  return [...BLOG_POST_ORDER.map((slug) => BLOG_POST_BY_SLUG.get(slug)).filter((post): post is BlogPost => Boolean(post))]
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return BLOG_POST_BY_SLUG.get(slug) ?? null
}

export function listRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(slug)

  if (!currentPost) {
    return []
  }

  const sameTopic = BLOG_POSTS.filter((post) => post.slug !== slug && post.topic === currentPost.topic)
  const sameCategory = BLOG_POSTS.filter(
    (post) => post.slug !== slug && post.categoryHref === currentPost.categoryHref && post.topic !== currentPost.topic,
  )

  return [...sameTopic, ...sameCategory].slice(0, limit)
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
  const cover = {
    url: post.cover.src,
    width: post.cover.width,
    height: post.cover.height,
    alt: post.cover.alt,
  }

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
      images: [cover],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.seoTitle} | ${SITE_SHORT_NAME}`,
      description,
      images: [post.cover.src],
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
    image: [new URL(post.cover.src, baseUrl).toString()],
    wordCount: post.wordCount,
    inLanguage: 'pl-PL',
  }
}

export function renderBlogPostContent(post: BlogPost): ReactNode[] {
  return renderBlogContentBlocks(post)
}

export const BLOG_POSTS_SITE_WIDE = BLOG_POSTS
