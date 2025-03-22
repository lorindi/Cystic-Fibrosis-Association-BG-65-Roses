// apps/next-app/lib/api-factory.ts
import { ApiService } from '@cf/api-contracts';

export async function createApiService(): Promise<ApiService> {
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'express';
  
  switch (backendType) {
    case 'express':
      const { ExpressApiService } = await import('@cf/express-adapter');
      return new ExpressApiService();
    case 'nest':
      const { NestApiService } = await import('@cf/nest-adapter');
      return new NestApiService();
    case 'supabase':
      const { SupabaseApiService } = await import('@cf/supabase-adapter');
      return new SupabaseApiService();
    default:
      throw new Error(`Unsupported backend type: ${backendType}`);
  }
}