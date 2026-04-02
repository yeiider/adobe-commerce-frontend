/**
 * Customer GraphQL Mutations
 * All customer-related mutations for Adobe Commerce
 */

import {
  CUSTOMER_FRAGMENT,
  CUSTOMER_BASIC_FRAGMENT,
  CUSTOMER_ADDRESS_FRAGMENT,
} from '../fragments/customer.fragments'

export const CREATE_CUSTOMER = /* GraphQL */ `
  mutation CreateCustomer($input: CustomerCreateInput!) {
    createCustomerV2(input: $input) {
      customer {
        ...Customer
      }
    }
  }
  ${CUSTOMER_BASIC_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${CUSTOMER_FRAGMENT}
`

export const GENERATE_CUSTOMER_TOKEN = /* GraphQL */ `
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`

export const REVOKE_CUSTOMER_TOKEN = /* GraphQL */ `
  mutation RevokeCustomerToken {
    revokeCustomerToken {
      result
    }
  }
`

export const UPDATE_CUSTOMER = /* GraphQL */ `
  mutation UpdateCustomer($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        ...Customer
      }
    }
  }
  ${CUSTOMER_BASIC_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${CUSTOMER_FRAGMENT}
`

export const CHANGE_CUSTOMER_PASSWORD = /* GraphQL */ `
  mutation ChangeCustomerPassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      email
    }
  }
`

export const REQUEST_PASSWORD_RESET_EMAIL = /* GraphQL */ `
  mutation RequestPasswordResetEmail($email: String!) {
    requestPasswordResetEmail(email: $email)
  }
`

export const RESET_PASSWORD = /* GraphQL */ `
  mutation ResetPassword($email: String!, $resetPasswordToken: String!, $newPassword: String!) {
    resetPassword(email: $email, resetPasswordToken: $resetPasswordToken, newPassword: $newPassword)
  }
`

export const CREATE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation CreateCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      ...CustomerAddress
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

export const UPDATE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation UpdateCustomerAddress($id: Int!, $input: CustomerAddressInput!) {
    updateCustomerAddress(id: $id, input: $input) {
      ...CustomerAddress
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

export const DELETE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation DeleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`

export const SUBSCRIBE_EMAIL_TO_NEWSLETTER = /* GraphQL */ `
  mutation SubscribeEmailToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`
