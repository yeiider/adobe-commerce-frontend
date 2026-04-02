/**
 * Wishlist GraphQL Mutations
 * All wishlist-related mutations for Adobe Commerce
 */

import { WISHLIST_FRAGMENT, WISHLIST_ITEM_FRAGMENT } from '../fragments/customer.fragments'

export const ADD_PRODUCTS_TO_WISHLIST = /* GraphQL */ `
  mutation AddProductsToWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemInput!]!) {
    addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
      wishlist {
        ...Wishlist
      }
      user_errors {
        code
        message
      }
    }
  }
  ${WISHLIST_ITEM_FRAGMENT}
  ${WISHLIST_FRAGMENT}
`

export const REMOVE_PRODUCTS_FROM_WISHLIST = /* GraphQL */ `
  mutation RemoveProductsFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
    removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsIds) {
      wishlist {
        ...Wishlist
      }
      user_errors {
        code
        message
      }
    }
  }
  ${WISHLIST_ITEM_FRAGMENT}
  ${WISHLIST_FRAGMENT}
`

export const UPDATE_PRODUCTS_IN_WISHLIST = /* GraphQL */ `
  mutation UpdateProductsInWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemUpdateInput!]!) {
    updateProductsInWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
      wishlist {
        ...Wishlist
      }
      user_errors {
        code
        message
      }
    }
  }
  ${WISHLIST_ITEM_FRAGMENT}
  ${WISHLIST_FRAGMENT}
`

export const ADD_WISHLIST_ITEMS_TO_CART = /* GraphQL */ `
  mutation AddWishlistItemsToCart($wishlistId: ID!, $wishlistItemIds: [ID!]!) {
    addWishlistItemsToCart(wishlistId: $wishlistId, wishlistItemIds: $wishlistItemIds) {
      status
      add_wishlist_items_to_cart_user_errors {
        code
        message
      }
    }
  }
`
