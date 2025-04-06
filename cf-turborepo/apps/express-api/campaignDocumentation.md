# Документация на API за кампании

Това ръководство описва GraphQL заявките и мутациите, свързани с кампаниите в системата.

## Модел на данните за кампания

```typescript
type Campaign {
  id: ID!                             // Уникален идентификатор
  title: String!                      // Заглавие на кампанията
  description: String!                // Описание
  goal: Float!                        // Целева сума за събиране
  currentAmount: Float!               // Текущо събрана сума
  startDate: Date!                    // Начална дата
  endDate: Date                       // Крайна дата (опционална)
  events: [CampaignEvent!]!           // Събития, свързани с кампанията
  participants: [User!]!              // Одобрени участници
  participantsCount: Int!             // Брой одобрени участници
  pendingParticipants: [User!]!       // Чакащи одобрение участници
  pendingParticipantsCount: Int!      // Брой чакащи участници
  createdBy: User!                    // Потребител, създал кампанията
  createdAt: Date!                    // Дата на създаване
  updatedAt: Date!                    // Дата на последна актуализация
}

type CampaignEvent {
  id: ID!                             // Уникален идентификатор
  title: String!                      // Заглавие на събитието
  description: String!                // Описание
  date: Date!                         // Дата на събитието
  location: String!                   // Местоположение
}
```

## Заявки (Queries)

### 1. Получаване на една кампания

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
    createdBy {
      id
      name
    }
    participants {
      id
      name
    }
    pendingParticipants {
      id
      name
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

**Пример с променливи:**
```json
{
  "id": "5f8d0c1f6e1b7a001c8e1a6d"
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getCampaign(id: "5f8d0c1f6e1b7a001c8e1a6d") {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    createdBy {
      id
      name
    }
    participants {
      id
      name
    }
    pendingParticipants {
      id
      name
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

### 2. Получаване на всички кампании

```graphql
query GetCampaigns {
  getCampaigns {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    participantsCount
    pendingParticipantsCount
  }
}
```

### 3. Получаване на събития от кампания

```graphql
query GetCampaignEvents($campaignId: ID!) {
  getCampaignEvents(campaignId: $campaignId) {
    id
    title
    description
    date
    location
  }
}
```

**Пример с променливи:**
```json
{
  "campaignId": "5f8d0c1f6e1b7a001c8e1a6d"
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getCampaignEvents(campaignId: "5f8d0c1f6e1b7a001c8e1a6d") {
    id
    title
    description
    date
    location
  }
}
```

### 4. Получаване на кампаниите, в които потребителят участва

```graphql
query GetUserCampaigns {
  getUserCampaigns {
    id
    title
    description
    goal
    startDate
    endDate
  }
}
```

### 5. Получаване на кампании с чакащи заявки (за администратори и потребители с група CAMPAIGNS)

```graphql
query GetPendingCampaignRequests {
  getPendingCampaignRequests {
    id
    title
    pendingParticipants {
      id
      name
      email
      role
    }
    pendingParticipantsCount
  }
}
```

### 6. Получаване на статуса на потребителя в кампаниите

```graphql
query GetUserCampaignStatus {
  getUserCampaignStatus {
    campaign {
      id
      title
      description
      startDate
      endDate
    }
    status  # PENDING, APPROVED или NOT_REGISTERED
    registeredAt
  }
}
```

## Мутации (Mutations)

### 1. Създаване на кампания (само за администратори)

```graphql
mutation CreateCampaign($input: CampaignInput!) {
  createCampaign(input: $input) {
    id
    title
    description
    goal
    startDate
    endDate
  }
}
```

**Пример с променливи:**
```json
{
  "input": {
    "title": "Fundraising for Cystic Fibrosis Research",
    "description": "A campaign to raise funds for innovative CF research and treatment support",
    "goal": 50000,
    "startDate": "2023-06-01T00:00:00.000Z",
    "endDate": "2023-12-31T23:59:59.000Z",
    "events": [
      {
        "title": "Charity Concert",
        "description": "A music event to support our cause",
        "date": "2023-07-15T18:00:00.000Z",
        "location": "Central Hall, Sofia"
      },
      {
        "title": "CF Awareness Workshop",
        "description": "Educational session about CF",
        "date": "2023-08-20T10:00:00.000Z",
        "location": "Medical University, Sofia"
      }
    ]
  }
}
```

**Пример с директно подадени данни:**
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
      }
    ]
  }) {
    id
    title
    description
    goal
    startDate
    endDate
  }
}
```

### 2. Актуализиране на кампания (само за администратори)

```graphql
mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {
  updateCampaign(id: $id, input: $input) {
    id
    title
    description
    goal
    startDate
    endDate
  }
}
```

**Пример с променливи:**
```json
{
  "id": "5f8d0c1f6e1b7a001c8e1a6d",
  "input": {
    "title": "Updated: Fundraising for Cystic Fibrosis Research",
    "description": "Updated description with more details about the campaign impact",
    "goal": 75000,
    "startDate": "2023-06-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z",
    "events": [
      {
        "title": "Charity Gala Dinner",
        "description": "Fundraising dinner with special guests",
        "date": "2023-10-10T19:00:00.000Z",
        "location": "Grand Hotel, Sofia"
      }
    ]
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  updateCampaign(
    id: "5f8d0c1f6e1b7a001c8e1a6d",
    input: {
      title: "Updated: Fundraising for Cystic Fibrosis Research"
      description: "Updated description with more details about the campaign impact"
      goal: 75000
      startDate: "2023-06-01T00:00:00.000Z"
      endDate: "2024-01-31T23:59:59.000Z"
      events: [
        {
          title: "Charity Gala Dinner"
          description: "Fundraising dinner with special guests"
          date: "2023-10-10T19:00:00.000Z"
          location: "Grand Hotel, Sofia"
        }
      ]
    }
  ) {
    id
    title
    description
    goal
    startDate
    endDate
  }
}
```

### 3. Изтриване на кампания (само за администратори)

```graphql
mutation DeleteCampaign($id: ID!) {
  deleteCampaign(id: $id)  # връща true при успех
}
```

**Пример с променливи:**
```json
{
  "id": "5f8d0c1f6e1b7a001c8e1a6d"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  deleteCampaign(id: "5f8d0c1f6e1b7a001c8e1a6d")
}
```

### 4. Добавяне на събитие към кампания (само за администратори)

```graphql
mutation AddCampaignEvent($campaignId: ID!, $input: CampaignEventInput!) {
  addCampaignEvent(campaignId: $campaignId, input: $input) {
    id
    title
    date
    location
  }
}
```

**Пример с променливи:**
```json
{
  "campaignId": "5f8d0c1f6e1b7a001c8e1a6d",
  "input": {
    "title": "CF Conference",
    "description": "International conference on CF treatment innovations",
    "date": "2023-09-25T09:00:00.000Z",
    "location": "National Palace of Culture, Sofia"
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  addCampaignEvent(
    campaignId: "5f8d0c1f6e1b7a001c8e1a6d",
    input: {
      title: "CF Conference"
      description: "International conference on CF treatment innovations"
      date: "2023-09-25T09:00:00.000Z"
      location: "National Palace of Culture, Sofia"
    }
  ) {
    id
    title
    date
    location
  }
}
```

### 5. Актуализиране на събитие от кампания (само за администратори)

```graphql
mutation UpdateCampaignEvent($eventId: ID!, $input: CampaignEventInput!) {
  updateCampaignEvent(eventId: $eventId, input: $input) {
    id
    title
    date
    location
  }
}
```

**Пример с променливи:**
```json
{
  "eventId": "5f8d0c1f6e1b7a001c8e1a7e",
  "input": {
    "title": "Updated: CF Conference",
    "description": "Updated description for international conference",
    "date": "2023-10-05T10:00:00.000Z", 
    "location": "National Palace of Culture, Hall 3, Sofia"
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  updateCampaignEvent(
    eventId: "5f8d0c1f6e1b7a001c8e1a7e",
    input: {
      title: "Updated: CF Conference"
      description: "Updated description for international conference"
      date: "2023-10-05T10:00:00.000Z"
      location: "National Palace of Culture, Hall 3, Sofia"
    }
  ) {
    id
    title
    date
    location
  }
}
```

### 6. Изтриване на събитие от кампания (само за администратори)

```graphql
mutation DeleteCampaignEvent($eventId: ID!) {
  deleteCampaignEvent(eventId: $eventId)  # връща true при успех
}
```

**Пример с променливи:**
```json
{
  "eventId": "5f8d0c1f6e1b7a001c8e1a7e"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  deleteCampaignEvent(eventId: "5f8d0c1f6e1b7a001c8e1a7e")
}
```

### 7. Записване за кампания (само за пациенти и родители)

```graphql
mutation JoinCampaign($id: ID!) {
  joinCampaign(id: $id) {
    id
    title
    pendingParticipantsCount
  }
}
```

**Пример с променливи:**
```json
{
  "id": "5f8d0c1f6e1b7a001c8e1a6d"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  joinCampaign(id: "5f8d0c1f6e1b7a001c8e1a6d") {
    id
    title
    pendingParticipantsCount
  }
}
```

Когато потребител се запише за кампания, той се добавя в списъка с чакащи одобрение (`pendingParticipants`).

### 8. Одобряване на участник в кампания (само за администратори и потребители с група CAMPAIGNS)

```graphql
mutation ApproveCampaignParticipant($campaignId: ID!, $userId: ID!) {
  approveCampaignParticipant(campaignId: $campaignId, userId: $userId) {
    id
    title
    participants {
      id
      name
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

**Пример с променливи:**
```json
{
  "campaignId": "5f8d0c1f6e1b7a001c8e1a6d",
  "userId": "5f7c1d2e6b3a8f001e9d2b3c"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  approveCampaignParticipant(
    campaignId: "5f8d0c1f6e1b7a001c8e1a6d",
    userId: "5f7c1d2e6b3a8f001e9d2b3c"
  ) {
    id
    title
    participants {
      id
      name
    }
    participantsCount
    pendingParticipantsCount
  }
}
```

Тази мутация премества потребител от чакащ одобрение (`pendingParticipants`) към одобрени участници (`participants`).

### 9. Отхвърляне на заявка за участие (само за администратори и потребители с група CAMPAIGNS)

```graphql
mutation RejectCampaignParticipant($campaignId: ID!, $userId: ID!) {
  rejectCampaignParticipant(campaignId: $campaignId, userId: $userId) {
    id
    title
    pendingParticipantsCount
  }
}
```

**Пример с променливи:**
```json
{
  "campaignId": "5f8d0c1f6e1b7a001c8e1a6d",
  "userId": "5f7c1d2e6b3a8f001e9d2b3c"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  rejectCampaignParticipant(
    campaignId: "5f8d0c1f6e1b7a001c8e1a6d",
    userId: "5f7c1d2e6b3a8f001e9d2b3c"
  ) {
    id
    title
    pendingParticipantsCount
  }
}
```

Тази мутация премахва потребител от списъка с чакащи одобрение (`pendingParticipants`), без да го добавя към одобрените участници.

### 10. Отписване от кампания

```graphql
mutation LeaveCampaign($id: ID!) {
  leaveCampaign(id: $id) {
    id
    title
    participantsCount
  }
}
```

**Пример с променливи:**
```json
{
  "id": "5f8d0c1f6e1b7a001c8e1a6d"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  leaveCampaign(id: "5f8d0c1f6e1b7a001c8e1a6d") {
    id
    title
    participantsCount
  }
}
```

## Работен процес за участие в кампания

1. **Записване:** Пациент или родител използва `joinCampaign` мутацията, за да заяви участие в кампания
2. **Изчакване на одобрение:** Потребителят е добавен в списъка с чакащи одобрение (`pendingParticipants`)
3. **Одобрение:** Администратор или потребител с група CAMPAIGNS използва `approveCampaignParticipant` мутацията, за да одобри участието
4. **Участие:** След одобрение, потребителят се появява в списъка с одобрени участници (`participants`)

## Проверка на статус

Потребителите могат да използват заявката `getUserCampaignStatus`, за да проверят статуса на своите заявки за участие в различни кампании:

- `PENDING` - чака одобрение
- `APPROVED` - одобрен участник
- `NOT_REGISTERED` - не е записан за кампанията

## Ограничения за достъп

- **Създаване/Редактиране/Изтриване на кампании:** Администратори ИЛИ потребители с група CAMPAIGNS
- **Записване за кампании:** Само потребители с роля PATIENT или PARENT
- **Одобрение на участници:** Администратори ИЛИ потребители с група CAMPAIGNS
- **Преглед на чакащи заявки:** Администратори ИЛИ потребители с група CAMPAIGNS 