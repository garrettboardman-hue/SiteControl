import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const getDemoContent = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    // Sanitize slug to prevent path traversal
    const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
    const filePath = join(process.cwd(), 'public', 'demos', `${safeSlug}.html`)
    try {
      const html = await readFile(filePath, 'utf8')
      return html
    } catch {
      return null
    }
  })

export const Route = createFileRoute('/demos/$slug')({
  loader: async ({ params }) => {
    const content = await getDemoContent({ data: params.slug })
    if (!content) {
      throw new Error('Demo not found')
    }
    return content
  },
  component: DemoPage,
})

function DemoPage() {
  const html = Route.useLoaderData()
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
