'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { LOGIN } from '@/graphql/operations/user'
import { useAuth } from '@/lib/context/AuthContext'
import DnaBackground from '@/components/auth/DnaBackground'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import OrDivider from '@/components/auth/OrDivider'
import InputField from '@/components/auth/InputField'
import PasswordField from '@/components/auth/PasswordField'
import BackButton from '@/components/auth/BackButton'
import SubmitButton from '@/components/auth/SubmitButton'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import { LoginMutation, LoginMutationVariables } from '@/graphql/generated/graphql'

function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/');

  // При зареждане проверяваме дали има запазен URL за пренасочване
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) {
        setRedirectTo(redirect);
      }
    }

    // Ако потребителят вече е автентикиран, пренасочваме го
    if (isAuthenticated) {
      const redirect = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirect);
    }
  }, [isAuthenticated, router]);

  const [loginMutation] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN, {
    // Игнорираме Apollo cache за да сме сигурни, че всичко е up-to-date
    fetchPolicy: 'no-cache'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Проверка за празни полета
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      // Премахваме детайлния лог при опит за логин
      
      const { data } = await loginMutation({
        variables: {
          input: {
            email: formData.email.trim(),
            password: formData.password
          }
        },
        // Предотвратяваме Apollo да логва грешките в конзолата
        onError: (error) => {
          // Управляваме грешките локално, вместо да оставим Apollo да ги покаже в конзолата
          return;
        }
      });

      // Премахваме допълнителния лог за отговора
      
      if (data?.login) {
        // Обърнете внимание, че JWT токенът сега има по-кратък живот (1 час),
        // а рефреш токенът се управлява автоматично чрез HTTP-only cookies
        login(data.login.token, data.login.user);
        
        // Пренасочваме потребителя към запазения URL или към началната страница
        const redirectUrl = redirectTo;
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        // Намаляваме нивото на съобщението до уведомяване на потребителя
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      // Премахваме детайлния лог на грешката
      
      // Log more detailed information
      if (err.networkError) {
        setError(`Network error: ${err.networkError.message || 'Please check your internet connection'}`);
      } else if (err.graphQLErrors?.length) {
        const errorMessage = err.graphQLErrors[0].message;
        
        // Проверка за конкретно съобщение за деактивиран акаунт
        if (errorMessage.includes('деактивиран') || errorMessage.includes('deactivated')) {
          setError('This account has been deactivated. Please contact an administrator for assistance.');
        } else {
          // При грешна парола, показваме просто съобщение, без да го логваме
          setError(`${errorMessage}`);
        }
      } else {
        setError(`Login failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Login form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
        <AuthFormWrapper title="Sign in">
          {/* Google Sign In Button */}
          <GoogleSignInButton />
          
          {/* Divider */}
          <OrDivider />
          
          {/* Email & Password Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error === 'Невалиден имейл или парола' ? (
                  <div className="flex flex-col">
                    <span className="font-medium">Incorrect login details</span>
                    <span className="text-xs mt-1">The email and password combination you entered is not valid.</span>
                  </div>
                ) : error.includes('деактивиран') || error.includes('deactivated') ? (
                  <div className="flex flex-col">
                    <span className="font-medium">Account deactivated</span>
                    <span className="text-xs mt-1">This account has been deactivated. Please contact an administrator for assistance.</span>
                  </div>
                ) : (
                  error
                )}
              </div>
            )}
            
            <InputField 
              id="email" 
              label="Email" 
              type="email" 
              placeholder="your@email.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            
            <PasswordField 
              id="password" 
              label="Password" 
              placeholder="Your password" 
              required 
              mb="mb-2"
              value={formData.password}
              onChange={handleChange}
            />
            
            <div className="text-right mb-6">
              <Link href="/forgotten-password" className="text-sm text-teal-600 hover:text-teal-800">
                Forgotten password?
              </Link>
            </div>
            
            <div className="flex gap-3">
              <BackButton href="/" />
              <SubmitButton text="Sign in" loading={loading} />
            </div>
            
            {/* Registration redirect text */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/create-account" className="text-teal-600 hover:text-teal-800 font-medium">
                Create account
              </Link>
            </div>
          </form>
        </AuthFormWrapper>
      </div>
      
      {/* Right side - DNA GIF */}
      <div className="hidden md:block md:w-1/2 bg-teal-800">
        <DnaBackground />
      </div>
    </div>
  )
}

export default SignInPage