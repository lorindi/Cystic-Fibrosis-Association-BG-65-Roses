import { gql } from '@apollo/client';
import { AuthResponse, RegisterInput, LoginInput, VerificationResponse } from './types';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        _id
        name
        email
        role
        isEmailVerified
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        name
        email
        role
        isEmailVerified
      }
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
      user {
        _id
        name
        email
        role
        isEmailVerified
      }
      token
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      _id
      name
      email
      role
      groups
      isEmailVerified
      profile {
        avatar
        bio
        birthDate
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
        diagnosed
        diagnosisYear
        childName
        companyName
      }
    }
  }
`;

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
      token
      user {
        _id
        name
        email
        role
        isEmailVerified
        profile {
          avatar
        }
      }
    }
  }
`; 