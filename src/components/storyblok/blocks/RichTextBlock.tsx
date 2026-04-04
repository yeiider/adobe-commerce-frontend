import type { RichTextBlok, StoryblokRichTextNode } from '@/src/types/storyblok.types'

interface RichTextBlockProps {
  blok: RichTextBlok
}

/** Minimal rich-text renderer — replace with @storyblok/richtext if needed */
function renderNode(node: StoryblokRichTextNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'doc':
      return (
        <div key={index}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </div>
      )

    case 'paragraph':
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case 'heading': {
      const level = (node.attrs?.level as number) ?? 2
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const sizeMap: Record<number, string> = {
        1: 'text-4xl font-bold mb-4',
        2: 'text-3xl font-bold mb-3',
        3: 'text-2xl font-semibold mb-3',
        4: 'text-xl font-semibold mb-2',
        5: 'text-lg font-medium mb-2',
        6: 'text-base font-medium mb-2',
      }
      return (
        <Tag key={index} className={sizeMap[level]}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }

    case 'bullet_list':
      return (
        <ul key={index} className="mb-4 list-disc pl-6 space-y-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case 'ordered_list':
      return (
        <ol key={index} className="mb-4 list-decimal pl-6 space-y-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case 'list_item':
      return (
        <li key={index}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case 'blockquote':
      return (
        <blockquote
          key={index}
          className="mb-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground"
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case 'code_block':
      return (
        <pre key={index} className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{node.content?.map((child, i) => renderNode(child, i))}</code>
        </pre>
      )

    case 'horizontal_rule':
      return <hr key={index} className="my-6 border-muted" />

    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      for (const mark of node.marks ?? []) {
        switch (mark.type) {
          case 'bold':
            content = <strong key={mark.type}>{content}</strong>
            break
          case 'italic':
            content = <em key={mark.type}>{content}</em>
            break
          case 'underline':
            content = <u key={mark.type}>{content}</u>
            break
          case 'strike':
            content = <s key={mark.type}>{content}</s>
            break
          case 'code':
            content = (
              <code key={mark.type} className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
                {content}
              </code>
            )
            break
          case 'link': {
            const href = (mark.attrs?.href as string) ?? '#'
            content = (
              <a
                key={mark.type}
                href={href}
                className="text-primary underline hover:no-underline"
                target={mark.attrs?.target as string | undefined}
                rel="noopener noreferrer"
              >
                {content}
              </a>
            )
            break
          }
        }
      }
      return content
    }

    default:
      return null
  }
}

export function RichTextBlock({ blok }: RichTextBlockProps) {
  if (!blok.content) return null

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="prose prose-neutral max-w-none">
        {renderNode(blok.content, 0)}
      </div>
    </section>
  )
}
