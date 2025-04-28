# Настройка на Stripe Webhook след рестартиране на сървъра

## Предварителни изисквания
- Инсталиран Stripe CLI
- Инсталиран ngrok
- Работещ Express сървър

## Стъпки за настройка

### 1. Стартиране на Express сървъра
```bash
# Навигирайте до директорията на express-api
cd apps/express-api

# Стартирайте сървъра
npm run dev
```

### 2. Стартиране на ngrok
```bash
# Отворете нов терминал и стартирайте ngrok
ngrok http 5000
```
**Важно**: Запазете новия HTTPS URL, който ngrok генерира (изглежда като `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app`)

### 3. Конфигуриране на Stripe Webhook

1. Отворете [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Кликнете върху съществуващия webhook endpoint
3. Кликнете "..." и изберете "Update endpoint"
4. Въведете новия ngrok URL + `/webhook/stripe`
   - Пример: `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app/webhook/stripe`
5. Кликнете "Update endpoint"

### 4. Логване в Stripe CLI
```bash
# Отворете нов терминал
stripe login
```
Следвайте инструкциите за логване в браузъра.

### 5. Тестване на webhook връзката

Изпълнете следните команди, за да тествате различни събития:

```bash
# Тест за успешно плащане
stripe trigger payment_intent.succeeded

# Тест за неуспешно плащане
stripe trigger payment_intent.payment_failed

# Тест за добавен метод за плащане
stripe trigger payment_method.attached
```

### 6. Проверка на резултатите

Проверете следните места за потвърждение, че всичко работи:

1. **Express терминал**: Трябва да виждате логове за получените събития
2. **ngrok терминал**: Трябва да виждате успешни HTTP 200 отговори
3. **Stripe Dashboard**: В секцията Webhooks > Recent events трябва да виждате успешно доставени събития

## Важни забележки

- **Webhook Secret**: Не е нужно да променяте STRIPE_WEBHOOK_SECRET в `.env` файла - той остава същият
- **ngrok URL**: Трябва да актуализирате webhook URL-а в Stripe Dashboard всеки път, когато рестартирате ngrok
- **Stripe CLI**: Не е нужно да преинсталирате Stripe CLI, само да се логнете отново, ако сесията е изтекла

## Отстраняване на проблеми

Ако получавате грешки:

1. **400 Bad Request**:
   - Проверете дали Express сървърът работи
   - Уверете се, че webhook URL-ът е правилно конфигуриран в Stripe Dashboard

2. **Signature verification failed**:
   - Проверете дали STRIPE_WEBHOOK_SECRET в `.env` файла е правилен
   - Уверете се, че използвате правилния webhook endpoint

3. **Connection refused**:
   - Проверете дали Express сървърът работи на порт 5000
   - Уверете се, че ngrok е стартиран и сочи към правилния порт

## Полезни команди

```bash
# Проверка на статуса на ngrok
ngrok status

# Проверка на Stripe CLI статус
stripe status

# Спиране на webhook forward
stripe listen --stop

# Рестартиране на ngrok
ngrok restart
``` 