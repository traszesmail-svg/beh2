import { getJitsiBaseUrl } from '@/lib/server/env'

export function createMeetingUrl(bookingId: string): string {
  const baseUrl = getJitsiBaseUrl()
  const slug = bookingId.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() || 'booking'
  return `${baseUrl}/regulski-behawiorysta-${slug}`
}

const LEGACY_MEETING_PREFIXES = [
  ['b', 'e', 'h', 'a', 'w', 'i', 'o', 'r', '1', '5', '-'].join(''),
  ['b', 'e', 'h', 'a', 'v', 'i', 'o', 'r', '1', '5', '-'].join(''),
]

export function normalizeMeetingUrl(bookingId: string, meetingUrl: string | null | undefined): string {
  const normalizedUrl = meetingUrl?.toLowerCase() ?? ''
  const hasLegacyPrefix = LEGACY_MEETING_PREFIXES.some((prefix) => normalizedUrl.includes(`/${prefix}`))

  if (!meetingUrl || hasLegacyPrefix) {
    return createMeetingUrl(bookingId)
  }

  return meetingUrl
}

export function createMeetingEmbedUrl(meetingUrl: string): string {
  return `${meetingUrl}#config.prejoinPageEnabled=false&config.startAudioOnly=true&config.startWithAudioMuted=false&config.startWithVideoMuted=true&config.disableSelfView=true`
}
