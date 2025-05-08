# Документация на модула за кампании

## Въведение

Модулът за кампании в платформата Cystic Fibrosis Association позволява създаването и управлението на благотворителни кампании, към които потребителите (основно пациенти и родители) могат да се записват като участници. Този документ описва функционалностите на модула и предоставя примери за използване на API чрез GraphQL заявки.

## Модел на данните

Кампанията (Campaign) съдържа следните основни полета:

- **id**: Уникален идентификатор
- **title**: Заглавие на кампанията
- **description**: Описание на кампанията
- **goal**: Финансова цел, която трябва да бъде достигната
- **currentAmount**: Текуща събрана сума
- **startDate**: Начална дата на кампанията
- **endDate**: Крайна дата на кампанията (незадължителна)
- **events**: Масив от събития, свързани с кампанията
- **participants**: Масив от одобрени участници в кампанията
- **pendingParticipants**: Масив от чакащи одобрение участници
- **createdBy**: Потребител, създал кампанията
- **createdAt**: Дата на създаване
- **updatedAt**: Дата на последна промяна

## Контрол на достъпа

- **Създаване, редактиране и изтриване на кампании**:
  - Само администратори или потребители с група "campaigns" имат право
  
- **Записване за кампания**:
  - Само потребители с роля "patient" или "parent" могат да се записват
  - Записването изисква одобрение от администратор или потребител с група "campaigns"

- **Одобряване/отхвърляне на участници**:
  - Само администратори или потребители с група "campaigns" могат да одобряват или отхвърлят участници

## Уведомления в реално време

Системата поддържа уведомления в реално време чрез GraphQL Subscriptions:

- Когато потребител се запише за кампания, се публикува събитие `CAMPAIGN_PARTICIPANT_PENDING`
- Администраторите и потребителите с група "campaigns" могат да получават тези уведомления незабавно

## Примерни GraphQL заявки

### Queries

#### Получаване на всички кампании с пагинация

```graphql
query GetCampaigns($limit: Int, $offset: Int, $noLimit: Boolean) {
  getCampaigns(limit: $limit, offset: $offset, noLimit: $noLimit) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    participantsCount
    createdBy {
      name
      email
    }
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

Примерен отговор:
```json
{
  "data": {
    "getCampaigns": [
      {
        "id": "64a12b3c7890defabc123456",
        "title": "65 рози за муковисцидоза",
        "description": "Благотворителна кампания за набиране на средства за помощни съоръжения",
        "goal": 65000,
        "currentAmount": 42300,
        "startDate": "2023-06-01T10:00:00.000Z",
        "endDate": "2023-12-31T23:59:59.000Z",
        "participantsCount": 47,
        "createdBy": {
          "name": "Иван Петров",
          "email": "ivan.petrov@example.com"
        },
        "createdAt": "2023-05-15T14:32:10.000Z"
      },
      {
        "id": "64a12b3c7890defabc123457",
        "title": "Рехабилитация за деца с муковисцидоза",
        "description": "Кампания за подпомагане на рехабилитационни процедури за деца",
        "goal": 45000,
        "currentAmount": 27850,
        "startDate": "2023-07-01T10:00:00.000Z",
        "endDate": "2023-11-30T23:59:59.000Z",
        "participantsCount": 31,
        "createdBy": {
          "name": "Мария Иванова",
          "email": "maria.ivanova@example.com"
        },
        "createdAt": "2023-06-15T09:45:22.000Z"
      }
    ]
  }
}
```

#### Получаване на конкретна кампания по ID

```graphql
query GetCampaign($id: ID!) {
  getCampaign(id: $id) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    events {
      id
      title
      description
      date
      location
    }
    participants {
      _id
      name
      email
      role
    }
    participantsCount
    pendingParticipants {
      _id
      name
      email
      role
    }
    pendingParticipantsCount
    createdBy {
      _id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

Примерни параметри:
```json
{
  "id": "64a12b3c7890defabc123456"
}
```

Примерен отговор:
```json
{
  "data": {
    "getCampaign": {
      "id": "64a12b3c7890defabc123456",
      "title": "65 рози за муковисцидоза",
      "description": "Благотворителна кампания за набиране на средства за помощни съоръжения",
      "goal": 65000,
      "currentAmount": 42300,
      "startDate": "2023-06-01T10:00:00.000Z",
      "endDate": "2023-12-31T23:59:59.000Z",
      "events": [
        {
          "id": "64e12c7d8901feacbd234567",
          "title": "Благотворителен концерт",
          "description": "Концерт в подкрепа на кампанията",
          "date": "2023-09-15T18:00:00.000Z",
          "location": "НДК, София"
        },
        {
          "id": "64e12c7d8901feacbd234568",
          "title": "Спортен турнир",
          "description": "Спортен турнир за набиране на средства",
          "date": "2023-10-10T09:00:00.000Z",
          "location": "Спортна зала Арена София"
        }
      ],
      "participants": [
        {
          "_id": "64a12b3c7890defabc654321",
          "name": "Петър Стоянов",
          "email": "petar.stoyanov@example.com",
          "role": "patient"
        },
        {
          "_id": "64a12b3c7890defabc654322",
          "name": "Димитър Колев",
          "email": "dimitar.kolev@example.com",
          "role": "parent"
        }
      ],
      "participantsCount": 47,
      "pendingParticipants": [
        {
          "_id": "64a12b3c7890defabc654323",
          "name": "Анна Тодорова",
          "email": "anna.todorova@example.com",
          "role": "patient"
        }
      ],
      "pendingParticipantsCount": 3,
      "createdBy": {
        "_id": "64a12b3c7890defabc654324",
        "name": "Иван Петров",
        "email": "ivan.petrov@example.com"
      },
      "createdAt": "2023-05-15T14:32:10.000Z",
      "updatedAt": "2023-08-20T11:25:43.000Z"
    }
  }
}
```

#### Получаване на кампании с чакащи участници

```graphql
query GetPendingCampaignRequests($limit: Int, $offset: Int, $noLimit: Boolean) {
  getPendingCampaignRequests(limit: $limit, offset: $offset, noLimit: $noLimit) {
    id
    title
    pendingParticipants {
      _id
      name
      email
      role
    }
    pendingParticipantsCount
  }
}
```

Примерни параметри:
```json
{
  "limit": 20,
  "offset": 0,
  "noLimit": true
}
```

Примерен отговор:
```json
{
  "data": {
    "getPendingCampaignRequests": [
      {
        "id": "64a12b3c7890defabc123456",
        "title": "65 рози за муковисцидоза",
        "pendingParticipants": [
          {
            "_id": "64a12b3c7890defabc654323",
            "name": "Анна Тодорова",
            "email": "anna.todorova@example.com",
            "role": "patient"
          },
          {
            "_id": "64a12b3c7890defabc654325",
            "name": "Георги Николов",
            "email": "georgi.nikolov@example.com",
            "role": "parent"
          }
        ],
        "pendingParticipantsCount": 3
      },
      {
        "id": "64a12b3c7890defabc123457",
        "title": "Рехабилитация за деца с муковисцидоза",
        "pendingParticipants": [
          {
            "_id": "64a12b3c7890defabc654326",
            "name": "Стефан Иванов",
            "email": "stefan.ivanov@example.com",
            "role": "patient"
          }
        ],
        "pendingParticipantsCount": 1
      }
    ]
  }
}
```

#### Получаване на известия за кампании с чакащи участници

```graphql
query GetCampaignNotifications {
  getCampaignNotifications {
    id
    title
    pendingParticipants {
      _id
      name
      email
      role
    }
    pendingParticipantsCount
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "getCampaignNotifications": [
      {
        "id": "64a12b3c7890defabc123456",
        "title": "65 рози за муковисцидоза",
        "pendingParticipants": [
          {
            "_id": "64a12b3c7890defabc654323",
            "name": "Анна Тодорова",
            "email": "anna.todorova@example.com",
            "role": "patient"
          },
          {
            "_id": "64a12b3c7890defabc654325",
            "name": "Георги Николов",
            "email": "georgi.nikolov@example.com",
            "role": "parent"
          }
        ],
        "pendingParticipantsCount": 3
      }
    ]
  }
}
```

### Mutations

#### Създаване на кампания

```graphql
mutation CreateCampaign($input: CampaignInput!) {
  createCampaign(input: $input) {
    id
    title
    description
    goal
    startDate
    endDate
    createdBy {
      _id
      name
    }
  }
}
```

Примерни параметри:
```json
{
  "input": {
    "title": "За лечение на муковисцидоза",
    "description": "Кампания за набиране на средства за нови лекарства",
    "goal": 50000,
    "startDate": "2023-06-01T10:00:00.000Z",
    "endDate": "2023-12-31T23:59:59.000Z",
    "events": [
      {
        "title": "Благотворителен концерт",
        "description": "Концерт в подкрепа на кампанията",
        "date": "2023-09-15T18:00:00.000Z",
        "location": "НДК, София"
      }
    ]
  }
}
```

Примерни директни заявки:
```graphql
mutation {
  createCampaign(input: {
    title: "Fundraising for Cystic Fibrosis Research"
    description: "A campaign to raise funds for innovative CF research and treatment support"
    goal: 50000
    startDate: "2023-06-01T00:00:00.000Z"
    endDate: "2023-12-31T23:59:59.000Z"
    events: [
      {
        title: "Charity Concert"
        description: "A music event to support our cause"
        date: "2023-07-15T18:00:00.000Z"
        location: "Central Hall, Sofia"
      },
      {
        title: "CF Awareness Workshop"
        description: "Educational session about CF"
        date: "2023-08-20T10:00:00.000Z"
        location: "Medical University, Sofia"
      },
      {
        title: "Fundraising Dinner"
        description: "Exclusive dinner with donors and supporters"
        date: "2023-10-05T19:00:00.000Z"
        location: "Grand Hotel Sofia, Sofia"
      }
    ]
  }) {
    id
    title
    description
    goal
    startDate
    endDate
    events {
      id
      title
      date
      location
    }
    createdBy {
      _id
      name
    }
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "createCampaign": {
      "id": "64a12b3c7890defabc123458",
      "title": "За лечение на муковисцидоза",
      "description": "Кампания за набиране на средства за нови лекарства",
      "goal": 50000,
      "startDate": "2023-06-01T10:00:00.000Z",
      "endDate": "2023-12-31T23:59:59.000Z",
      "events": [
        {
          "id": "64e12c7d8901feacbd234569",
          "title": "Благотворителен концерт",
          "date": "2023-09-15T18:00:00.000Z",
          "location": "НДК, София"
        }
      ],
      "createdBy": {
        "_id": "64a12b3c7890defabc654324",
        "name": "Иван Петров"
      }
    }
  }
}
```

#### Обновяване на кампания

```graphql
mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {
  updateCampaign(id: $id, input: $input) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
  }
}
```

Примерни параметри:
```json
{
  "id": "64a12b3c7890defabc123456",
  "input": {
    "title": "Обновена кампания за лечение на муковисцидоза",
    "description": "Актуализирано описание на кампанията",
    "goal": 60000,
    "startDate": "2023-06-01T10:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }
}
```

Примерни директни заявки:
```graphql
mutation {
  updateCampaign(
    id: "64a12b3c7890defabc123456",
    input: {
      title: "Updated Fundraising for CF Research"
      description: "Extended campaign to support innovative research and medical support for CF"
      goal: 75000
      startDate: "2023-06-01T00:00:00.000Z"
      endDate: "2024-03-31T23:59:59.000Z"
      events: [
        {
          title: "Spring Charity Concert"
          description: "A follow-up music event to support our cause"
          date: "2024-03-15T18:00:00.000Z"
          location: "National Palace of Culture, Sofia"
        }
      ]
    }
  ) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "updateCampaign": {
      "id": "64a12b3c7890defabc123456",
      "title": "Обновена кампания за лечение на муковисцидоза",
      "description": "Актуализирано описание на кампанията",
      "goal": 60000,
      "currentAmount": 42300,
      "startDate": "2023-06-01T10:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.000Z"
    }
  }
}
```

#### Записване за кампания (за пациенти/родители)

```graphql
mutation JoinCampaign($id: ID!) {
  joinCampaign(id: $id) {
    id
    title
    pendingParticipantsCount
  }
}
```

Примерни параметри:
```json
{
  "id": "64a12b3c7890defabc123456"
}
```

Примерни директни заявки:
```graphql
mutation {
  joinCampaign(id: "64a12b3c7890defabc123456") {
    id
    title
    pendingParticipantsCount
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "joinCampaign": {
      "id": "64a12b3c7890defabc123456",
      "title": "65 рози за муковисцидоза",
      "pendingParticipantsCount": 4
    }
  }
}
```

#### Одобряване на участник в кампания

```graphql
mutation ApproveCampaignParticipant($campaignId: ID!, $userId: ID!) {
  approveCampaignParticipant(campaignId: $campaignId, userId: $userId) {
    id
    title
    participants {
      _id
      name
      email
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

Примерни параметри:
```json
{
  "campaignId": "64a12b3c7890defabc123456",
  "userId": "64a12b3c7890defabc654321"
}
```

Примерни директни заявки:
```graphql
mutation {
  approveCampaignParticipant(
    campaignId: "64a12b3c7890defabc123456",
    userId: "64a12b3c7890defabc654323"
  ) {
    id
    title
    participants {
      _id
      name
      email
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "approveCampaignParticipant": {
      "id": "64a12b3c7890defabc123456",
      "title": "65 рози за муковисцидоза",
      "participants": [
        {
          "_id": "64a12b3c7890defabc654321",
          "name": "Петър Стоянов",
          "email": "petar.stoyanov@example.com"
        },
        {
          "_id": "64a12b3c7890defabc654322",
          "name": "Димитър Колев",
          "email": "dimitar.kolev@example.com"
        },
        {
          "_id": "64a12b3c7890defabc654323",
          "name": "Анна Тодорова",
          "email": "anna.todorova@example.com"
        }
      ],
      "participantsCount": 48,
      "pendingParticipantsCount": 2
    }
  }
}
```

#### Отхвърляне на участник в кампания

```graphql
mutation RejectCampaignParticipant($campaignId: ID!, $userId: ID!) {
  rejectCampaignParticipant(campaignId: $campaignId, userId: $userId) {
    id
    title
    pendingParticipantsCount
  }
}
```

Примерни параметри:
```json
{
  "campaignId": "64a12b3c7890defabc123456",
  "userId": "64a12b3c7890defabc654321"
}
```

Примерни директни заявки:
```graphql
mutation {
  rejectCampaignParticipant(
    campaignId: "64a12b3c7890defabc123456",
    userId: "64a12b3c7890defabc654325"
  ) {
    id
    title
    pendingParticipantsCount
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "rejectCampaignParticipant": {
      "id": "64a12b3c7890defabc123456",
      "title": "65 рози за муковисцидоза",
      "pendingParticipantsCount": 1
    }
  }
}
```

#### Добавяне на събитие към кампания

```graphql
mutation AddCampaignEvent($campaignId: ID!, $input: CampaignEventInput!) {
  addCampaignEvent(campaignId: $campaignId, input: $input) {
    id
    title
    description
    date
    location
  }
}
```

Примерни параметри:
```json
{
  "campaignId": "64a12b3c7890defabc123456",
  "input": {
    "title": "Благотворителен базар",
    "description": "Базар с ръчно изработени предмети в подкрепа на кампанията",
    "date": "2023-11-20T10:00:00.000Z",
    "location": "Парадайс Център, София"
  }
}
```

Примерни директни заявки:
```graphql
mutation {
  addCampaignEvent(
    campaignId: "64a12b3c7890defabc123456",
    input: {
      title: "CF Awareness Walk"
      description: "Community walk to raise awareness about Cystic Fibrosis"
      date: "2023-12-05T09:00:00.000Z"
      location: "South Park, Sofia"
    }
  ) {
    id
    title
    description
    date
    location
  }
}
```

Примерен отговор:
```json
{
  "data": {
    "addCampaignEvent": {
      "id": "64e12c7d8901feacbd234570",
      "title": "Благотворителен базар",
      "description": "Базар с ръчно изработени предмети в подкрепа на кампанията",
      "date": "2023-11-20T10:00:00.000Z",
      "location": "Парадайс Център, София"
    }
  }
}
```

### Subscriptions

#### Абониране за нови записвания в кампания

```graphql
subscription CampaignPendingParticipants {
  campaignParticipantPending {
    id
    title
    pendingParticipantsCount
    pendingParticipants {
      _id
      name
      email
      role
    }
  }
}
```

Примерен полученi данни:
```json
{
  "data": {
    "campaignParticipantPending": {
      "id": "64a12b3c7890defabc123456",
      "title": "65 рози за муковисцидоза",
      "pendingParticipantsCount": 4,
      "pendingParticipants": [
        {
          "_id": "64a12b3c7890defabc654327",
          "name": "Николай Георгиев",
          "email": "nikolay.georgiev@example.com",
          "role": "patient"
        }
      ]
    }
  }
}
```

## Примери за клиентски код

### React Apollo клиент - Абониране за нови участници

```typescript
import { useSubscription, gql } from '@apollo/client';

const PENDING_PARTICIPANTS_SUBSCRIPTION = gql`
  subscription CampaignPendingParticipants {
    campaignParticipantPending {
      id
      title
      pendingParticipantsCount
      pendingParticipants {
        _id
        name
        email
      }
    }
  }
`;

function CampaignNotifications() {
  const { data, loading, error } = useSubscription(PENDING_PARTICIPANTS_SUBSCRIPTION);

  if (loading) return <p>Слушаме за нови заявки...</p>;
  if (error) return <p>Грешка: {error.message}</p>;

  // Когато получим ново уведомление
  if (data) {
    const { id, title, pendingParticipantsCount, pendingParticipants } = data.campaignParticipantPending;
    // Покажи известие
    return (
      <div>
        <h3>Нова заявка за кампания: {title}</h3>
        <p>Брой чакащи: {pendingParticipantsCount}</p>
        <ul>
          {pendingParticipants.map(user => (
            <li key={user._id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
```

### React Apollo клиент - Одобряване на участник

```typescript
import { useMutation, gql } from '@apollo/client';

const APPROVE_PARTICIPANT = gql`
  mutation ApproveCampaignParticipant($campaignId: ID!, $userId: ID!) {
    approveCampaignParticipant(campaignId: $campaignId, userId: $userId) {
      id
      title
      participantsCount
      pendingParticipantsCount
    }
  }
`;

function ApproveParticipantButton({ campaignId, userId, userName }) {
  const [approveParticipant, { loading, error }] = useMutation(APPROVE_PARTICIPANT);

  const handleApprove = async () => {
    try {
      const { data } = await approveParticipant({ 
        variables: { campaignId, userId } 
      });
      
      alert(`Потребител ${userName} е одобрен успешно за кампанията!`);
    } catch (err) {
      console.error("Грешка при одобрение:", err);
    }
  };

  return (
    <button 
      onClick={handleApprove} 
      disabled={loading}
    >
      {loading ? 'Обработване...' : 'Одобри участник'}
    </button>
  );
}
```

## Заключение

Модулът за кампании предоставя цялостно решение за създаване, управление и участие в благотворителни кампании. Чрез GraphQL API, клиентските приложения могат лесно да интегрират всички необходими функционалности, включително известия в реално време за нови заявки за участие.

Административният интерфейс позволява на оторизираните потребители да създават и управляват кампании, да одобряват или отхвърлят кандидати и да следят напредъка на кампаниите.
