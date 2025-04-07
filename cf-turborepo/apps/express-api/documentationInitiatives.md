# Документация за Инициативите

## Въведение

Инициативите са важен компонент на системата, който позволява на Сдружението за борба с муковисцидоза да организира различни дейности и вътрешни събития за своите членове. Чрез функционалността на инициативите, администраторите могат да създават, управляват и проследяват различни активности, в които пациентите и родителите могат да участват след одобрение.

## Модел на данните

### Initiative Model

Моделът на инициативите се състои от следните основни полета:

```typescript
interface Initiative {
  id: string;                     // Уникален идентификатор
  title: string;                  // Заглавие на инициативата
  description: string;            // Описание на инициативата
  startDate: Date;                // Начална дата
  endDate?: Date;                 // Крайна дата (опционално)
  participants: User[];           // Одобрени участници
  pendingParticipants: User[];    // Чакащи одобрение участници
  createdBy: User;                // Създател на инициативата
  items: InitiativeItem[];        // Артикули/ресурси към инициативата
  createdAt: Date;                // Дата на създаване
  updatedAt: Date;                // Дата на последна актуализация
}

interface InitiativeItem {
  id: string;                     // Уникален идентификатор на артикула
  name: string;                   // Име на артикула
  description: string;            // Описание на артикула
  quantity: number;               // Общо количество
  distributedQuantity: number;    // Разпределено количество
}
```

### Виртуални полета

Моделът съдържа и следните изчислени (виртуални) полета, които не се съхраняват директно в базата данни:

- `participantsCount`: Брой одобрени участници в инициативата
- `pendingParticipantsCount`: Брой чакащи одобрение участници
- `isActive`: Флаг, който показва дали инициативата е активна в момента (на база сравнение на текущата дата със startDate и endDate)

## Права и роли

Достъпът до функционалностите на инициативите се определя от ролите и групите на потребителите:

### Роли на потребителите (UserRole)

- `ADMIN`: Администратори с пълни права
- `PATIENT`: Пациенти с муковисцидоза
- `PARENT`: Родители на пациенти с муковисцидоза
- `DONOR`: Дарители

### Групи (UserGroup)

- `INITIATIVES`: Група със специални права за управление на инициативи

### Правила за достъп

1. **Създаване, редактиране и изтриване на инициативи**:
   - Администратори (`ADMIN`)
   - Потребители в група `INITIATIVES`

2. **Записване за инициативи**:
   - Всички автентикирани потребители могат да подадат заявка за участие
   - Заявките отиват в списъка с чакащи одобрение (`pendingParticipants`)

3. **Одобрение на заявки**:
   - Администратори (`ADMIN`)
   - Потребители в група `INITIATIVES`

## GraphQL API

### Queries (Заявки)

#### 1. getInitiative

Извлича детайли за конкретна инициатива по ID.

```graphql
query GetInitiative($id: ID!) {
  getInitiative(id: $id) {
    id
    title
    description
    startDate
    endDate
    participants {
      _id
      name
      email
    }
    pendingParticipants {
      _id
      name
      email
    }
    createdBy {
      _id
      name
    }
    items {
      id
      name
      description
      quantity
      distributedQuantity
    }
    createdAt
    updatedAt
    participantsCount
    pendingParticipantsCount
    isActive
  }
}
```

**Пример с променливи:**
```json
{
  "id": "60a2b8e13f5d2c001c123456"
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getInitiative(id: "60a2b8e13f5d2c001c123456") {
    id
    title
    description
    startDate
    endDate
    participants {
      _id
      name
      email
    }
    pendingParticipants {
      _id
      name
      email
    }
    createdBy {
      _id
      name
    }
    items {
      id
      name
      description
      quantity
      distributedQuantity
    }
    createdAt
    updatedAt
    participantsCount
    pendingParticipantsCount
    isActive
  }
}
```

#### 2. getInitiatives

Извлича списък с всички инициативи с опция за пагинация.

```graphql
query GetInitiatives($limit: Int, $offset: Int, $noLimit: Boolean) {
  getInitiatives(limit: $limit, offset: $offset, noLimit: $noLimit) {
    id
    title
    description
    startDate
    endDate
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
    participantsCount
    pendingParticipantsCount
    isActive
  }
}
```

**Примери с променливи:**

Стандартна пагинация (първите 10 инициативи):
```json
{
  "limit": 10,
  "offset": 0
}
```

Без пагинация (връща всички инициативи):
```json
{
  "noLimit": true
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getInitiatives(limit: 5, offset: 0) {
    id
    title
    description
    startDate
    endDate
    participants {
      _id
      name
    }
    participantsCount
    isActive
  }
}
```

#### 3. getUserInitiatives

Извлича списък с инициативите, в които текущият потребител участва.

```graphql
query GetUserInitiatives($limit: Int, $offset: Int, $noLimit: Boolean) {
  getUserInitiatives(limit: $limit, offset: $offset, noLimit: $noLimit) {
    id
    title
    description
    startDate
    endDate
    items {
      id
      name
      description
      quantity
      distributedQuantity
    }
    isActive
    createdAt
    updatedAt
  }
}
```

**Примери с променливи:**

Стандартна пагинация (първите 5 инициативи на потребителя):
```json
{
  "limit": 5,
  "offset": 0
}
```

Без пагинация (връща всички инициативи на потребителя):
```json
{
  "noLimit": true
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getUserInitiatives(noLimit: true) {
    id
    title
    description
    startDate
    endDate
    isActive
  }
}
```

#### 4. getPendingInitiativeRequests

Извлича списък с потребителите, които чакат одобрение за конкретна инициатива.

```graphql
query GetPendingInitiativeRequests($initiativeId: ID!) {
  getPendingInitiativeRequests(initiativeId: $initiativeId) {
    _id
    name
    email
    profile {
      phone
      city
    }
  }
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456"
}
```

**Пример с директно подадени данни:**
```graphql
query {
  getPendingInitiativeRequests(initiativeId: "60a2b8e13f5d2c001c123456") {
    _id
    name
    email
    profile {
      phone
      city
    }
  }
}
```

### Mutations (Мутации)

#### 1. createInitiative

Създава нова инициатива.

```graphql
mutation CreateInitiative($input: InitiativeInput!) {
  createInitiative(input: $input) {
    id
    title
    description
    startDate
    endDate
    items {
      id
      name
      description
      quantity
    }
    createdAt
  }
}
```

**Пример с променливи:**
```json
{
  "input": {
    "title": "Инициатива за набиране на медицински консумативи",
    "description": "Набиране на спешно необходими медицински консумативи за деца с муковисцидоза",
    "startDate": "2023-07-01T00:00:00.000Z",
    "endDate": "2023-08-15T23:59:59.000Z",
    "items": [
      {
        "name": "Небулайзери",
        "description": "Небулайзери за инхалации",
        "quantity": 25
      },
      {
        "name": "Антибиотици",
        "description": "Специализирани антибиотици",
        "quantity": 50
      }
    ]
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  createInitiative(input: {
    title: "Инициатива за набиране на медицински консумативи"
    description: "Набиране на спешно необходими медицински консумативи за деца с муковисцидоза"
    startDate: "2023-07-01T00:00:00.000Z"
    endDate: "2023-08-15T23:59:59.000Z"
    items: [
      {
        name: "Небулайзери"
        description: "Небулайзери за инхалации"
        quantity: 25
      },
      {
        name: "Антибиотици"
        description: "Специализирани антибиотици"
        quantity: 50
      }
    ]
  }) {
    id
    title
    description
    startDate
    endDate
  }
}
```

#### 2. updateInitiative

Актуализира съществуваща инициатива.

```graphql
mutation UpdateInitiative($id: ID!, $input: InitiativeInput!) {
  updateInitiative(id: $id, input: $input) {
    id
    title
    description
    startDate
    endDate
    items {
      id
      name
      description
      quantity
    }
    updatedAt
  }
}
```

**Пример с променливи:**
```json
{
  "id": "60a2b8e13f5d2c001c123456",
  "input": {
    "title": "Актуализирана: Инициатива за набиране на медицински консумативи",
    "description": "Актуализирано описание с повече детайли за нуждите",
    "startDate": "2023-07-01T00:00:00.000Z",
    "endDate": "2023-09-30T23:59:59.000Z",
    "items": [
      {
        "name": "Небулайзери",
        "description": "Небулайзери за дългосрочна употреба",
        "quantity": 40
      },
      {
        "name": "Антибиотици",
        "description": "Специализирани антибиотици",
        "quantity": 60
      }
    ]
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  updateInitiative(
    id: "60a2b8e13f5d2c001c123456",
    input: {
      title: "Актуализирана: Инициатива за набиране на медицински консумативи"
      description: "Актуализирано описание с повече детайли за нуждите"
      startDate: "2023-07-01T00:00:00.000Z"
      endDate: "2023-09-30T23:59:59.000Z"
      items: [
        {
          name: "Небулайзери"
          description: "Небулайзери за дългосрочна употреба"
          quantity: 40
        },
        {
          name: "Антибиотици"
          description: "Специализирани антибиотици"
          quantity: 60
        }
      ]
    }
  ) {
    id
    title
    description
    startDate
    endDate
  }
}
```

#### 3. deleteInitiative

Изтрива инициатива.

```graphql
mutation DeleteInitiative($id: ID!) {
  deleteInitiative(id: $id)
}
```

**Пример с променливи:**
```json
{
  "id": "60a2b8e13f5d2c001c123456"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  deleteInitiative(id: "60a2b8e13f5d2c001c123456")
}
```

#### 4. joinInitiative

Подава заявка за участие в инициатива.

```graphql
mutation JoinInitiative($initiativeId: ID!) {
  joinInitiative(initiativeId: $initiativeId)
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  joinInitiative(initiativeId: "60a2b8e13f5d2c001c123456")
}
```

#### 5. leaveInitiative

Отказва се от участие в инициатива.

```graphql
mutation LeaveInitiative($initiativeId: ID!) {
  leaveInitiative(initiativeId: $initiativeId)
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  leaveInitiative(initiativeId: "60a2b8e13f5d2c001c123456")
}
```

#### 6. approveInitiativeParticipant

Одобрява заявка за участие.

```graphql
mutation ApproveInitiativeParticipant($initiativeId: ID!, $userId: ID!) {
  approveInitiativeParticipant(initiativeId: $initiativeId, userId: $userId)
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456",
  "userId": "60a1c7e13f5d2c001c654321"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  approveInitiativeParticipant(
    initiativeId: "60a2b8e13f5d2c001c123456",
    userId: "60a1c7e13f5d2c001c654321"
  )
}
```

#### 7. rejectInitiativeParticipant

Отхвърля заявка за участие.

```graphql
mutation RejectInitiativeParticipant($initiativeId: ID!, $userId: ID!) {
  rejectInitiativeParticipant(initiativeId: $initiativeId, userId: $userId)
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456",
  "userId": "60a1c7e13f5d2c001c654321"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  rejectInitiativeParticipant(
    initiativeId: "60a2b8e13f5d2c001c123456",
    userId: "60a1c7e13f5d2c001c654321"
  )
}
```

#### 8. addInitiativeItem

Добавя нов артикул към инициатива.

```graphql
mutation AddInitiativeItem($initiativeId: ID!, $input: InitiativeItemInput!) {
  addInitiativeItem(initiativeId: $initiativeId, input: $input) {
    id
    name
    description
    quantity
    distributedQuantity
  }
}
```

**Пример с променливи:**
```json
{
  "initiativeId": "60a2b8e13f5d2c001c123456",
  "input": {
    "name": "Дихателни маски",
    "description": "Специални дихателни маски за деца",
    "quantity": 30
  }
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  addInitiativeItem(
    initiativeId: "60a2b8e13f5d2c001c123456",
    input: {
      name: "Дихателни маски"
      description: "Специални дихателни маски за деца"
      quantity: 30
    }
  ) {
    id
    name
    description
    quantity
  }
}
```

#### 9. deleteInitiativeItem

Изтрива артикул от инициатива.

```graphql
mutation DeleteInitiativeItem($itemId: ID!) {
  deleteInitiativeItem(itemId: $itemId)
}
```

**Пример с променливи:**
```json
{
  "itemId": "60a3c9f13f5d2c001c789012"
}
```

**Пример с директно подадени данни:**
```graphql
mutation {
  deleteInitiativeItem(itemId: "60a3c9f13f5d2c001c789012")
}
```

## Процес на работа с инициативи

### Създаване на инициатива

1. Администратор или потребител от група "инициативи" създава нова инициатива чрез мутацията `createInitiative`
2. Задължителни полета са: заглавие, описание, начална дата
3. По желание може да се зададе и крайна дата
4. Могат да се добавят и артикули при създаването

### Записване за инициатива

1. Потребител (пациент или родител) изпраща заявка за участие чрез мутацията `joinInitiative`
2. Системата автоматично добавя потребителя в списъка с чакащи одобрение (`pendingParticipants`)
3. На потребителя се показва съобщение, че заявката му ще бъде разгледана

### Процес на одобрение

1. Администратор или потребител от група "инициативи" преглежда списъка с чакащи заявки
2. Използва мутацията `approveInitiativeParticipant`, за да одобри участник (премества го от `pendingParticipants` в `participants`)
3. Или използва мутацията `rejectInitiativeParticipant`, за да отхвърли заявката (премахва го от `pendingParticipants`)

### Отказ от участие

1. Участник може да се откаже от участие чрез мутацията `leaveInitiative`
2. Системата го премахва от съответния списък (одобрени или чакащи)

## Потребителски интерфейс

### Администраторски панел

1. **Списък с инициативи** - показва всички инициативи с възможност за търсене и филтриране
2. **Създаване/редактиране на инициативи** - форма за създаване на нова инициатива или редактиране на съществуваща
3. **Управление на артикули** - възможност за добавяне, редактиране и изтриване на артикули към инициатива
4. **Управление на участници** - табове с одобрени участници и чакащи одобрение, с бутони за одобряване/отхвърляне

### Потребителски интерфейс

1. **Налични инициативи** - показва всички текущи инициативи с бутон за записване
2. **Моите инициативи** - показва инициативите, в които потребителят участва или е заявил участие
3. **Индикация за статус** - различни цветове и етикети, показващи статуса на потребителя (одобрен, чакащ одобрение)

## Индекси за оптимизация на базата данни

За по-бързи заявки са добавени следните индекси:

```typescript
InitiativeSchema.index({ startDate: 1 });
InitiativeSchema.index({ endDate: 1 });
InitiativeSchema.index({ createdBy: 1 });
InitiativeSchema.index({ participants: 1 });
InitiativeSchema.index({ pendingParticipants: 1 });
```

## Сигурност и валидация

1. **Проверка на права** - всички заявки проверяват дали потребителят има необходимите права
2. **Валидация на входните данни** - проверяват се задължителните полета и формати
3. **Предпазване от дублиране** - проверява се дали потребител вече е заявил участие или вече е одобрен

## Заключение

Функционалността за инициативи предоставя гъвкава система за организиране на вътрешни събития и дейности, с ясен процес на одобрение на участници. Тя поддържа различни роли и нива на достъп, позволявайки контролирано управление на ресурси и участници. 