import type { Metadata } from 'next'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { getHomePage } from '@/src/services/storyblok.service'
import { StoryblokRenderer } from '@/src/components/storyblok/StoryblokRenderer'

export const metadata: Metadata = {
  title: 'Magento Store',
  description: 'Tu tienda online con los mejores productos',
}

export default async function HomePage() {
  const [{ storeConfig, currency, navigation }, homeStory] = await Promise.all([
    getFullStoreContext(),
    getHomePage(),
  ])

  // Override metadata with Storyblok SEO fields when available
  const seoTitle = homeStory?.content?.seo_title
  const seoDescription = homeStory?.content?.seo_description
  if (seoTitle) metadata.title = seoTitle
  if (seoDescription) metadata.description = seoDescription

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col">
        <Header navigation={navigation} />

        <main className="flex-1">
          {homeStory?.content?.body?.length ? (
            <StoryblokRenderer blocks={homeStory.content.body} />
          ) : (
            <StoryblokFallback storeName={storeConfig?.store_name} />
          )}
        </main>

        <Footer />
      </div>
    </StoreProvider>
  )
}

/** Shown while Storyblok home story is not yet configured */
function StoryblokFallback({ storeName }: { storeName?: string }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-foreground">
        Bienvenido a {storeName ?? 'la tienda'}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Configura el contenido de esta página en{' '}
        <a
          href="https://app.storyblok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:no-underline"
        >
          Storyblok
        </a>{' '}
        creando una historia con slug <code className="rounded bg-muted px-1 font-mono">home</code>.
      </p>
    </div>
  )
}
