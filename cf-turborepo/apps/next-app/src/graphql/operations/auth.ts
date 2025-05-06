import { gql } from '@apollo/client';
import { USER_OPERATIONS_FIELDS, USER_OPERATIONS_DETAILED_FIELDS } from './user';

// Автентикационни мутации
export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
      user {
        ...UserOperationsDetailedFields
      }
      token
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail
  }
`;

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
      token
      user {
        ...UserOperationsDetailedFields
      }
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      ...UserOperationsDetailedFields
      profile {
        avatar
        bio
        birthDate
        diagnosed
        diagnosisYear
        childName
        companyName
        address {
          city
          postalCode
          street
        }
        contact {
          phone
          alternativeEmail
          emergencyContact {
            name
            phone
            relation
          }
        }
      }
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`;

// Рефреш токен и сесии
export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      token
      user {
        ...UserOperationsDetailedFields
      }
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`;

export const INVALIDATE_TOKEN = gql`
  mutation InvalidateToken {
    invalidateToken
  }
`;

export const INVALIDATE_ALL_TOKENS = gql`
  mutation InvalidateAllTokens {
    invalidateAllTokens
  }
`;

export const GET_USER_SESSIONS = gql`
  query GetUserSessions {
    getUserSessions {
      id
      ip
      userAgent
      createdAt
      expiresAt
    }
  }
`;

export const GET_LOGIN_HISTORY = gql`
  query GetLoginHistory($limit: Int) {
    getLoginHistory(limit: $limit) {
      id
      ip
      userAgent
      status
      loggedInAt
    }
  }
`;

// Деактивиране и реактивиране на акаунт
export const DEACTIVATE_ACCOUNT = gql`
  mutation DeactivateAccount($input: DeactivateAccountInput) {
    deactivateAccount(input: $input)
  }
`;

export const REACTIVATE_ACCOUNT = gql`
  mutation ReactivateAccount($userId: ID!) {
    reactivateAccount(userId: $userId)
  }
`; 