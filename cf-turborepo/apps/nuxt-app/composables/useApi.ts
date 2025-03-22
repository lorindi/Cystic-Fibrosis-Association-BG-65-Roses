// apps/nuxt-app/composables/useApi.ts
import { ApiService } from '@cf/api-contracts';

export function useApi() {
  async function getApiService(): Promise<ApiService> {
    const backendType = process.env.NUXT_PUBLIC_BACKEND_TYPE || 'express';
    
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
  
  return {
    getApiService
  };
}
