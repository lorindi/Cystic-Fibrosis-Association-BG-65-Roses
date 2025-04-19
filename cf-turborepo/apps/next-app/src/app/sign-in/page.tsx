'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { LOGIN } from '@/graphql/operations'
import { useAuth } from '@/lib/context/AuthContext'
import DnaBackground from '@/components/auth/DnaBackground'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import OrDivider from '@/components/auth/OrDivider'
import InputField from '@/components/auth/InputField'
import PasswordField from '@/components/auth/PasswordField'
import BackButton from '@/components/auth/BackButton'
import SubmitButton from '@/components/auth/SubmitButton'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import { log } from 'console';

function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation(LOGIN);

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

    try {
      const { data } = await loginMutation({
        variables: {
          input: formData
        }
      });

      if (data?.login) {
        login(data.login.token, data.login.user);
        console.log(data.login.token, data.login.user);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
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
                {error}
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