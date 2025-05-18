# User Store API

RESTful API built with TypeScript and Express for user management and authentication.

## Features

- 🔐 JWT Authentication and Authorization
- 📧 Email Service Integration
- 🗄️ MongoDB Database with Mongoose
- 📤 File Handling and Image Upload
- 🐳 Docker Development Configuration
- 🔄 Initial Data Seeding System

## Main Technologies

- TypeScript
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Nodemailer
- Docker
- Express FileUpload

## Prerequisites

- Node.js
- Docker and Docker Compose (optional)
- MongoDB (if not using Docker)

## Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.template .env
```
Edit the `.env` file with your configurations

4. Start services with Docker (optional)
```bash
docker-compose up -d
```

5. Populate database with initial data
```bash
npm run seed
```

6. Start development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Compiles the TypeScript project
- `npm run start`: Compiles and runs the project
- `npm run seed`: Runs the database seeding script

## Project Structure

```
src/
├── controllers/    # Application controllers
├── data/          # Data and seeding scripts
├── models/        # MongoDB models
├── routes/        # API routes
├── services/      # Business services
└── app.ts         # Application entry point
```

## License

ISC

