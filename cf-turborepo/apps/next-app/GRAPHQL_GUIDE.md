# GraphQL Guide за проекта

## Структура и организация

Този проект използва GraphQL Code Generator за автоматично генериране на TypeScript типове от GraphQL схемата и операциите.

### Основни директории:

- `src/graphql/operations/` - Тук се дефинират всички GraphQL операции (заявки, мутации, фрагменти)
- `src/graphql/generated/` - Тук се генерират всички типове с `graphql-codegen`

## Правилно използване на импортите

### ✅ Правилно:

```typescript
// Импортиране на операции
import { GET_USERS, CREATE_USER } from '@/graphql/operations';

// Импортиране на типове
import { User, CreateUserMutationVariables } from '@/graphql/generated/graphql';

// Или използвайте индексния файл за всичко
import { User, GET_USERS } from '@/graphql';
```

### ❌ Неправилно:

```typescript
// НЕ правете това
import { GET_USERS } from '@/graphql/queries/user.queries';
import { CREATE_USER } from '@/graphql/mutations/user.mutations';
import { User } from '@/lib/apollo/types';
```

## Работа с генерираните типове

GraphQL Code Generator създава няколко типа за всяка операция:

- `{ИмеНаОперация}Query` - Типът на резултата от заявката
- `{ИмеНаОперация}QueryVariables` - Типът на променливите за заявката
- `{ИмеНаОперация}Mutation` - Типът на резултата от мутацията
- `{ИмеНаОперация}MutationVariables` - Типът на променливите за мутацията

Пример за използване:

```typescript
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/operations';
import type { GetUsersQuery, GetUsersQueryVariables } from '@/graphql/generated/graphql';

// Правилно типизирана заявка
const { data, loading } = useQuery<GetUsersQuery, GetUsersQueryVariables>(
  GET_USERS,
  { variables: { limit: 10 } }
);

// Достъп до типизирани данни
const users = data?.getUsers || [];
```

## Генериране на типове

За да генерирате типовете:

```bash
npm run generate
```

Типовете ще се генерират автоматично преди `dev` и `build` командите.

## Добавяне на нови операции

1. Добавете новата операция в подходящия файл в `src/graphql/operations/`
2. Стартирайте `npm run generate` за да се генерират новите типове
3. Използвайте операцията и генерираните типове във вашия код

## Дефиниране на фрагменти

Фрагментите помагат за преизползване на части от заявките:

```typescript
// В operations/user.ts
export const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;
``` 