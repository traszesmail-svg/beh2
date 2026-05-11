type BeforeAfterBlockProps = {
  beforeTitle?: string
  before: string
  afterTitle?: string
  after: string
}

export function BeforeAfterBlock({
  beforeTitle = 'Na początku',
  before,
  afterTitle = 'Po uporządkowaniu',
  after,
}: BeforeAfterBlockProps) {
  return (
    <div className="notatnik-before-after">
      <div className="notatnik-before-after-card">
        <div className="notatnik-mono">{beforeTitle}</div>
        <p>{before}</p>
      </div>
      <div className="notatnik-before-after-card is-after">
        <div className="notatnik-mono">{afterTitle}</div>
        <p>{after}</p>
      </div>
    </div>
  )
}
