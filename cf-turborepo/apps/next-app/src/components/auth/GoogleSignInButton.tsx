'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { GOOGLE_AUTH } from '@/lib/apollo/mutations';
import { useAuth } from '@/lib/context/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const { login } = useAuth();
  const [googleAuth] = useMutation(GOOGLE_AUTH);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleButton')!,
          { 
            theme: 'outline', 
            size: 'large',
            width: 280,
            text: 'continue_with'
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const { data } = await googleAuth({
        variables: {
          input: {
            idToken: response.credential
          }
        }
      });

      if (data?.googleAuth) {
        login(data.googleAuth.token, data.googleAuth.user);
        router.push('/');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  return (
    <div id="googleButton" className="w-full flex justify-center mb-4">
    </div>
  );
} 