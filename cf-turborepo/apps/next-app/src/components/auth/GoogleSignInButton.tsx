'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { GOOGLE_AUTH } from '@/graphql/operations';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';

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
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Функция за рендериране на Google бутона
  const renderGoogleButton = () => {
    if (!window.google || !buttonRef.current) return;
    
    try {
      window.google.accounts.id.renderButton(
        buttonRef.current,
        { 
          theme: 'outline', 
          size: 'large',
          width: 280,
          text: 'continue_with',
          logo_alignment: 'center'
        }
      );
    } catch (err) {
      console.error('Error rendering Google button:', err);
      setError('Failed to render Google Sign-In button');
    }
  };

  // Инициализация на Google Sign-In
  const initializeGoogleSignIn = (clientId: string) => {
    if (!window.google) {
      console.error('Google Sign-In not available');
      setError('Google Sign-In not available');
      return;
    }
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      // Рендерираме бутона след като сме инициализирали Google Sign-In
      renderGoogleButton();
    } catch (err) {
      console.error('Error initializing Google Sign-In:', err);
      setError('Failed to initialize Google Sign-In');
    }
  };

  useEffect(() => {
    // Проверяваме дали има конфигуриран Client ID
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google Client ID is not configured in .env.local');
      setError('Google Sign-In is not properly configured');
      return;
    }

    // Премахваме всички съществуващи скриптове за Google Sign-In, ако има такива
    const existingScripts = document.querySelectorAll('script[src="https://accounts.google.com/gsi/client"]');
    existingScripts.forEach(script => script.remove());

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
      setError('Failed to load Google Sign-In');
      setIsScriptLoaded(false);
    };

    script.onload = () => {
      setIsScriptLoaded(true);
      
      // Леко забавяне, за да сме сигурни, че DOM е напълно готов
      setTimeout(() => {
        initializeGoogleSignIn(clientId);
      }, 100);
    };

    document.body.appendChild(script);

    return () => {
      // Почистваме скрипта при unmount
      const scriptToRemove = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);
  
  // Ефект, който следи за промени в DOM и пробва отново да рендерира бутона
  useEffect(() => {
    if (isScriptLoaded && buttonRef.current && window.google) {
      renderGoogleButton();
    }
  }, [isScriptLoaded, buttonRef.current]);

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      console.error('No credential received from Google');
      setError('Failed to authenticate with Google');
      return;
    }

    try {
      setError(null);
      const { data } = await googleAuth({
        variables: {
          input: {
            idToken: response.credential
          }
        }
      });

      if (data?.googleAuth) {
        login(data.googleAuth.token, data.googleAuth.user);
        
        // Проверка дали има запазен URL за пренасочване след успешен вход
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        setError('Authentication failed');
      }
    } catch (error: any) {
      console.error('Google authentication error:', error);
      setError(error.message || 'Failed to authenticate with Google');
    }
  };

  // Показваме custom бутон, ако има проблем с Google Sign-In
  if (error || !isScriptLoaded) {
    return (
      <div className="w-full mb-4">
        <Button 
          disabled={true} 
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
        >
          Google Sign-In Unavailable
        </Button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={buttonRef} className="w-full flex justify-center mb-4">
      {/* Google ще рендерира бутона тук */}
    </div>
  );
} 