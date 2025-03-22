# CF Turborepo

This is a monorepo template for the Cystic Fibrosis Association project using [Turborepo](https://turbo.build/).

## What's Inside

This monorepo includes the following packages/apps:

### Apps

- `next-app`: [Next.js](https://nextjs.org/) frontend application
- `nuxt-app`: [Nuxt.js](https://nuxt.com/) frontend application
- `express-api`: [Express](https://expressjs.com/) backend API
- `nest-api`: [NestJS](https://nestjs.com/) backend API

### Packages

- `@cf/api-contracts`: Shared TypeScript interfaces and types
- `@cf/express-adapter`: Adapter for Express API
- `@cf/nest-adapter`: Adapter for NestJS API
- `@cf/supabase-adapter`: Adapter for Supabase (mocked)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v7+ recommended)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

You can run different combinations of frontend and backend services:

#### Next.js with Express

```bash
npm run dev:next-express
```

#### Next.js with NestJS

```bash
npm run dev:next-nest
```

#### Next.js with Supabase (mocked)

```bash
npm run dev:next-supabase
```

#### Nuxt with Express

```bash
npm run dev:nuxt-express
```

#### Nuxt with NestJS

```bash
npm run dev:nuxt-nest
```

#### Nuxt with Supabase (mocked)

```bash
npm run dev:nuxt-supabase
```

### Building

To build all apps and packages:

```bash
npm run build
```

## Architecture

This template demonstrates a flexible architecture that allows swapping between different frontend frameworks (Next.js and Nuxt.js) and backend services (Express, NestJS, and Supabase) without changing the core business logic.

### Adapter Pattern

The `adapter-factory` utility creates appropriate adapters based on the environment configuration, allowing the frontend to interact with different backends seamlessly.

## Demo

Navigate to `/api-demo` in either the Next.js or Nuxt.js app to see a demonstration of the adapter pattern in action. You can switch between different backend implementations and see how the same frontend components work with each one.

## Adding New Services

To add a new backend or frontend service:

1. Create a new app in the `apps` directory
2. Create a new adapter in the `packages/adapters` directory
3. Update the adapter factory to support the new service
4. Add the appropriate scripts to the root `package.json`
