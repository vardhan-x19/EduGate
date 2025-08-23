# QuizApp Backend API

## User Endpoints

### Register User
- **URL:** `/users/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "Your Name",
    "email": "your_email@tkrcet.com",
    "role": "teacher" | "student",
    "password": "your_password"
  }
  ```
- **Description:** Registers a new user. Only emails ending with `@tkrcet.com` are allowed.

---

### Login User
- **URL:** `/users/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "your_email@tkrcet.com",
    "password": "your_password"
  }
  ```
- **Description:** Logs in a user and returns a JWT token in a cookie. Only emails ending with `@tkrcet.com` are allowed.

---

### Get User Profile
- **URL:** `/users/profile`
- **Method:** `GET`
- **Headers:**
  - Requires authentication (JWT token in cookie or `Authorization: Bearer <token>` header)
- **Description:** Returns the authenticated user's profile.

---

## General
- All endpoints return JSON responses.
- Authentication is required for protected routes.
- JWT tokens are sent via cookies or Authorization header.

---

## Example Environment Variables
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file
4. Start the server: `npm run dev`

---

## License
MIT
