/**
 * Checkout GraphQL Queries
 * All checkout-related queries for Adobe Commerce
 */

import { COUNTRY_FRAGMENT } from '../fragments/checkout.fragments'

export const GET_COUNTRIES = /* GraphQL */ `
  query GetCountries {
    countries {
      ...Country
    }
  }
  ${COUNTRY_FRAGMENT}
`

export const GET_COUNTRY = /* GraphQL */ `
  query GetCountry($id: String!) {
    country(id: $id) {
      ...Country
    }
  }
  ${COUNTRY_FRAGMENT}
`
