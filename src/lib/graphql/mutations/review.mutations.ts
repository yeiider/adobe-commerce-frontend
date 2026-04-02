/**
 * Review GraphQL Mutations
 * All review-related mutations for Adobe Commerce
 */

export const CREATE_PRODUCT_REVIEW = /* GraphQL */ `
  mutation CreateProductReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
      review {
        nickname
        summary
        text
        average_rating
        ratings_breakdown {
          name
          value
        }
      }
    }
  }
`

export const GET_PRODUCT_REVIEW_RATINGS_METADATA = /* GraphQL */ `
  query GetProductReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value_id
          value
        }
      }
    }
  }
`
