import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { config } from '@/src/config/env'

interface FooterLink {
  label: string
  href: string
}

const footerLinks: Record<string, FooterLink[]> = {
  'Información': [
    { label: 'Sobre Nosotros', href: '/about-us' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con Nosotros', href: '/careers' },
  ],
  'Servicio al Cliente': [
    { label: 'Mi Cuenta', href: '/customer/account' },
    { label: 'Seguimiento de Pedido', href: '/sales/guest/form' },
    { label: 'Devoluciones', href: '/returns' },
    { label: 'Preguntas Frecuentes', href: '/faq' },
  ],
  'Políticas': [
    { label: 'Términos y Condiciones', href: '/terms-conditions' },
    { label: 'Política de Privacidad', href: '/privacy-policy' },
    { label: 'Política de Cookies', href: '/cookie-policy' },
    { label: 'Política de Envío', href: '/shipping-policy' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-foreground">
                {config.seo.siteName}
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Tu tienda online de confianza con los mejores productos y el mejor servicio al cliente.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:contacto@example.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                contacto@example.com
              </a>
              <a
                href="tel:+571234567890"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                +57 123 456 7890
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 translate-y-0.5" />
                <span>Calle Principal #123, Ciudad, País</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {config.seo.siteName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Desarrollado con Adobe Commerce
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
