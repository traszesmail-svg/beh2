import { getJitsiBaseUrl } from '@/lib/server/env'

export function createMeetingUrl(bookingId: string): string {
  const baseUrl = getJitsiBaseUrl()
  const slug = bookingId.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() || 'booking'
  return `${baseUrl}/behawior15-${slug}`
}

export function createMeetingEmbedUrl(meetingUrl: string): string {
  return `${meetingUrl}#config.prejoinPageEnabled=false&config.startAudioOnly=true&config.startWithAudioMuted=false&config.startWithVideoMuted=true&config.disableSelfView=true`
}
