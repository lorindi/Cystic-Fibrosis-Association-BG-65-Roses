import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function SignInPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left side - Login form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-center text-teal-700 mb-8">
            Влез в профила си
          </h1>
          
          {/* Google Sign In Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 mb-4 hover:bg-gray-50 transition-all">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            <span>Вход с Google</span>
          </button>
          
          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-gray-300 w-full"></div>
            <div className="absolute bg-white px-3 text-xs text-gray-500">или</div>
          </div>
          
          {/* Email & Password Form */}
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Имейл адрес
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Парола
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-right mb-6">
              <Link href="/forgotten-password" className="text-sm text-teal-600 hover:text-teal-800">
                Забравена парола?
              </Link>
            </div>
            
            <div className="flex gap-3">
              <Link 
                href="/"
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
              >
                Назад
              </Link>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-teal-700 text-white rounded-md hover:bg-teal-800"
              >
                Вход
              </button>
            </div>
            
            {/* Registration redirect text */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Нямате регистрация?{" "}
              <Link href="/create-account" className="text-teal-600 hover:text-teal-800 font-medium">
                Създайте профил
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - DNA GIF */}
      <div className="hidden md:block md:w-1/2 bg-teal-800">
        <div className="h-full w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-900 opacity-50"></div>
          <div className="h-full w-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/gif/dna.gif"
                alt="DNA Animation"
                fill
                className="object-cover opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage