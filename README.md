# Next.js Adobe Commerce / Magento Frontend

A high-performance, advanced frontend for Adobe Commerce (Magento 2) built with Next.js, TypeScript, and Tailwind CSS. This project leverages the Adobe Commerce GraphQL API to provide a seamless, modern e-commerce experience.

## Features

- **Next.js App Router**: Utilizing the latest React features and Server Components.
- **Adobe Commerce Integration**: Deep integration with Magento's GraphQL API.
- **Performance Optimized**: Built for speed with server-side rendering and efficient data fetching.
- **TypeScript**: Fully typed codebase for better developer experience and stability.
- **Tailwind CSS**: Modern styling with a utility-first approach.
- **Flexible Architecture**: Domain-driven design organized for scalability.

## Architecture

For a detailed breakdown of the project structure and design patterns, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

### Core Structure

- `app/`: Next.js App Router pages and layouts.
- `src/components/`: React components organized by domain (cart, catalog, checkout, etc.).
- `src/services/`: Business logic and data fetching layer.
- `src/lib/graphql/`: GraphQL client, queries, mutations, and fragments.
- `src/hooks/`: Custom React hooks for client-side state management.
- `src/types/`: Centralized TypeScript definitions.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- A running Adobe Commerce (Magento) instance with GraphQL enabled.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables (see below).

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# API
NEXT_PUBLIC_ADOBE_COMMERCE_GRAPHQL_URL=https://your-magento-store.com/graphql

# Store Configuration
NEXT_PUBLIC_ADOBE_COMMERCE_STORE_CODE=default
NEXT_PUBLIC_ADOBE_COMMERCE_STORE_VIEW_CODE=default
NEXT_PUBLIC_ADOBE_COMMERCE_CURRENCY_CODE=USD
NEXT_PUBLIC_ADOBE_COMMERCE_LOCALE=en_US

# Media
NEXT_PUBLIC_ADOBE_COMMERCE_MEDIA_URL=https://your-magento-store.com/media
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
