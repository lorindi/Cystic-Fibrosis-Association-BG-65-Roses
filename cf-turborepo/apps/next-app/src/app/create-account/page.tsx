'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { REGISTER } from '@/lib/apollo/mutations'
import { useAuth } from '@/lib/context/AuthContext'
import DnaBackground from '@/components/auth/DnaBackground'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import OrDivider from '@/components/auth/OrDivider'
import InputField from '@/components/auth/InputField'
import PasswordField from '@/components/auth/PasswordField'
import BackButton from '@/components/auth/BackButton'
import SubmitButton from '@/components/auth/SubmitButton'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'

function CreateAccountPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerMutation] = useMutation(REGISTER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password
          }
        }
      });

      if (data?.register) {
        login(data.register.token, data.register.user);
        router.push('/verify-email');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - DNA GIF */}
      <div className="hidden md:block md:w-1/2 bg-teal-800">
        <DnaBackground />
      </div>
      
      {/* Right side - Registration form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
        <AuthFormWrapper title="Create Account">
          {/* Google Sign In Button */}
          <GoogleSignInButton />
          
          {/* Divider */}
          <OrDivider />
          
          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <InputField 
              id="name" 
              label="Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <InputField 
              id="email" 
              label="Email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <PasswordField 
              id="password" 
              label="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <PasswordField 
              id="confirmPassword" 
              label="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
            
            <div className="flex gap-3">
              <BackButton href="/" />
              <SubmitButton text="Create Account" loading={loading} />
            </div>
            
            {/* Login redirect text */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?
              <Link href="/sign-in" className="text-teal-600 hover:text-teal-800 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </AuthFormWrapper>
      </div>
    </div>
  )
}

export default CreateAccountPage