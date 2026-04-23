type SchemaProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

export function Schema({ data }: SchemaProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
