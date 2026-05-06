import Image from 'next/image'

type PetLeafHeroArtProps = {
  className?: string
}

export function PetLeafHeroArt({ className }: PetLeafHeroArtProps) {
  return (
    <div className={className ? `pet-leaf-art ${className}` : 'pet-leaf-art'} aria-hidden="true">
      <span className="pet-leaf-art-blob" />
      <span className="pet-leaf-art-ground" />
      <Image
        src="/branding/homepage/choice-dog-clean.png"
        alt=""
        width={430}
        height={350}
        className="pet-leaf-art-dog"
        priority
      />
      <Image
        src="/branding/homepage/choice-cat-clean.png"
        alt=""
        width={330}
        height={350}
        className="pet-leaf-art-cat"
        priority
      />
      <span className="pet-leaf-branch">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}
