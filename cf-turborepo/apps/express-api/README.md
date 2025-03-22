# Express API with TypeScript

This is a simple Express API built with TypeScript and ES modules.

## Setup

1. Install dependencies:
```
npm install
```

2. Build the TypeScript code:
```
npm run build
```

3. Start the server:
```
npm start
```

4. Start in development mode (with hot reloading):
```
npm run dev
```

## API Endpoints

### Users
- `GET /api/express/users` - Get all users
- `GET /api/express/users/:id` - Get a user by ID
- `POST /api/express/users` - Create a new user
- `PATCH /api/express/users/:id` - Update a user
- `DELETE /api/express/users/:id` - Delete a user

### Legacy Endpoints
- `GET /api/express/users-legacy` - Get all users (legacy endpoint)
- `GET /api/express/users-legacy/:id` - Get a user by ID (legacy endpoint)

## Project Structure

- `src/server.ts` - Main server file
- `src/routes/` - API routes
- `src/controllers/` - Request handlers
- `src/types/` - TypeScript interfaces
- `dist/` - Compiled JavaScript code 