type NewsletterSegment = 'pies' | 'kot' | 'oba' | string

type MailerLiteSyncInput = {
  email: string
  segment?: NewsletterSegment | null
  sourcePage?: string | null
  location?: string | null
  name?: string | null
}

type MailerLiteSyncResult =
  | { status: 'skipped'; reason: 'not_configured' }
  | { status: 'synced' }
  | { status: 'failed'; reason: string }

function readEnv(name: string) {
  return process.env[name]?.trim() || null
}

function getNewsletterGroups(segment: NewsletterSegment | null | undefined) {
  const genericGroup = readEnv('MAILERLITE_GROUP_NEWSLETTER')
  const dogGroup = readEnv('MAILERLITE_GROUP_DOGS') ?? readEnv('NEXT_PUBLIC_MAILERLITE_DOGS_GROUP')
  const catGroup = readEnv('MAILERLITE_GROUP_CATS') ?? readEnv('NEXT_PUBLIC_MAILERLITE_CATS_GROUP')
  const bothGroup = readEnv('MAILERLITE_GROUP_BOTH')
  const groups = new Set<string>()

  if (genericGroup) groups.add(genericGroup)
  if (segment === 'pies' && dogGroup) groups.add(dogGroup)
  if (segment === 'kot' && catGroup) groups.add(catGroup)

  if (segment === 'oba') {
    if (bothGroup) {
      groups.add(bothGroup)
    } else {
      if (dogGroup) groups.add(dogGroup)
      if (catGroup) groups.add(catGroup)
    }
  }

  return Array.from(groups)
}

export async function syncNewsletterSubscriber(input: MailerLiteSyncInput): Promise<MailerLiteSyncResult> {
  const apiKey = readEnv('MAILERLITE_API_KEY')

  if (!apiKey) {
    return { status: 'skipped', reason: 'not_configured' }
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        name: input.name || undefined,
        groups: getNewsletterGroups(input.segment),
        fields: {
          segment: input.segment ?? 'oba',
          source_page: input.sourcePage ?? undefined,
          location: input.location ?? undefined,
        },
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      return { status: 'failed', reason: body.slice(0, 240) || `HTTP ${response.status}` }
    }

    return { status: 'synced' }
  } catch (error) {
    return { status: 'failed', reason: error instanceof Error ? error.message : 'unknown_error' }
  }
}
