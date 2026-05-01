import { NextResponse } from 'next/server'
import { reviews, aggregateRating } from '@/lib/reviews.config'

export const revalidate = 86400

export async function GET() {
  return NextResponse.json({
    reviews,
    aggregateRating,
    source: 'file',
  })
}
