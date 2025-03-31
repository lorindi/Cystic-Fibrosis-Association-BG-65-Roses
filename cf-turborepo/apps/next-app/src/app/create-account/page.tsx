import React from 'react'
import Link from 'next/link'
import DnaBackground from '../components/auth/DnaBackground'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import OrDivider from '../components/auth/OrDivider'
import InputField from '../components/auth/InputField'
import PasswordField from '../components/auth/PasswordField'
import BackButton from '../components/auth/BackButton'
import SubmitButton from '../components/auth/SubmitButton'
import AuthFormWrapper from '../components/auth/AuthFormWrapper'

function CreateAccountPage() {
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
          <form>
            <InputField id="name" label="Name" />
            <InputField id="email" label="Email" type="email" />
            <PasswordField id="password" label="Password" />
            <PasswordField id="confirmPassword" label="Confirm Password" />
            
            <div className="flex gap-3">
              <BackButton href="/" />
              <SubmitButton text="Create Account" />
            </div>
            
            {/* Login redirect text */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
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