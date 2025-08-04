# Glubs

Glubs is a full-stack, feature-rich platform designed to streamline the management of university clubs and events. It provides a seamless experience for students, club administrators, and platform admins with dedicated tools for event creation, user management, team formation, and in-depth analytics.

> Empowering Innovation, Elevating Experiences Seamlessly


## 🚀 Built With

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-9B479F?style=for-the-badge&logo=ejs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-5573F4?style=for-the-badge&logo=date-fns&logoColor=white)


## Key Features

-   **Role-Based Access Control**: Tailored experiences for Students, Club Admins, and Super Admins with secure JWT-based authentication.
-   **Comprehensive Event Management**: Create, update, and manage events with detailed options for visibility, participation type (individual/team), registration windows, and more.
-   **Dynamic Team Formation**: Users can create teams for specific events, send/receive invitations, and manage team members.
-   **Secure QR Code Attendance**: Generate unique QR codes for event participants and verify entries with a built-in QR scanner for organizers.
-   **In-depth Analytics Dashboard**: A powerful admin panel to visualize user registration trends, event type distribution, and manage all platform data including users, clubs, and events.
-   **Interactive Feedback System**: Gather valuable feedback from event attendees with ratings and reviews to improve future events.
-   **Real-time Notifications**: Keep users informed about team invitations and other important updates.

## Tech Stack

| Frontend                                                                                                     | Backend                                                                                                      |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [React](https://reactjs.org/)                                                                                | [Node.js](https://nodejs.org/)                                                                               |
| [Vite](https://vitejs.dev/)                                                                                  | [Express.js](https://expressjs.com/)                                                                         |
| [React Router](https://reactrouter.com/)                                                                     | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)                                 |
| [Tailwind CSS](https://tailwindcss.com/)                                                                     | [JWT](https://jwt.io/) for Authentication                                                                    |
| [Axios](https://axios-http.com/)                                                                             | [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for Password Hashing                                       |
| [Zustand](https://github.com/pmndrs/zustand) for State Management                                            | [Nodemailer](https://nodemailer.com/) for Email Services (OTP, Invitations)                                  |
| [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/) for data visualization              | [Faker.js](https://fakerjs.dev/) for database seeding                                                        |
| [Framer Motion](https://www.framer.com/motion/) for animations                                               | [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), [Dotenv](https://www.npmjs.com/package/dotenv) |
| [Lucide React](https://lucide.dev/) for icons                                                                |                                                                                                              |

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.16.0 or higher recommended)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sarafkushagra/Glubs.git
    cd Glubs
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    MONGO_URL=your_mongodb_connection_string
    PORT=3000
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90

    # Email credentials for Nodemailer (e.g., Gmail)
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASSWORD=your_email_app_password
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the `frontend` directory and add the backend URL:
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

### Database Seeding (Optional)

To populate the database with dummy data for testing, run the following command from the root directory:

```bash
node backend/init.js
```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend server will be running on `http://localhost:3000`.

2.  **Start the Frontend Development Server:**
    Open a new terminal window.
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## Project Structure

The repository is a monorepo containing the `frontend` and `backend` services.

### Backend Structure

The backend follows a modified MVC (Model-View-Controller) architecture for separation of concerns and maintainability.

```
backend/
├── controllers/    # Handles request logic (auth, events, users, etc.)
├── middlewares/    # Custom middlewares (e.g., isAuthenticated, restrictTo)
├── routers/        # Defines API routes for different resources
├── schema/         # Mongoose schemas for database models
└── utils/          # Utility functions (error handling, email sending, etc.)
```

### Frontend Structure

The frontend is built with React and Vite, organized by feature-based components.

```
frontend/src/
├── App.jsx         # Main application component
├── main.jsx        # Entry point with Router and Context providers
└── components/
    ├── AuthCard/   # Authentication components (Login, Signup, Verify)
    ├── Clubs/      # Components for club management
    ├── Context/    # React Context for theme and user state (Zustand)
    ├── DashBoard/  # Admin dashboard components
    ├── Events/     # Event-related components (details, feedback, sharing)
    ├── Features/   # High-level feature pages and analytics visualizations
    ├── Hosts/      # Components for event organizers
    ├── Pages/      # Core pages (Home, About, Navbar, Footer)
    ├── QR/         # QR code generator and scanner components
    └── ui/         # Reusable basic UI components (Button, Card, Input)
