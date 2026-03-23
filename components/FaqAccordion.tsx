'use client'

import { useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type FaqItem = {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="faq-list top-gap">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-trigger-${index}`

        return (
          <div key={item.q} className="faq-item">
            <h3 className="faq-heading">
              <button
                id={buttonId}
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  if (!isOpen) {
                    trackAnalyticsEvent('faq_open', { question: item.q, index: index + 1 })
                  }

                  setOpenIndex(isOpen ? null : index)
                }}
              >
                <span>{item.q}</span>
                <span className="faq-chevron" aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="faq-answer"
            >
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
