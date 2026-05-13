type FaqItem = {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list top-gap">
      {items.map((item, index) => {
        const panelId = `faq-panel-${index}`
        const headingId = `faq-heading-${index}`

        return (
          <article key={item.q} className="faq-item">
            <h3 id={headingId} className="faq-heading">
              <span className="faq-trigger">
                <span>{item.q}</span>
              </span>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              className="faq-answer"
            >
              {item.a}
            </div>
          </article>
        )
      })}
    </div>
  )
}
