import React from 'react';
import { AuthFormWrapper } from './AuthFormWrapper';
import { DnaBackground } from './DnaBackground';

interface VerificationMessageProps {
  email: string;
  onResendVerification?: () => void;
  isResending?: boolean;
}

export const VerificationMessage: React.FC<VerificationMessageProps> = ({
  email,
  onResendVerification,
  isResending = false,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <DnaBackground />
      <AuthFormWrapper>
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-4">Check your email</h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <span className="font-semibold">{email}</span>. 
            Please check your inbox and click the link to verify your account.
          </p>

          {onResendVerification && (
            <button
              onClick={onResendVerification}
              disabled={isResending}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}

          <p className="mt-4 text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </AuthFormWrapper>
    </div>
  );
}; 