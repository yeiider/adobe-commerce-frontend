/**
 * CMS GraphQL Queries
 * All CMS content queries for Adobe Commerce
 */

import { CMS_PAGE_FRAGMENT, CMS_BLOCK_FRAGMENT } from '../fragments/cms.fragments'

export const GET_CMS_PAGE = /* GraphQL */ `
  query GetCmsPage($identifier: String!) {
    cmsPage(identifier: $identifier) {
      ...CmsPage
    }
  }
  ${CMS_PAGE_FRAGMENT}
`

export const GET_CMS_BLOCKS = /* GraphQL */ `
  query GetCmsBlocks($identifiers: [String!]!) {
    cmsBlocks(identifiers: $identifiers) {
      items {
        ...CmsBlock
      }
    }
  }
  ${CMS_BLOCK_FRAGMENT}
`
