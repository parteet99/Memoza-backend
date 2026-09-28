Memoza

Memoza is a modern, full-stack note-taking application designed to help users create, organize, manage, and securely store their personal notes in one place.

The application provides a clean and responsive interface for managing notes with features such as folders, favorites, pinned notes, archiving, trash, rich-text editing, pagination, profile management, password management, and authentication.

Memoza is built with Next.js on the frontend and Node.js, Express.js, and PostgreSQL on the backend. Authentication is handled using JWT-based authentication with HTTP-only cookies, providing a secure way to manage logged-in sessions.

Key Features

- User registration and login
- JWT-based authentication
- HTTP-only cookie-based sessions
- Forgot and reset password functionality
- Create, edit, and delete notes
- Rich-text note editor
- Pin important notes
- Mark notes as favorites
- Archive and unarchive notes
- Move notes into folders
- Trash and permanently delete notes
- Bulk deletion of notes
- Import and Export feature (in JSON and TEXT format)
- Pagination for large collections of notes
- User profile management
- Profile image upload
- Change password
- Dark and light theme support
- Responsive and modern UI
- API rate limiting for improved security

Technology Stack

Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- React Quill
- Lucide React
- next-themes

Backend

- Node.js
- Express.js
- JWT
- Multer
- Express Rate Limit

Database

- PostgreSQL

Project Architecture

Memoza follows a separate frontend/backend architecture. The Next.js application handles the user interface, routing, authentication state, and interaction with the backend API. The Express.js backend provides REST APIs for authentication, users, notes, folders, profile management, and other application functionality, while PostgreSQL stores the application's persistent data.

The project was built not only as a practical note-taking application but also as a hands-on full-stack project to understand concepts such as REST APIs, authentication, database relationships, file uploads, API security, pagination, CRUD operations, middleware, and frontend-backend integration.

<!-- Packages installed -->

express
nodemon
pg
bcrypt
dotenv
jsonwebtoken
cors
cookie-parser
multer
cloudinary
express-rate-limit
