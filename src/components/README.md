# Components Structure

This directory contains all React components organized by domain and functionality.

## Directory Structure

```
components/
├── common/           # Shared components used across the app
│   ├── Header/
│   ├── Footer/
│   ├── Navigation/
│   ├── Breadcrumbs/
│   ├── SEO/
│   └── Loading/
│
├── product/          # Product-related components
│   ├── ProductCard/
│   ├── ProductGrid/
│   ├── ProductDetails/
│   ├── ProductGallery/
│   ├── ProductPrice/
│   ├── ProductOptions/
│   ├── ProductReviews/
│   └── AddToCart/
│
├── category/         # Category-related components
│   ├── CategoryCard/
│   ├── CategoryGrid/
│   ├── CategoryFilters/
│   ├── CategorySorting/
│   └── CategoryPagination/
│
├── cart/             # Cart-related components
│   ├── CartDrawer/
│   ├── CartItem/
│   ├── CartSummary/
│   ├── CartIcon/
│   └── CouponForm/
│
├── checkout/         # Checkout-related components
│   ├── CheckoutSteps/
│   ├── ShippingForm/
│   ├── BillingForm/
│   ├── PaymentMethod/
│   ├── OrderSummary/
│   └── OrderConfirmation/
│
├── customer/         # Customer/Auth-related components
│   ├── LoginForm/
│   ├── RegisterForm/
│   ├── AccountMenu/
│   ├── AddressBook/
│   ├── OrderHistory/
│   └── WishlistButton/
│
├── search/           # Search-related components
│   ├── SearchBar/
│   ├── SearchResults/
│   ├── SearchSuggestions/
│   └── SearchFilters/
│
├── cms/              # CMS content components
│   ├── CmsPage/
│   ├── CmsBlock/
│   └── PageBuilder/
│
└── providers/        # Context providers
    ├── CartProvider/
    ├── CustomerProvider/
    └── StoreProvider/
```

## Component Guidelines

1. **File Structure**: Each component should have its own directory with:
   - `index.ts` - Re-exports the component
   - `ComponentName.tsx` - Main component file
   - `ComponentName.types.ts` - TypeScript types (if needed)
   - `ComponentName.test.tsx` - Tests (if applicable)

2. **Naming**: Use PascalCase for component names and directories

3. **Props**: Define props interfaces in the types file or at the top of the component file

4. **Styling**: Use Tailwind CSS with the project's design tokens

5. **State Management**: Use SWR hooks from `@/hooks` for data fetching
