import { redirect } from 'next/navigation'

function toSearchParamsString(searchParams?: Record<string, string | string[] | undefined>) {
  if (!searchParams) {
    return ''
  }

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          params.append(key, item)
        }
      }
      continue
    }

    if (typeof value === 'string') {
      params.set(key, value)
    }
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

export default function LegacyRoomPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  redirect(`/call/${params.id}${toSearchParamsString(searchParams)}`)
}
