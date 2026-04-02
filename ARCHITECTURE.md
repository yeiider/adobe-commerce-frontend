# Arquitectura del Proyecto - Adobe Commerce / Magento Frontend

## Estructura de Carpetas

```
src/
├── components/           # Componentes React organizados por dominio
│   ├── common/          # Componentes reutilizables (Loading, Error, etc.)
│   ├── layout/          # Header, Footer, Sidebar
│   │   ├── Header/      # Navegación principal
│   │   │   ├── Header.tsx
│   │   │   ├── NavigationMenu.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── SearchBar.tsx
│   │   └── Footer/
│   ├── product/         # Componentes de producto
│   ├── category/        # Componentes de categoría
│   ├── cart/            # Componentes del carrito
│   ├── checkout/        # Componentes de checkout
│   ├── customer/        # Componentes de cuenta de usuario
│   ├── search/          # Componentes de búsqueda
│   ├── cms/             # Componentes de CMS (bloques, páginas)
│   └── providers/       # Context Providers
│
├── config/              # Configuración centralizada
│   └── env.ts           # Variables de entorno tipadas
│
├── hooks/               # Custom React Hooks
│   ├── use-cart.ts      # Hook para el carrito
│   ├── use-customer.ts  # Hook para autenticación/usuario
│   ├── use-wishlist.ts  # Hook para lista de deseos
│   ├── use-search.ts    # Hook para búsqueda
│   └── use-store-config.ts # Hook para config de tienda
│
├── lib/
│   └── graphql/         # Cliente y queries GraphQL
│       ├── client.ts    # Cliente GraphQL configurado
│       ├── fragments/   # Fragmentos reutilizables por entidad
│       │   ├── product.fragments.ts
│       │   ├── category.fragments.ts
│       │   ├── cart.fragments.ts
│       │   ├── customer.fragments.ts
│       │   └── ...
│       ├── queries/     # Queries organizadas por entidad
│       │   ├── product.queries.ts
│       │   ├── category.queries.ts
│       │   ├── cart.queries.ts
│       │   └── ...
│       └── mutations/   # Mutations organizadas por entidad
│           ├── cart.mutations.ts
│           ├── customer.mutations.ts
│           └── ...
│
├── services/            # Lógica de negocio y data fetching
│   ├── product.service.ts
│   ├── category.service.ts
│   ├── cart.service.ts
│   ├── customer.service.ts
│   ├── checkout.service.ts
│   └── ...
│
├── types/               # TypeScript types por entidad
│   ├── common.types.ts
│   ├── product.types.ts
│   ├── category.types.ts
│   ├── cart.types.ts
│   ├── customer.types.ts
│   └── ...
│
└── utils/               # Funciones utilitarias
    ├── format.ts        # Formateo de precios, fechas, etc.
    └── ...

app/                     # Next.js App Router
├── layout.tsx           # Layout principal
├── page.tsx             # Homepage
├── (category)/          # Rutas de categoría
├── (product)/           # Rutas de producto
├── checkout/            # Rutas de checkout
├── customer/            # Rutas de cuenta
└── ...
```

## Patrones de Diseño

### 1. GraphQL por Entidad
Cada entidad tiene sus propios:
- **Fragments**: Campos reutilizables
- **Queries**: Consultas de lectura
- **Mutations**: Operaciones de escritura

### 2. Services Layer
Los servicios encapsulan:
- Llamadas al API GraphQL
- Transformación de datos
- Manejo de errores
- Caching strategies

### 3. Custom Hooks
Hooks para estado del cliente:
- `useCart`: Estado del carrito con SWR
- `useCustomer`: Autenticación y datos del usuario
- `useWishlist`: Lista de deseos
- `useSearch`: Búsqueda con debounce

### 4. Server Components
- Páginas usan Server Components por defecto
- Data fetching en el servidor
- Componentes interactivos marcados con 'use client'

## Variables de Entorno

```env
# API
NEXT_PUBLIC_ADOBE_COMMERCE_GRAPHQL_URL=https://magento.goline.com.co/graphql

# Store
NEXT_PUBLIC_ADOBE_COMMERCE_STORE_CODE=default
NEXT_PUBLIC_ADOBE_COMMERCE_STORE_VIEW_CODE=default
NEXT_PUBLIC_ADOBE_COMMERCE_CURRENCY_CODE=COP
NEXT_PUBLIC_ADOBE_COMMERCE_LOCALE=es_CO

# Media
NEXT_PUBLIC_ADOBE_COMMERCE_MEDIA_URL=https://magento.goline.com.co/media

# Features
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_COMPARE=true
NEXT_PUBLIC_ENABLE_REVIEWS=true

# SEO
NEXT_PUBLIC_SITE_NAME=Magento Store
NEXT_PUBLIC_SITE_URL=https://magento.goline.com.co
```

## Convenciones de Código

### Nombrado
- Componentes: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase con prefijo use (`useCart.ts`)
- Services: camelCase con sufijo service (`product.service.ts`)
- Types: camelCase con sufijo types (`product.types.ts`)
- Queries: SCREAMING_SNAKE_CASE (`GET_PRODUCT_BY_SKU`)

### Imports
```typescript
// Usar alias @/src para imports
import { Header } from '@/src/components/layout/Header'
import { getNavigationMenu } from '@/src/services/category.service'
import type { Product } from '@/src/types/product.types'
```

## SEO Considerations

1. **Metadata**: Cada página define su propio metadata
2. **Breadcrumbs**: Implementados con datos de Magento
3. **Structured Data**: JSON-LD para productos y categorías
4. **Canonical URLs**: Basados en url_key de Magento
5. **Open Graph**: Imágenes y descripciones dinámicas
