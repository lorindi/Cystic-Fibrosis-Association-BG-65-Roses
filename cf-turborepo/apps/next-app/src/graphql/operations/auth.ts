import { gql } from '@apollo/client';
import { USER_FIELDS, USER_DETAILED_FIELDS } from './user';

// Автентикационни мутации
export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
      user {
        ...UserDetailedFields
      }
      token
    }
  }
  ${USER_DETAILED_FIELDS}
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
        ...UserDetailedFields
      }
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      ...UserDetailedFields
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
  ${USER_DETAILED_FIELDS}
`; 