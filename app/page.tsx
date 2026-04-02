import type { Metadata } from 'next'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { getNavigationMenu } from '@/src/services/category.service'
import { config } from '@/src/config/env'

export const metadata: Metadata = {
  title: config.seo.defaultTitle,
  description: config.seo.defaultDescription,
}

export default async function HomePage() {
  // Fetch navigation data server-side
  const navigation = await getNavigationMenu()

  return (
    <div className="flex min-h-screen flex-col">
      <Header navigation={navigation} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12 rounded-lg bg-muted p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Bienvenido a {config.seo.siteName}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Tu tienda online con los mejores productos
            </p>
          </section>

          {/* Featured Categories Placeholder */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Categorías Destacadas
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          </section>

          {/* Featured Products Placeholder */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="rounded-lg bg-primary p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-semibold">
              Suscríbete a nuestro Newsletter
            </h2>
            <p className="mt-2">
              Recibe las últimas novedades y ofertas exclusivas
            </p>
            <div className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 rounded-lg border-0 bg-primary-foreground/10 px-4 py-2 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <button className="rounded-lg bg-primary-foreground px-6 py-2 font-medium text-primary transition-colors hover:bg-primary-foreground/90">
                Suscribirse
              </button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
