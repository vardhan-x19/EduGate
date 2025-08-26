# QuizApp Backend API

# QuizApp Backend API

## Workflow

1. **User Registration**
  - Users register via `/users/register` with their name, email (must end with `@tkrcet.com`), role (teacher/student), and password.
  - On successful registration, a JWT token is generated and sent in a cookie.

2. **User Login**
  - Users log in via `/users/login` with their email and password.
  - On successful login, a JWT token is generated and sent in a cookie.

3. **Authentication**
  - Protected routes (e.g., `/users/profile`) require a valid JWT token, sent via cookie or Authorization header.
  - The backend verifies the token and authenticates the user.

4. **Profile Access**
  - Authenticated users can access their profile via `/users/profile`.
  - The backend returns user details if the token is valid.

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
