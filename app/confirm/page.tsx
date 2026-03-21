import { redirect } from 'next/navigation'

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default function LegacyConfirmPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const id = readSearchParam(searchParams?.id)

  if (id) {
    redirect(`/confirmation?bookingId=${id}`)
  }

  redirect('/problem')
}
