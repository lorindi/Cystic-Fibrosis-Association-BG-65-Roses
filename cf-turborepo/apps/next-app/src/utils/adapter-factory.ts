import { createExpressAdapter } from '@cf/express-adapter'
import { createNestAdapter } from '@cf/nest-adapter'
import { createSupabaseAdapter } from '@cf/supabase-adapter'

interface ApiAdapter {
  getUsers: () => Promise<any[]>
  getUserById: (id: string) => Promise<any>
}

export function createAdapter(backendType: string): ApiAdapter {
  switch (backendType) {
    case 'express':
      return createExpressAdapter()
    case 'nest':
      return createNestAdapter() 
    case 'supabase':
      return createSupabaseAdapter()
    default:
      throw new Error(`Unknown backend type: ${backendType}`)
  }
} 