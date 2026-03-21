import { redirect } from 'next/navigation'

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default function LegacyBookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readSearchParam(searchParams?.problem)

  if (problem) {
    redirect(`/slot?problem=${problem}`)
  }

  redirect('/problem')
}
