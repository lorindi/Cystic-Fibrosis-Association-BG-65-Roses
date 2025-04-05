import { GraphQLError } from 'graphql';

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

export class UserInputError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        ...properties,
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
} 