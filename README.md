
# FAQ Backend API

A multilingual FAQ management system with automatic translation support, built with Node.js, Express, Prisma, and Redis.

## Features
- **Create and manage FAQs with rich text support**
- **Automatic translation to multiple languages**
- **Redis caching for improved performance**
- **RESTful API endpoints**
- **Translation using Google Translate API**
- **Prisma ORM for database management**
- **Docker support for easy deployment**

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (using Prisma ORM)
- **Cache**: Redis
- **Frontend**: React (for admin panel)
- **Translation**: Google Translate API
- **Testing**: Mocha, Chai
- **Containerization**: Docker

## Prerequisites
Before starting, ensure that you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker (optional)

## Installation

### Local Development
1. Clone the repository:
    ```bash
    git clone https://github.com/tajbaba999/backend-assigment-bharatfd.git
    cd backend-assigment-bharatfd
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the following environment variables:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/faqdb?schema=public
    REDIS_URL=redis://localhost:6379
    PORT=8000
    GOOGLE_TRANSLATE_API_KEY=your-google-api-key
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

### Docker Deployment
You can also deploy the application using Docker by running the following command:
```bash
docker-compose up --build
```

### Docker Hub Repo: 
[Link to Docker Hub repository](https://hub.docker.com/r/0xtajbaba/bharatfd_backend)

## API Endpoints

### Create FAQ
**POST** `/api/faqs`
- **Body**:
    ```json
    {
      "question": "What is FAQ?",
      "answer": "FAQ stands for Frequently Asked Questions."
    }
    ```
- **Response**: `201 Created`
  
### Get FAQs
**GET** `/api/faqs`
- **Query Parameters**:
    - `lang`: Language code (e.g., 'hi' for Hindi, 'es' for Spanish)
- **Response**: `200 OK`
  
### Supported Languages
- **Hindi (hi)**
- **Bengali (bn)**
- **Telugu (te)**
- **Tamil (ta)**
- **Marathi (mr)**
- **Gujarati (gu)**
- **Kannada (kn)**
- **Malayalam (ml)**
- **Punjabi (pa)**
- **Odia (or)**

## Testing
Run the test suite with:
```bash
npm test
```

## Web Interface
Access the FAQ editor interface at:
```url
http://localhost:8000/
```

## Deployment
The application has been deployed on an AWS EC2 instance using GitHub Actions. You can access the live version at:
```url
http://15.206.191.142:8000/
```
Please note that the IP address above is the public IPv4 address of the EC2 instance, which is required to access the application externally.
