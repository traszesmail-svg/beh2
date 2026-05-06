import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import {
  getRealCaseProofPills,
  getRealCaseSpeciesLabel,
  getRealCaseStudyPath,
  type RealCaseStudy,
} from '@/lib/real-case-studies'

const CASE_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '/branding/case-studies/Border_Collie.jpg': { width: 600, height: 775 },
  '/branding/topic-cards/french-bulldog-leash.jpg': { width: 1400, height: 1050 },
  '/branding/topic-cards/dog-window-alone.jpg': { width: 1400, height: 1050 },
  '/images/cutover/dog-separation.png': { width: 1024, height: 1536 },
  '/branding/case-studies/labrador_luksi01.jpg': { width: 1024, height: 768 },
  '/branding/topic-cards/dog-resting-home.jpg': { width: 1200, height: 900 },
  '/images/cutover/dog-puppy-home.png': { width: 1024, height: 1536 },
  '/branding/case-cat-sofa.jpg': { width: 1200, height: 900 },
  '/branding/topic-cards/cats/cat-litter-box.jpg': { width: 1200, height: 900 },
  '/branding/topic-cards/cats/cat-intercat-conflict.jpg': { width: 1200, height: 900 },
  '/branding/case-cat-snow.jpg': { width: 1200, height: 900 },
  '/branding/topic-cards/cats/cat-anxious-hiding.jpg': { width: 384, height: 256 },
  '/branding/case-cat-scratcher.jpg': { width: 1200, height: 900 },
  '/branding/topic-cards/cats/cat-night-meowing.jpg': { width: 1400, height: 1050 },
}

export function getCaseImageDimensions(imageSrc: string) {
  return CASE_IMAGE_DIMENSIONS[imageSrc] ?? { width: 1200, height: 900 }
}

export function resolveCaseImageSrc(imageSrc: string, remoteSrc?: string) {
  const localPath = path.join(process.cwd(), 'public', imageSrc.replace(/^\//, ''))
  return existsSync(localPath) ? imageSrc : remoteSrc ?? imageSrc
}

type CaseStudyCardProps = {
  caseStudy: RealCaseStudy
  priority?: boolean
}

export function CaseStudyCard({ caseStudy, priority = false }: CaseStudyCardProps) {
  const leadImage = caseStudy.images[0]
  const dimensions = leadImage ? getCaseImageDimensions(leadImage.src) : { width: 1200, height: 900 }
  const proofPills = getRealCaseProofPills(caseStudy).slice(0, 3)

  return (
    <Link href={getRealCaseStudyPath(caseStudy)} prefetch={false} className="notatnik-case-card" data-species={caseStudy.species}>
      {leadImage ? (
        <span className="notatnik-case-media" aria-hidden="true">
          <Image
            src={resolveCaseImageSrc(leadImage.src, leadImage.remoteSrc)}
            alt=""
            width={dimensions.width}
            height={dimensions.height}
            sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
            priority={priority}
            className="notatnik-case-image"
          />
        </span>
      ) : null}

      <span className="notatnik-case-copy">
        <span className="notatnik-mono">{caseStudy.eyebrow}</span>
        <span className="notatnik-case-title">{caseStudy.headline}</span>
        <span className="notatnik-case-summary">{caseStudy.summary}</span>
        <span className="notatnik-case-meta" aria-label={`Kontekst: ${caseStudy.headline}`}>
          <span>{getRealCaseSpeciesLabel(caseStudy.species)}</span>
          <span>{caseStudy.breed}</span>
          <span>{caseStudy.age}</span>
        </span>
        <span className="notatnik-case-pills" aria-label="Zakres sytuacji">
          {proofPills.map((pill) => (
            <span key={`${caseStudy.id}-${pill}`}>{pill}</span>
          ))}
        </span>
        <span className="notatnik-case-action">Czytaj historie &rarr;</span>
      </span>
    </Link>
  )
}
