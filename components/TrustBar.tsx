// handoff/components/TrustBar.tsx
// PASEK KWALIFIKACJI — wstaw w layout głównym pod nawigacją
// Pokazuje się na KAŻDEJ stronie i podstronie

import { TrustBar as Bar } from '@/components/CredBadge';

export default function TrustBar() {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
        <Bar />
      </div>
    </div>
  );
}

/*
Użycie w app/layout.tsx (Next.js App Router):

import TrustBar from '@/components/TrustBar';

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Header />
        <TrustBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
*/
