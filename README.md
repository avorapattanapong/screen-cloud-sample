# ScreenCloud Order & Warehouse API

## Introduction

This project is a robust Fastify + TypeScript backend for managing orders and warehouses. It features:
- Clean RESTful API design
- Prisma ORM with PostgreSQL
- Robust error handling and global error mapping
- Comprehensive unit testing with Jest
- Dockerized deployment
- Example Postman collection for API exploration
- Linter support with ESLint and Prettier
- Automated migrations and seed data with Prisma

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development)
- npm

### Quick Start (Docker)

1. **Clone the repo:**
   ```sh
   git clone https://github.com/avorapattanapong/screen-cloud-sample.git
   cd screen-cloud-sample
   ```
2. **Start everything:**
   ```sh
   docker-compose up --build
   ```
   This will:
   - Start a Postgres database
   - Build and run the Fastify server at http://localhost:3000
   - Run migrations and seed sample data

3. **Test the API:**
   - Import `ScreenCloud.postman_collection.json` into Postman
   - Try endpoints like `GET /v1/warehouses`, `POST /v1/orders/verify`, etc.

### Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Setup your database:**
   - Copy `.env.example` to `.env` and set `DATABASE_URL`
   - Run migrations and seed:
     ```sh
     npx prisma migrate deploy
     npm run db:seed:dev
     ```
3. **Start the dev server:**
   ```sh
   npm run dev
   ```
   The server runs on http://localhost:3000

## Testing Strategy

### Unit & Integration Tests
- Written in Jest with Fastify's `inject` for HTTP endpoint testing
- Run all tests:
  ```sh
  npm test
  ```
- Tests cover repositories, services, error handling, and API routes

### API Testing
- Use the included `ScreenCloud.postman_collection.json` with Postman
- Covers all major endpoints and scenarios
- Checkout the API_DOC.md for additional details

## Project Structure

- `src/`
  - `api/` - Fastify route handlers, global error handler
  - `repositories/` - Data access, Prisma integration, repository error wrapping
  - `services/` - Business logic, service error wrapping
  - `utils/` - Helper functions (e.g., distance calculation)
  - `types/` - Shared TypeScript types
- `prisma/`
  - `schema.prisma` - Database schema
  - `seed.ts` - Seed script for development
- `docker-compose.yml`, `Dockerfile` - Containerization
- `ScreenCloud.postman_collection.json` - Example API requests

## Assumptions

- **Cost Formatting:**
  - The API returns raw numbers for costs (e.g., 50) instead of formatted currency strings. This is for machine-readability and UI flexibility.
- **Customer Identifier via Email:**
  - Orders include an `email` field (not unique) to allow searching and grouping by customer. This was added for practical querying, though not in the original requirements.

## 🚀 Things to Improve

- **Search Warehouse by Geographic Area:**
  - Add ability to search warehouses by latitude/longitude.
- **Use Real-World Shipping APIs:**
  - Replace Haversine-based distance calculations with integration to real shipping APIs for accurate routes.
- **Cache Distance Lookups:**
  - Cache geographic distance lookups to improve performance.
- **Authentication Support:**
  - Add OAuth or other authentication to secure endpoints.
- **Create Webhook for Shipping Updates:**
  - Allow third-party APIs to register webhooks for shipping status changes.
- **Notification System for Low Stock:**
  - Notify warehouse managers when stock is insufficient to fulfill orders.
- **API Documentation Server:**
  - Deploy a static documentation server with Swagger or OpenAPI.
- **Additional Endpoints:**
  - Add more endpoints for warehouse management, order verification, order fulfillment, etc.

## License

MIT
