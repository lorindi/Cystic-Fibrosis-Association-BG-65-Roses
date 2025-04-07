# Документация на модула за потребители и автентикация

## Въведение

Модулът за потребители и автентикация в платформата Cystic Fibrosis Association осигурява функционалности за регистрация, вход, управление на потребителски профили и контрол на достъпа. Документът описва структурата на модела за потребители, достъпните API заявки и примери за използването им.

## Модел на данните

Потребителят (User) съдържа следните основни полета:

- **_id**: Уникален идентификатор
- **name**: Име на потребителя
- **email**: Имейл адрес (използва се като потребителско име)
- **password**: Парола (хеширана)
- **role**: Роля на потребителя (patient, parent, donor, admin)
- **groups**: Масив от групи, към които принадлежи потребителят
- **isEmailVerified**: Флаг, указващ дали имейлът е потвърден
- **profile**: Обект с допълнителна информация за потребителя
  - **avatar**: URL към профилна снимка
  - **bio**: Кратка биография
  - **birthDate**: Дата на раждане
  - **address**: Адрес
  - **contact**: Контактна информация
  - **diagnosed**: Флаг, указващ дали е диагностициран (за пациенти)
  - **diagnosisYear**: Година на диагностициране (за пациенти)
  - **childName**: Име на детето (за родители)
  - **companyName**: Име на компания (за дарители)
- **createdAt**: Дата на създаване
- **updatedAt**: Дата на последна промяна

## Контрол на достъпа

Системата поддържа следните потребителски роли:

- **patient**: Пациент с муковисцидоза
- **parent**: Родител на пациент с муковисцидоза
- **donor**: Дарител или поддръжник
- **admin**: Администратор с пълни права

Потребителите могат да принадлежат към следните групи:

- **campaigns**: Управление на кампании
- **initiatives**: Управление на инициативи
- **conferences**: Управление на конференции
- **events**: Управление на събития
- **news**: Управление на новини
- **blog**: Управление на блог постове
- **recipes**: Управление на рецепти

Само потребител с роля "admin" може да променя ролите и групите на другите потребители. Администраторът се задава автоматично при регистрация, ако имейлът съвпада с предварително конфигурирания ADMIN_EMAIL в .env файла.

## Автентикация

Системата използва JWT (JSON Web Tokens) за автентикация. Всяка защитена заявка трябва да включва валиден JWT токен в хедъра `Authorization` във формат `Bearer {token}`.

## Потвърждение на имейл

След регистрация, потребителите получават имейл с връзка за потвърждение на имейл адреса. Токенът за потвърждение на имейла е валиден за 24 часа.

## Примерни GraphQL заявки

### Authentication

#### Регистрация

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      _id
      name
      email
      role
      isEmailVerified
      createdAt
    }
  }
}
```

Примерни параметри:
```json
{
  "input": {
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "password": "SecurePassword123"
  }
}
```

#### Вход

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      _id
      name
      email
      role
      groups
      isEmailVerified
    }
  }
}
```

Примерни параметри:
```json
{
  "input": {
    "email": "ivan@example.com",
    "password": "SecurePassword123"
  }
}
```

#### Google Authentication

```graphql
mutation GoogleAuth($input: GoogleAuthInput!) {
  googleAuth(input: $input) {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

Примерни параметри:
```json
{
  "input": {
    "idToken": "google_oauth2_token_from_client"
  }
}
```

#### Потвърждение на имейл

```graphql
mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    success
    message
    user {
      _id
      name
      email
      isEmailVerified
    }
    token
  }
}
```

Примерни параметри:
```json
{
  "token": "email_verification_token"
}
```

#### Повторно изпращане на имейл за потвърждение

```graphql
mutation ResendVerificationEmail {
  resendVerificationEmail
}
```

### Потребителски профил

#### Получаване на текущ потребител

```graphql
query GetCurrentUser {
  getCurrentUser {
    _id
    name
    email
    role
    groups
    isEmailVerified
    profile {
      avatar
      bio
      birthDate
      address {
        city
        postalCode
        street
      }
      contact {
        phone
        alternativeEmail
        emergencyContact {
          name
          phone
          relation
        }
      }
      diagnosed
      diagnosisYear
      childName
      companyName
    }
    createdAt
    updatedAt
  }
}
```

#### Актуализиране на профил

```graphql
mutation UpdateProfile($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    _id
    name
    profile {
      avatar
      bio
      birthDate
      address {
        city
        postalCode
        street
      }
      contact {
        phone
        alternativeEmail
      }
      diagnosed
      diagnosisYear
      childName
      companyName
    }
  }
}
```

Примерни параметри:
```json
{
  "input": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Кратка биография за мен",
    "birthDate": "1995-05-15T00:00:00.000Z",
    "address": {
      "city": "София",
      "postalCode": "1000",
      "street": "ул. Пиротска 5"
    },
    "contact": {
      "phone": "0888123456",
      "alternativeEmail": "ivan.alt@example.com",
      "emergencyContact": {
        "name": "Мария Петрова",
        "phone": "0888654321",
        "relation": "Съпруга"
      }
    },
    "diagnosed": true,
    "diagnosisYear": 2010
  }
}
```

### Административни функции

#### Получаване на всички потребители (само за admin)

```graphql
query GetUsers($limit: Int, $offset: Int, $noLimit: Boolean) {
  getUsers(limit: $limit, offset: $offset, noLimit: $noLimit) {
    _id
    name
    email
    role
    groups
    isEmailVerified
    createdAt
  }
}
```

Примерни параметри:
```json
{
  "limit": 10,
  "offset": 0,
  "noLimit": false
}
```

#### Получаване на потребители с пагинация (само за admin)

```graphql
query GetPaginatedUsers($limit: Int, $offset: Int, $noLimit: Boolean) {
  getPaginatedUsers(limit: $limit, offset: $offset, noLimit: $noLimit) {
    users {
      _id
      name
      email
      role
      groups
      isEmailVerified
    }
    totalCount
    hasMore
  }
}
```

Примерни параметри:
```json
{
  "limit": 10,
  "offset": 0,
  "noLimit": false
}
```

#### Филтриране на потребители по роля (само за admin)

```graphql
query GetUsersByRole($role: UserRole!, $limit: Int, $offset: Int) {
  getUsersByRole(role: $role, limit: $limit, offset: $offset) {
    _id
    name
    email
    role
    groups
    isEmailVerified
  }
}
```

Примерни параметри:
```json
{
  "role": "patient",
  "limit": 10,
  "offset": 0
}
```

#### Филтриране на потребители по група (само за admin)

```graphql
query GetUsersByGroup($group: UserGroup!, $limit: Int, $offset: Int) {
  getUsersByGroup(group: $group, limit: $limit, offset: $offset) {
    _id
    name
    email
    role
    groups
    isEmailVerified
  }
}
```

Примерни параметри:
```json
{
  "group": "campaigns",
  "limit": 10,
  "offset": 0
}
```

#### Промяна на роля на потребител (само за admin)

```graphql
mutation SetUserRole($userId: ID!, $role: UserRole!) {
  setUserRole(userId: $userId, role: $role) {
    _id
    name
    email
    role
  }
}
```

Примерни параметри:
```json
{
  "userId": "64a12b3c7890defabc123456",
  "role": "parent"
}
```

#### Добавяне на потребител към група (само за admin)

```graphql
mutation AddUserToGroup($userId: ID!, $group: UserGroup!) {
  addUserToGroup(userId: $userId, group: $group) {
    _id
    name
    email
    groups
  }
}
```

Примерни параметри:
```json
{
  "userId": "64a12b3c7890defabc123456",
  "group": "campaigns"
}
```

#### Премахване на потребител от група (само за admin)

```graphql
mutation RemoveUserFromGroup($userId: ID!, $group: UserGroup!) {
  removeUserFromGroup(userId: $userId, group: $group) {
    _id
    name
    email
    groups
  }
}
```

Примерни параметри:
```json
{
  "userId": "64a12b3c7890defabc123456",
  "group": "campaigns"
}
```

## Примери за клиентски код

### React Apollo клиент - Вход в системата

```typescript
import { useMutation, gql } from '@apollo/client';

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ 
        variables: { 
          input: { email, password } 
        } 
      });

      // Запазване на токена в localStorage
      localStorage.setItem('token', data.login.token);
      
      // Пренасочване след успешен вход
      window.location.href = '/dashboard';
    } catch (err) {
      console.error("Грешка при вход:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Имейл:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Парола:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p>Грешка: {error.message}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Изчакайте...' : 'Вход'}
      </button>
    </form>
  );
}
```

### React Apollo клиент - Актуализиране на потребителски профил

```typescript
import { useMutation, useQuery, gql } from '@apollo/client';

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      _id
      name
      profile {
        avatar
        bio
        address {
          city
          street
        }
        contact {
          phone
        }
      }
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      _id
      profile {
        avatar
        bio
        address {
          city
          street
        }
        contact {
          phone
        }
      }
    }
  }
`;

function ProfileEditor() {
  const { data, loading: queryLoading } = useQuery(GET_CURRENT_USER);
  const [updateProfile, { loading: mutationLoading }] = useMutation(UPDATE_PROFILE);
  
  const [profile, setProfile] = useState({
    avatar: '',
    bio: '',
    address: { city: '', street: '' },
    contact: { phone: '' }
  });

  // Инициализиране на формата с данните на потребителя
  useEffect(() => {
    if (data?.getCurrentUser?.profile) {
      setProfile({
        avatar: data.getCurrentUser.profile.avatar || '',
        bio: data.getCurrentUser.profile.bio || '',
        address: {
          city: data.getCurrentUser.profile.address?.city || '',
          street: data.getCurrentUser.profile.address?.street || ''
        },
        contact: {
          phone: data.getCurrentUser.profile.contact?.phone || ''
        }
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ 
        variables: { input: profile } 
      });
      alert('Профилът е обновен успешно!');
    } catch (err) {
      console.error("Грешка при обновяване на профила:", err);
    }
  };

  if (queryLoading) return <p>Зареждане...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Снимка (URL):</label>
        <input
          type="text"
          value={profile.avatar}
          onChange={(e) => setProfile({...profile, avatar: e.target.value})}
        />
      </div>
      <div>
        <label>Биография:</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
        />
      </div>
      <div>
        <label>Град:</label>
        <input
          type="text"
          value={profile.address.city}
          onChange={(e) => setProfile({
            ...profile,
            address: {...profile.address, city: e.target.value}
          })}
        />
      </div>
      <div>
        <label>Улица:</label>
        <input
          type="text"
          value={profile.address.street}
          onChange={(e) => setProfile({
            ...profile,
            address: {...profile.address, street: e.target.value}
          })}
        />
      </div>
      <div>
        <label>Телефон:</label>
        <input
          type="text"
          value={profile.contact.phone}
          onChange={(e) => setProfile({
            ...profile,
            contact: {...profile.contact, phone: e.target.value}
          })}
        />
      </div>
      <button type="submit" disabled={mutationLoading}>
        {mutationLoading ? 'Запазване...' : 'Запази промените'}
      </button>
    </form>
  );
}
```

## Setup на автентикацията в клиентското приложение

```typescript
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP връзка с GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

// Добавяне на токена към всички заявки
const authLink = setContext((_, { headers }) => {
  // Взимане на токена от localStorage
  const token = localStorage.getItem('token');
  
  // Връщане на хедърите с добавен Authorization хедър ако има токен
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Създаване на Apollo клиент
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Wrap на приложението с ApolloProvider
function App() {
  return (
    <ApolloProvider client={client}>
      {/* вашите компоненти */}
    </ApolloProvider>
  );
}
```

## Handling на WebSocket абонаменти

За да използвате WebSocket абонаменти (subscriptions), трябва да разширите вашата Apollo Client конфигурация по следния начин:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// HTTP връзка с GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

// WebSocket връзка за абонаменти
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:5000/graphql',
  connectionParams: {
    // Добавяне на токена към WebSocket връзката
    authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "",
  },
}));

// Добавяне на токена към HTTP заявките
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Разделяне на заявките: queries/mutations отиват по HTTP, subscriptions по WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

// Създаване на Apollo клиент с поддръжка на subscriptions
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
```

## Заключение

Модулът за потребители и автентикация предоставя цялостно решение за управление на потребителски акаунти, роли и права в платформата. Чрез GraphQL API, клиентските приложения могат лесно да интегрират автентикация, регистрация и управление на профили.

Системата за роли и групи позволява гъвкаво управление на правата за достъп до различните функционалности на платформата, като поддържа специализирани роли за различните типове потребители (пациенти, родители, дарители и администратори). 