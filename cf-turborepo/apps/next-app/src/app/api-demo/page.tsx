'use client'

import { useState, useEffect } from 'react'
import { createAdapter } from '@/utils/adapter-factory'

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function ApiDemo() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendType, setBackendType] = useState<string>(
    process.env.NEXT_PUBLIC_BACKEND_TYPE || 'express'
  )

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const adapter = createAdapter(backendType)
        const result = await adapter.getUsers()
        setUsers(result)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Failed to fetch users. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [backendType])

  const handleBackendChange = (type: string) => {
    setBackendType(type)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">API Integration Demo</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Backend:</h2>
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded ${backendType === 'express' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleBackendChange('express')}
          >
            Express
          </button>
          <button 
            className={`px-4 py-2 rounded ${backendType === 'nest' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleBackendChange('nest')}
          >
            NestJS
          </button>
          <button 
            className={`px-4 py-2 rounded ${backendType === 'supabase' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleBackendChange('supabase')}
          >
            Supabase
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Users from {backendType.charAt(0).toUpperCase() + backendType.slice(1)} Backend</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 py-4">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 