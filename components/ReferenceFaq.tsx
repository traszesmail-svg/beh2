'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  CalendarDays,
  Cat,
  ChevronDown,
  CreditCard,
  MessageCircleQuestion,
  Minus,
  Monitor,
  PawPrint,
  Plus,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { referenceFaqCategories, referenceFaqItems, type ReferenceFaqCategory } from '@/lib/reference-faq'

type ReferenceFaqProps = {
  contactHref: string
}

function CategoryIcon({ icon }: { icon: (typeof referenceFaqCategories)[number]['icon'] }) {
  if (icon === 'calendar') return <CalendarDays size={25} strokeWidth={1.7} aria-hidden="true" />
  if (icon === 'paw') return <PawPrint size={25} strokeWidth={1.7} aria-hidden="true" />
  if (icon === 'cat') return <Cat size={25} strokeWidth={1.7} aria-hidden="true" />
  if (icon === 'payment') return <CreditCard size={25} strokeWidth={1.7} aria-hidden="true" />
  if (icon === 'screen') return <Monitor size={25} strokeWidth={1.7} aria-hidden="true" />
  return <MessageCircleQuestion size={25} strokeWidth={1.7} aria-hidden="true" />
}

export function ReferenceFaq({ contactHref }: ReferenceFaqProps) {
  const [activeCategory, setActiveCategory] = useState<ReferenceFaqCategory | 'all'>('all')
  const [openId, setOpenId] = useState(referenceFaqItems[0]?.id ?? '')
  const [showAll, setShowAll] = useState(false)

  const categoryCounts = useMemo(() => {
    return referenceFaqCategories.reduce<Record<ReferenceFaqCategory, number>>((counts, category) => {
      counts[category.id] = referenceFaqItems.filter((item) => item.category === category.id).length

      return counts
    }, {} as Record<ReferenceFaqCategory, number>)
  }, [])

  const filteredItems = useMemo(() => {
    return referenceFaqItems.filter((item) => activeCategory === 'all' || item.category === activeCategory)
  }, [activeCategory])

  const visibleItems = showAll || activeCategory !== 'all' ? filteredItems : filteredItems.slice(0, 15)

  function toggleOpen(id: string, question: string, index: number) {
    const nextId = openId === id ? '' : id
    setOpenId(nextId)

    if (nextId) {
      trackAnalyticsEvent('faq_open', { location: 'reference-faq', question, index: index + 1 })
    }
  }

  return (
    <>
      <section className="reference-hero reference-faq-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">FAQ</span>
          <h1>Najczęstsze pytania i odpowiedzi.</h1>
          <p>
            Zebrałem najczęstsze pytania opiekunów psów i kotów. Jeśli nie znajdziesz odpowiedzi - napisz do mnie,
            chętnie pomogę.
          </p>
          <div className="reference-hero-actions">
            <Link href="/wybor" prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href={contactHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Wyślij krótką wiadomość
            </Link>
          </div>
        </div>
        <div className="reference-hero-art reference-hero-art-photo">
          <Image
            src="/branding/side-visuals/blog-laptop-notes.jpg"
            alt="Opiekun szuka informacji przy komputerze"
            width={960}
            height={720}
            priority
          />
        </div>
      </section>

      <section className="reference-category-grid" aria-label="Kategorie FAQ">
        {referenceFaqCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`reference-category-card${
              activeCategory === category.id || (activeCategory === 'all' && category.id === 'wspolpraca') ? ' is-active' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <CategoryIcon icon={category.icon} />
            <span>
              <strong>{category.label}</strong>
              <small>{categoryCounts[category.id]} pytań</small>
            </span>
          </button>
        ))}
      </section>

      <section className="reference-main-layout">
        <div className="reference-faq-list-wrap">
          <h2>Popularne pytania</h2>
          <div className="reference-faq-list">
            {visibleItems.map((item, index) => {
                const isOpen = openId === item.id

                return (
                  <article key={item.id} className={`reference-faq-item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="reference-faq-question"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      onClick={() => toggleOpen(item.id, item.question, index)}
                    >
                      <span className="reference-faq-number">{String(index + 1).padStart(2, '0')}</span>
                      <span>{item.question}</span>
                      {isOpen ? <Minus size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
                    </button>
                    <div id={`faq-answer-${item.id}`} className="reference-faq-answer" hidden={!isOpen}>
                      <p>{item.answer}</p>
                    </div>
                  </article>
                )
              })}
          </div>
          {activeCategory === 'all' && filteredItems.length > 15 ? (
            <button type="button" className="reference-show-all" onClick={() => setShowAll((value) => !value)}>
              {showAll ? 'Pokaż mniej pytań' : 'Zobacz wszystkie pytania'}
              <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <aside className="reference-sidebar">
          <div className="reference-side-card">
            <h2>Szybkie odpowiedzi</h2>
            <div className="reference-info-list">
              <div className="reference-info-row">
                <CalendarDays size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Odpowiedź w 1-2 dni robocze</strong>
                  <small>Zwykle odpisuję w ciągu 1-2 dni roboczych.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <MessageCircleQuestion size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Bez oceniania</strong>
                  <small>Każda sytuacja jest inna. Jesteś w dobrych rękach.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <PawPrint size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Psy i koty</strong>
                  <small>Pracuję z psami i kotami w każdym wieku.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <Monitor size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Online w całej Polsce</strong>
                  <small>Spokojna rozmowa bez stresu dla zwierzęcia.</small>
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}
