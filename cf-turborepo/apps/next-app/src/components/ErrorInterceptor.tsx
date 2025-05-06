'use client';

import { useEffect } from 'react';
import { setupErrorInterception } from '@/lib/utils/intercept-console-error';

export function ErrorInterceptor() {
  useEffect(() => {
    // При монтиране на компонента инициализираме прихващане на грешки
    const cleanup = setupErrorInterception();
    
    // При размонтиране прекъсваме прихващането
    return () => {
      cleanup();
    };
  }, []);
  
  // Компонентът не рендерира нищо видимо
  return null;
} 