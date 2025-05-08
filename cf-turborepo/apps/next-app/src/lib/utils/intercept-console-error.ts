'use client';

/**
 * Утилитарен файл за прихващане и филтриране на конзолни грешки
 * Това позволява да предотвратим показването на конкретни познати грешки
 * в конзолата на браузъра и да ги филтрираме
 */

// Известни грешки, които искаме да филтрираме
const knownErrors = [
  'Login error: Невалиден имейл или парола',
  'invalid email or password',
  'Не сте влезли в системата',
  'сесията е изтекла',
  'Apollo error',
  'AuthenticationError',
  'Unauthorized'
];

// Инициализация на оригиналния метод console.error
const originalConsoleError = console.error;

/**
 * Функция за прихващане на конзолни грешки
 * @returns функция за почистване, която възстановява оригиналната функция
 */
export function interceptConsoleErrors() {
  // Заместваме console.error с наша функция
  console.error = (...args: any[]) => {
    // Проверка дали съобщението съдържа някоя от познатите ни грешки
    const errorMessage = args.join(' ');
    const shouldFilter = knownErrors.some(error => 
      typeof errorMessage === 'string' && errorMessage.includes(error)
    );

    // Ако трябва да филтрираме грешката, не я показваме в конзолата
    if (shouldFilter) {
      // Можем да заместим с по-кратко съобщение или да логваме в по-различен формат
      return;
    }

    // Филтрираме ApolloError за неуспешен логин
    if (args[0] && typeof args[0] === 'object' && args[0].message && 
        args[0].message.includes('Login error: Невалиден имейл или парола')) {
      return;
    }

    // За всички останали грешки, използваме оригиналната функция
    originalConsoleError(...args);
  };

  // Връщаме почистваща функция, която възстановява оригиналното поведение
  return () => {
    console.error = originalConsoleError;
  };
}

// Функция за прилагане на прихващането в клиентска част
export function setupErrorInterception() {
  if (typeof window !== 'undefined') {
    // Прилагаме само в браузър
    return interceptConsoleErrors();
  }
  return () => {}; // Празна почистваща функция за сървърна част
} 