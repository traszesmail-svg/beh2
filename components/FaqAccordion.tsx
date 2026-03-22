type FaqItem = {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list top-gap">
      {items.map((item) => (
        <details key={item.q} className="faq-item">
          <summary className="faq-summary">
            <span>{item.q}</span>
            <span className="faq-chevron" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="faq-answer">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
