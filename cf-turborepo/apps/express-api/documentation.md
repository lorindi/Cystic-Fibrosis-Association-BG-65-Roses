# Документация на API за "65 Roses" - Асоциация за муковисцидоза

## Въведение

Това API предоставя функционалности за управление на уебсайта на Асоциация за муковисцидоза "65 Roses". API-то използва GraphQL и предоставя разнообразни възможности за управление на кампании, инициативи, конференции, събития, рецепти, истории на пациенти и други функционалности.

## Автентикация

API-то използва JWT (JSON Web Tokens) за автентикация. Токенът трябва да бъде включен в HTTP хедър `Authorization` във формат `Bearer [вашият_токен]`.

### Регистрация

```graphql
mutation {
  register(input: {
    name: "Име Фамилия",
    email: "email@example.com",
    password: "парола123"
  }) {
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

### Вход

```graphql
mutation {
  login(input: {
    email: "email@example.com",
    password: "парола123"
  }) {
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

### Проверка на текущия потребител

```graphql
query {
  getCurrentUser {
    _id
    name
    email
    role
    groups
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
    }
  }
}
```

### Актуализиране на профил

```graphql
mutation {
  updateProfile(input: {
    avatar: "https://example.com/avatar.jpg",
    bio: "Кратка биография",
    birthDate: "1990-01-01T00:00:00Z",
    address: {
      city: "София",
      postalCode: "1000",
      street: "бул. Витоша 1"
    },
    contact: {
      phone: "+359888123456",
      alternativeEmail: "alt@example.com",
      emergencyContact: {
        name: "Име на контакт при спешност",
        phone: "+359888654321",
        relation: "роднина"
      }
    },
    diagnosed: true,
    diagnosisYear: 2010,
    childName: "Име на детето" // за потребители с роля "родител"
  }) {
    _id
    name
    profile {
      avatar
      bio
      birthDate
      address {
        city
      }
      contact {
        phone
      }
    }
  }
}
```

## Управление на потребители

### Промяна на ролята на потребител (само за админи)

```graphql
mutation {
  setUserRole(userId: "user_id", role: patient) {
    _id
    name
    email
    role
  }
}
```

Възможни роли:
- `patient` - пациент
- `parent` - родител
- `donor` - дарител
- `admin` - администратор

### Добавяне на потребител към група (само за админи)

```graphql
mutation {
  addUserToGroup(userId: "user_id", group: campaigns) {
    _id
    name
    groups
  }
}
```

Възможни групи:
- `campaigns` - кампании
- `initiatives` - инициативи
- `conferences` - конференции
- `events` - събития
- `news` - новини
- `blog` - блог
- `recipes` - рецепти

### Премахване на потребител от група (само за админи)

```graphql
mutation {
  removeUserFromGroup(userId: "user_id", group: campaigns) {
    _id
    name
    groups
  }
}
```

### Получаване на потребител по ID

```graphql
query {
  getUser(id: "user_id") {
    _id
    name
    email
    role
    groups
  }
}
```

### Получаване на всички потребители (само за админи)

```graphql
query {
  getUsers {
    _id
    name
    email
    role
    groups
  }
}
```

### Получаване на потребители по роля (само за админи)

```graphql
query {
  getUsersByRole(role: patient) {
    _id
    name
    email
  }
}
```

### Получаване на потребители по група (само за админи)

```graphql
query {
  getUsersByGroup(group: campaigns) {
    _id
    name
    email
  }
}
```

## Кампании

### Създаване на кампания (изисква админ или група "кампании")

```graphql
mutation {
  createCampaign(input: {
    title: "Кампания за набиране на средства",
    description: "Подробно описание на кампанията",
    goal: 10000,
    startDate: "2023-10-01T00:00:00Z",
    endDate: "2023-12-31T00:00:00Z",
    events: [
      {
        title: "Стартово събитие",
        description: "Откриване на кампанията",
        date: "2023-10-01T18:00:00Z",
        location: "София, площад Славейков"
      }
    ]
  }) {
    id
    title
    goal
    currentAmount
    startDate
    endDate
    events {
      id
      title
      date
    }
  }
}
```

### Актуализиране на кампания

```graphql
mutation {
  updateCampaign(
    id: "campaign_id",
    input: {
      title: "Нов заголовок",
      description: "Ново описание",
      goal: 15000,
      endDate: "2024-01-31T00:00:00Z"
    }
  ) {
    id
    title
    description
    goal
    endDate
  }
}
```

### Изтриване на кампания

```graphql
mutation {
  deleteCampaign(id: "campaign_id")
}
```

### Добавяне на събитие към кампания

```graphql
mutation {
  addCampaignEvent(
    campaignId: "campaign_id",
    input: {
      title: "Ново събитие",
      description: "Описание на събитието",
      date: "2023-11-15T19:00:00Z",
      location: "Пловдив, Капана"
    }
  ) {
    id
    title
    date
    location
  }
}
```

### Актуализиране на събитие в кампания

```graphql
mutation {
  updateCampaignEvent(
    eventId: "event_id",
    input: {
      title: "Актуализирано заглавие",
      date: "2023-11-16T19:00:00Z"
    }
  ) {
    id
    title
    date
  }
}
```

### Изтриване на събитие от кампания

```graphql
mutation {
  deleteCampaignEvent(eventId: "event_id")
}
```

### Записване за кампания (само за пациенти и родители)

```graphql
mutation {
  joinCampaign(id: "campaign_id") {
    id
    title
    participants {
      _id
      name
    }
    participantsCount
  }
}
```

### Отписване от кампания

```graphql
mutation {
  leaveCampaign(id: "campaign_id") {
    id
    title
    participants {
      _id
      name
    }
    participantsCount
  }
}
```

### Получаване на кампания по ID

```graphql
query {
  getCampaign(id: "campaign_id") {
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
    }
    participantsCount
    createdBy {
      _id
      name
    }
  }
}
```

### Получаване на всички кампании

```graphql
query {
  getCampaigns {
    id
    title
    goal
    currentAmount
    startDate
    endDate
    participantsCount
  }
}
```

### Получаване на събития на кампания

```graphql
query {
  getCampaignEvents(campaignId: "campaign_id") {
    id
    title
    description
    date
    location
  }
}
```

### Получаване на кампаниите на текущия потребител

```graphql
query {
  getUserCampaigns {
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

## Инициативи

### Създаване на инициатива (изисква админ или група "инициативи")

```graphql
mutation {
  createInitiative(input: {
    title: "Раздаване на медикаменти",
    description: "Инициатива за безплатно раздаване на медикаменти",
    startDate: "2023-10-15T00:00:00Z",
    endDate: "2023-11-15T00:00:00Z",
    items: [
      {
        name: "Инхалатор",
        description: "Стандартен инхалатор",
        quantity: 50
      },
      {
        name: "Кависепт",
        description: "Медикамент за инхалация",
        quantity: 100
      }
    ]
  }) {
    id
    title
    startDate
    endDate
    items {
      id
      name
      quantity
    }
  }
}
```

### Актуализиране на инициатива

```graphql
mutation {
  updateInitiative(
    id: "initiative_id",
    input: {
      title: "Нов заголовок",
      description: "Ново описание",
      endDate: "2023-12-15T00:00:00Z"
    }
  ) {
    id
    title
    description
    endDate
  }
}
```

### Изтриване на инициатива

```graphql
mutation {
  deleteInitiative(id: "initiative_id")
}
```

### Добавяне на артикул към инициатива

```graphql
mutation {
  addInitiativeItem(
    initiativeId: "initiative_id",
    input: {
      name: "Мукоклиър",
      description: "Медикамент за муковисцидоза",
      quantity: 30
    }
  ) {
    id
    name
    description
    quantity
    distributedQuantity
  }
}
```

### Актуализиране на артикул в инициатива

```graphql
mutation {
  updateInitiativeItem(
    itemId: "item_id",
    input: {
      quantity: 40,
      distributedQuantity: 10
    }
  ) {
    id
    name
    quantity
    distributedQuantity
  }
}
```

### Изтриване на артикул от инициатива

```graphql
mutation {
  deleteInitiativeItem(itemId: "item_id")
}
```

### Записване за инициатива (само за пациенти)

```graphql
mutation {
  joinInitiative(id: "initiative_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Отписване от инициатива

```graphql
mutation {
  leaveInitiative(id: "initiative_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Получаване на инициатива по ID

```graphql
query {
  getInitiative(id: "initiative_id") {
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
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Получаване на всички инициативи

```graphql
query {
  getInitiatives {
    id
    title
    description
    startDate
    endDate
    items {
      name
      quantity
      distributedQuantity
    }
  }
}
```

### Получаване на инициативите на текущия потребител

```graphql
query {
  getUserInitiatives {
    id
    title
    description
    startDate
    endDate
    items {
      name
      quantity
    }
  }
}
```

## Конференции

### Създаване на конференция (изисква админ или група "конференции")

```graphql
mutation {
  createConference(input: {
    title: "Образователна конференция",
    description: "Конференция с лекции за пациенти и родители",
    startDate: "2023-11-10T09:00:00Z",
    endDate: "2023-11-12T18:00:00Z",
    location: "Медицински университет - София",
    agenda: [
      {
        title: "Нови терапии при муковисцидоза",
        speaker: "Д-р Иван Иванов",
        description: "Преглед на новите терапевтични подходи",
        startTime: "2023-11-10T10:00:00Z",
        endTime: "2023-11-10T11:30:00Z"
      }
    ]
  }) {
    id
    title
    location
    agenda {
      id
      title
      speaker
    }
  }
}
```

### Актуализиране на конференция

```graphql
mutation {
  updateConference(
    id: "conference_id",
    input: {
      title: "Нов заголовок",
      description: "Ново описание",
      location: "Нова локация"
    }
  ) {
    id
    title
    description
    location
  }
}
```

### Изтриване на конференция

```graphql
mutation {
  deleteConference(id: "conference_id")
}
```

### Добавяне на сесия към конференция

```graphql
mutation {
  addConferenceSession(
    conferenceId: "conference_id",
    input: {
      title: "Хранене при муковисцидоза",
      speaker: "Д-р Мария Петрова",
      description: "Правилно хранене за пациенти",
      startTime: "2023-11-10T13:00:00Z",
      endTime: "2023-11-10T14:30:00Z"
    }
  ) {
    id
    title
    speaker
    startTime
    endTime
  }
}
```

### Актуализиране на сесия в конференция

```graphql
mutation {
  updateConferenceSession(
    sessionId: "session_id",
    input: {
      title: "Актуализирано заглавие",
      speaker: "Нов лектор",
      startTime: "2023-11-10T13:30:00Z"
    }
  ) {
    id
    title
    speaker
    startTime
    endTime
  }
}
```

### Изтриване на сесия от конференция

```graphql
mutation {
  deleteConferenceSession(sessionId: "session_id")
}
```

### Записване за конференция

```graphql
mutation {
  joinConference(id: "conference_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Отписване от конференция

```graphql
mutation {
  leaveConference(id: "conference_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Получаване на конференция по ID

```graphql
query {
  getConference(id: "conference_id") {
    id
    title
    description
    startDate
    endDate
    location
    agenda {
      id
      title
      speaker
      description
      startTime
      endTime
    }
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Получаване на всички конференции

```graphql
query {
  getConferences {
    id
    title
    description
    startDate
    endDate
    location
    agenda {
      title
      speaker
    }
  }
}
```

## Събития за разтоварване

### Създаване на събитие (изисква админ или група "събития")

```graphql
mutation {
  createEvent(input: {
    title: "Планински поход",
    description: "Поход до връх Ботев",
    type: "спортно",
    date: "2023-11-20T09:00:00Z",
    location: "Стара Планина"
  }) {
    id
    title
    type
    date
    location
  }
}
```

### Актуализиране на събитие

```graphql
mutation {
  updateEvent(
    id: "event_id",
    input: {
      title: "Нов заголовок",
      description: "Ново описание",
      date: "2023-11-21T09:00:00Z"
    }
  ) {
    id
    title
    description
    date
  }
}
```

### Изтриване на събитие

```graphql
mutation {
  deleteEvent(id: "event_id")
}
```

### Записване за събитие

```graphql
mutation {
  joinEvent(id: "event_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Отписване от събитие

```graphql
mutation {
  leaveEvent(id: "event_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Получаване на събитие по ID

```graphql
query {
  getEvent(id: "event_id") {
    id
    title
    description
    type
    date
    location
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Получаване на всички събития

```graphql
query {
  getEvents {
    id
    title
    description
    type
    date
    location
  }
}
```

## Дарители и дарения

### Получаване на дарител по ID

```graphql
query {
  getDonor(id: "donor_id") {
    id
    name
    description
    logo
    website
    totalDonations
    donations {
      id
      amount
      date
    }
    user {
      _id
      name
      email
    }
  }
}
```

### Получаване на всички дарители

```graphql
query {
  getDonors {
    id
    name
    totalDonations
    donations {
      amount
    }
  }
}
```

### Създаване на дарение

```graphql
mutation {
  createDonation(input: {
    amount: 1000,
    campaignId: "campaign_id",
    items: ["item_id_1", "item_id_2"]
  }) {
    id
    amount
    date
    donor {
      id
      name
    }
    campaign {
      id
      title
    }
    items {
      id
      name
    }
  }
}
```

## Благотворителен магазин

### Създаване на артикул в магазина (изисква админ)

```graphql
mutation {
  createStoreItem(input: {
    name: "Подкрепа за изследвания",
    description: "Подкрепете изследванията на муковисцидоза",
    price: 50,
    image: "https://example.com/research.jpg",
    category: "изследвания"
  }) {
    id
    name
    price
    category
  }
}
```

### Актуализиране на артикул в магазина

```graphql
mutation {
  updateStoreItem(
    id: "item_id",
    input: {
      name: "Ново име",
      price: 55,
      available: true
    }
  ) {
    id
    name
    price
    available
  }
}
```

### Изтриване на артикул от магазина

```graphql
mutation {
  deleteStoreItem(id: "item_id")
}
```

### Получаване на артикул от магазина по ID

```graphql
query {
  getStoreItem(id: "item_id") {
    id
    name
    description
    price
    image
    category
    available
  }
}
```

### Получаване на всички артикули от магазина

```graphql
query {
  getStoreItems {
    id
    name
    description
    price
    image
    category
    available
  }
}
```

## Новини

### Създаване на новина (изисква админ или група "новини")

```graphql
mutation {
  createNews(input: {
    title: "Нова терапия одобрена",
    content: "Детайлно описание на новата терапия...",
    image: "https://example.com/therapy.jpg",
    tags: ["терапия", "лечение", "изследване"]
  }) {
    id
    title
    content
    tags
  }
}
```

### Актуализиране на новина

```graphql
mutation {
  updateNews(
    id: "news_id",
    input: {
      title: "Актуализирано заглавие",
      content: "Актуализирано съдържание",
      tags: ["ново", "терапия"]
    }
  ) {
    id
    title
    content
    tags
  }
}
```

### Изтриване на новина

```graphql
mutation {
  deleteNews(id: "news_id")
}
```

### Получаване на новина по ID

```graphql
query {
  getNewsItem(id: "news_id") {
    id
    title
    content
    image
    tags
    author {
      _id
      name
    }
    createdAt
    updatedAt
  }
}
```

### Получаване на всички новини

```graphql
query {
  getNews {
    id
    title
    content
    image
    tags
    author {
      name
    }
    createdAt
  }
}
```

## Блог

### Създаване на блог пост (трябва да бъде одобрен от админ или група "блог")

```graphql
mutation {
  createBlogPost(input: {
    title: "Моят опит с муковисцидоза",
    content: "Подробно описание на моя опит...",
    image: "https://example.com/blog.jpg",
    tags: ["опит", "мнение", "живот с муковисцидоза"]
  }) {
    id
    title
    content
    tags
    approved
  }
}
```

### Актуализиране на блог пост

```graphql
mutation {
  updateBlogPost(
    id: "post_id",
    input: {
      title: "Актуализирано заглавие",
      content: "Актуализирано съдържание",
      tags: ["ново", "опит"]
    }
  ) {
    id
    title
    content
    tags
  }
}
```

### Изтриване на блог пост

```graphql
mutation {
  deleteBlogPost(id: "post_id")
}
```

### Одобряване на блог пост (изисква админ или група "блог")

```graphql
mutation {
  approveBlogPost(id: "post_id") {
    id
    title
    approved
  }
}
```

### Добавяне на коментар към блог пост

```graphql
mutation {
  addComment(input: {
    content: "Много полезна информация!",
    postId: "post_id"
  }) {
    id
    content
    author {
      _id
      name
    }
    createdAt
  }
}
```

### Изтриване на коментар

```graphql
mutation {
  deleteComment(id: "comment_id")
}
```

### Получаване на блог пост по ID

```graphql
query {
  getBlogPost(id: "post_id") {
    id
    title
    content
    image
    tags
    approved
    author {
      _id
      name
    }
    comments {
      id
      content
      author {
        name
      }
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

### Получаване на всички блог постове

```graphql
query {
  getBlogPosts {
    id
    title
    content
    image
    tags
    approved
    author {
      name
    }
    comments {
      id
    }
    createdAt
  }
}
```

## Рецепти

### Създаване на рецепта (трябва да бъде одобрена от админ или група "рецепти")

```graphql
mutation {
  createRecipe(input: {
    title: "Протеинов шейк",
    description: "Подходящ за прием с Кафтрио",
    image: "https://example.com/shake.jpg",
    preparationTime: 10,
    cookingTime: 0,
    servings: 1,
    ingredients: [
      "1 банан",
      "200мл мляко",
      "2 лъжици протеин",
      "1 лъжица мед"
    ],
    instructions: [
      "Смесете всички съставки в блендер",
      "Разбъркайте до гладка консистенция"
    ],
    nutritionalInfo: {
      calories: 350,
      protein: 25,
      carbs: 45,
      fat: 5,
      vitamins: [
        {
          name: "Витамин C",
          amount: 15,
          unit: "mg"
        }
      ]
    }
  }) {
    id
    title
    approved
  }
}
```

### Актуализиране на рецепта

```graphql
mutation {
  updateRecipe(
    id: "recipe_id",
    input: {
      title: "Актуализирано заглавие",
      description: "Актуализирано описание",
      ingredients: [
        "1 голям банан",
        "250мл бадемово мляко",
        "2 лъжици протеин",
        "1 лъжица мед"
      ]
    }
  ) {
    id
    title
    description
    ingredients
  }
}
```

### Изтриване на рецепта

```graphql
mutation {
  deleteRecipe(id: "recipe_id")
}
```

### Одобряване на рецепта (изисква админ или група "рецепти")

```graphql
mutation {
  approveRecipe(id: "recipe_id") {
    id
    title
    approved
  }
}
```

### Получаване на рецепта по ID

```graphql
query {
  getRecipe(id: "recipe_id") {
    id
    title
    description
    image
    preparationTime
    cookingTime
    servings
    ingredients
    instructions
    nutritionalInfo {
      calories
      protein
      carbs
      fat
      vitamins {
        name
        amount
        unit
      }
    }
    author {
      _id
      name
    }
    approved
    createdAt
    updatedAt
  }
}
```

### Получаване на всички рецепти

```graphql
query {
  getRecipes {
    id
    title
    description
    preparationTime
    cookingTime
    servings
    ingredients
    nutritionalInfo {
      calories
      protein
    }
    approved
    author {
      name
    }
  }
}
```

## Истории

### Създаване на история (трябва да бъде одобрена от админ)

```graphql
mutation {
  createStory(input: {
    title: "Моят път с муковисцидозата",
    content: "Детайлно описание на моя опит и път...",
    image: "https://example.com/story.jpg"
  }) {
    id
    title
    approved
  }
}
```

### Актуализиране на история

```graphql
mutation {
  updateStory(
    id: "story_id",
    input: {
      title: "Актуализирано заглавие",
      content: "Актуализирано съдържание"
    }
  ) {
    id
    title
    content
  }
}
```

### Изтриване на история

```graphql
mutation {
  deleteStory(id: "story_id")
}
```

### Одобряване на история (изисква админ)

```graphql
mutation {
  approveStory(id: "story_id") {
    id
    title
    approved
  }
}
```

### Получаване на история по ID

```graphql
query {
  getStory(id: "story_id") {
    id
    title
    content
    image
    author {
      _id
      name
    }
    approved
    createdAt
    updatedAt
  }
}
```

### Получаване на всички истории

```graphql
query {
  getStories {
    id
    title
    content
    image
    author {
      name
    }
    approved
    createdAt
  }
}
```

## Чат съобщения

### Изпращане на съобщение

```graphql
mutation {
  sendChatMessage(input: {
    content: "Здравейте! Имам въпрос относно...",
    receiverId: "user_id",    # ID на получателя (опционално)
    roomId: "room_id"         # ID на стая (опционално)
  }) {
    id
    content
    sender {
      _id
      name
    }
    receiver {
      _id
      name
    }
    roomId
    createdAt
  }
}
```

### Получаване на съобщения

```graphql
query {
  getChatMessages(roomId: "room_id", userId: "user_id") {
    id
    content
    sender {
      _id
      name
    }
    receiver {
      _id
      name
    }
    roomId
    createdAt
  }
}
```

## Изкуствен интелект

### Задаване на въпрос към AI

```graphql
query {
  askAI(query: "Какви са симптомите на муковисцидоза?") {
    id
    query
    response
    createdAt
  }
}
``` 