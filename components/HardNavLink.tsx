'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

type HardNavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  className?: string
}

export function HardNavLink({ href, onClick, ...props }: HardNavLinkProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      {...props}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented) {
          return
        }

        event.preventDefault()
        window.location.assign(href)
      }}
    />
  )
}
