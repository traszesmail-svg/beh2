'use client';

import { usePathname } from 'next/navigation';
import { LeadMagnetPopup } from '@/components/LeadMagnetPopup';
import { LeadMagnetBanner } from '@/components/LeadMagnetBanner';

// Wyklucz strony gdzie popup byłby nie na miejscu
const EXCLUDED_PATHS = ['/book', '/admin', '/polityka-prywatnosci', '/regulamin'];

export function LeadMagnetGlobal() {
  const pathname = usePathname() ?? '/';
  if (EXCLUDED_PATHS.some(p => pathname.startsWith(p))) return null;

  return (
    <>
      <LeadMagnetPopup pathname={pathname} />
      <LeadMagnetBanner pathname={pathname} />
    </>
  );
}
