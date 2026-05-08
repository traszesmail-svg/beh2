export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'Stary formularz PDF jest wycofany. Aktualne materiały są dostępne pod /materiały.',
      redirectTo: '/materialy',
    },
    { status: 410 },
  )
}
