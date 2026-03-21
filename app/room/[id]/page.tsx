import { redirect } from 'next/navigation'

export default function LegacyRoomPage({ params }: { params: { id: string } }) {
  redirect(`/call/${params.id}`)
}
