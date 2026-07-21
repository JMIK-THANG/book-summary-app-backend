# 📚 CabuSim - Book Summary App (Backend)

A RESTful API built with Node.js, Express, and PostgreSQL that powers the CabuSim Book Summary App. It handles authentication, book management, comments, image uploads, and database operations.

## ✨ Features

- User registration and login
- JWT authentication
- Google OAuth authentication
- Password hashing with bcrypt
- CRUD operations for books
- Book comments
- Cloudinary image uploads
- PostgreSQL database
- Protected routes
- Input validation

---

## 🛠️ Built With

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Cloudinary
- Multer
- Express Validator
- dotenv

---

## 🔗 Frontend Repository

https://github.com/JMIK-THANG/book-summary-app

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/JMIK-THANG/book-summary-app-backend.git
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
PORT=5000

DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Start the development server

```bash
npm run dev
```

---

## 📌 API Endpoints

### Authentication

- `POST /register`
- `POST /login`
- `POST /google-login`

### Books

- `GET /books`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`

### Comments

- `GET /comments/:bookId`
- `POST /comments`

---

## 🚧 Future Improvements

- Add automated API testing
- Implement password reset
- Add rate limiting
- Add refresh tokens
- Generate Swagger API documentation

---

## 👨‍💻 Author

**Jmik Thang**

GitHub: https://github.com/JMIK-THANG
