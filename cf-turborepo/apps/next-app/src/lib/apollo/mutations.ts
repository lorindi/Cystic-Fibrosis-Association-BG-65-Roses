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

// New mutations for user management
export const SET_USER_ROLE = gql`
  mutation SetUserRole($userId: ID!, $role: UserRole!) {
    setUserRole(userId: $userId, role: $role) {
      _id
      name
      email
      role
      groups
      isEmailVerified
    }
  }
`;

export const ADD_USER_TO_GROUP = gql`
  mutation AddUserToGroup($userId: ID!, $group: UserGroup!) {
    addUserToGroup(userId: $userId, group: $group) {
      _id
      name
      email
      role
      groups
      isEmailVerified
    }
  }
`;

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroup($userId: ID!, $group: UserGroup!) {
    removeUserFromGroup(userId: $userId, group: $group) {
      _id
      name
      email
      role
      groups
      isEmailVerified
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      _id
      name
      email
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
`; 