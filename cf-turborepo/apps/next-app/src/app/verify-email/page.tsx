'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL, RESEND_VERIFICATION_EMAIL } from '@/graphql/operations';
import { useAuth } from '@/lib/context/AuthContext';
import DnaBackground from '@/components/auth/DnaBackground';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [resendVerification] = useMutation(RESEND_VERIFICATION_EMAIL);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    setLoading(true);
    try {
      const { data } = await verifyEmail({
        variables: { token }
      });

      if (data.verifyEmail.success) {
        setSuccess(data.verifyEmail.message);
        if (data.verifyEmail.token && data.verifyEmail.user) {
          login(data.verifyEmail.token, data.verifyEmail.user);
        }
        // Redirect to home after 3 seconds
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.verifyEmail.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { data } = await resendVerification();
      if (data.resendVerificationEmail) {
        setSuccess('Verification email has been resent. Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Verification form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
        <AuthFormWrapper title="Email Verification">
          <div className="text-center">
            {loading ? (
              <div className="mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Verifying your email...</p>
              </div>
            ) : error ? (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
                {!token && (
                  <button
                    onClick={handleResendVerification}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            ) : success ? (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Please check your email for a verification link.
                </p>
                <button
                  onClick={handleResendVerification}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
        </AuthFormWrapper>
      </div>
      
      {/* Right side - DNA GIF */}
      <div className="hidden md:block md:w-1/2 bg-teal-800">
        <DnaBackground />
      </div>
    </div>
  );
}

export default VerifyEmailPage; 