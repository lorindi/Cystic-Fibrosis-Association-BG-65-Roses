import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматира дата в локализиран формат
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Форматира валута
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Помощни функции за използване на генерираните типове
 */

// Помощна функция за екстракване на тип от операция
export type ExtractType<T> = T extends Array<infer U> ? U : T;

// Помощна функция за екстракване на път от данни
export function getPathValue<T, P extends string>(
  obj: T,
  path: P
): any {
  return path.split('.').reduce((o, p) => (o ? o[p as keyof typeof o] : undefined), obj as any);
}

// Помощна функция за преобразуване на типове
export function transformData<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

// Когато искаме да екстрактнем определен тип от генерирана заявка
export type QueryResult<T> = T extends { [key: string]: infer U } ? U : never;
