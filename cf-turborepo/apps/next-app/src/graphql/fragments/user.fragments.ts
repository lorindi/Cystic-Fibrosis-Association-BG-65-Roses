import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
    role
    isEmailVerified
    createdAt
  }
`;

export const USER_BASIC_FIELDS = gql`
  fragment UserBasicFields on User {
    _id
    name
    email
    isEmailVerified
  }
`;

export const USER_PROFILE_FIELDS = gql`
  fragment UserProfileFields on UserProfile {
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
`;

export const USER_DETAILED_FIELDS = gql`
  fragment UserDetailedFields on User {
    ...UserBasicFields
    role
    createdAt
  }
  ${USER_BASIC_FIELDS}
`; 