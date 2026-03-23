import { redirect } from 'next/navigation'
import { isProblemType } from '@/lib/data'

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default function LegacyProblemPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readSearchParam(searchParams?.problem)

  if (isProblemType(problem)) {
    redirect(`/book?problem=${problem}`)
  }

  redirect('/book')
}
