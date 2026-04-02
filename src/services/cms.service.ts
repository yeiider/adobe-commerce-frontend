/**
 * CMS Service
 * Business logic for CMS content operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import { GET_CMS_PAGE, GET_CMS_BLOCKS } from '@/src/lib/graphql/queries/cms.queries'
import { CmsPage, CmsBlock, CmsBlocksResponse, CmsPageResponse } from '@/src/types/cms.types'
import { config } from '@/src/config/env'

/**
 * Get CMS page by identifier
 */
export async function getCmsPage(identifier: string): Promise<CmsPage | null> {
  const { data, errors } = await graphqlClient<CmsPageResponse>({
    query: GET_CMS_PAGE,
    variables: { identifier },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.cmsPage) {
    return null
  }

  return data.cmsPage
}

/**
 * Get CMS blocks by identifiers
 */
export async function getCmsBlocks(identifiers: string[]): Promise<CmsBlock[] | null> {
  const { data, errors } = await graphqlClient<CmsBlocksResponse>({
    query: GET_CMS_BLOCKS,
    variables: { identifiers },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.cmsBlocks?.items) {
    return null
  }

  return data.cmsBlocks.items
}

/**
 * Get single CMS block by identifier
 */
export async function getCmsBlock(identifier: string): Promise<CmsBlock | null> {
  const blocks = await getCmsBlocks([identifier])
  return blocks?.[0] ?? null
}
