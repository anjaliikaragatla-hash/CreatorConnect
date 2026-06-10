# CreatorConnect

CreatorConnect is a premium, full-stack marketplace platform connecting content creators with top brands for sponsorship, marketing, and collaboration campaigns.

## Key Features

* 🔐 **Authentication & Security**: Role-based access control (CREATOR / BRAND) secured with JWT tokens.
* 👤 **Dynamic Profiles**: Personalised profiles for both brands and creators, complete with followers, engagement rates, categories, and bio information.
* 📢 **Campaign Management**: Brands can create, list, and manage collaboration campaigns with custom budgets, deliverables, category matching, and follower requirements.
* 📝 **Application Tracking**: Creators can apply to campaigns with custom proposals, and brands can review, shortlist, accept, or reject applications.
* ⚡ **Modern UI**: Dark-mode primary design, Outfit & Inter typography, and micro-animations styled with TailwindCSS v4.

---

## Tech Stack

* **Backend**: Java 21, Spring Boot 4.0.6, Spring Security, JPA Hibernate, H2 Database (In-Memory, MySQL mode), JJWT.
* **Frontend**: React 19, Vite 8, TailwindCSS v4, Axios, React Router 7, Lucide Icons.

---

## Prerequisites

Ensure you have the following installed:
* **Java SDK**: Version 21 or later.
* **Node.js**: Version 24 or later.
* **Maven**: (Not strictly required, as the project includes the Maven wrapper `./mvnw`).

---

## Project Structure

```text
CreatorConnect/
├── backend/                  # Spring Boot 4.0.6 Java Backend
│   ├── src/                  # Source files
│   ├── pom.xml               # Maven configuration
│   └── mvnw                  # Maven Wrapper
└── frontend/                 # React 19 + Vite 8 Frontend
    ├── src/                  # React components & pages
    ├── public/               # Static assets
    ├── index.html            # Main HTML document
    └── vite.config.js        # Vite configurations
```

---

## Setup & Running Locally

### 1. Run the Backend

Navigate to the `backend` directory and run using the Maven wrapper:

```bash
cd backend

# Build and run the Spring Boot app
./mvnw spring-boot:run
```

* The backend will start on **`http://localhost:8080`**.
* The **H2 Database Console** is accessible at: `http://localhost:8080/h2-console`
  * **JDBC URL**: `jdbc:h2:mem:creatorconnectdb`
  * **Username**: `sa`
  * **Password**: `password`

### 2. Run the Frontend

Navigate to the `frontend` directory, install dependencies, and start the Vite development server:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

* The frontend will start on **`http://localhost:5173`**.
* In development, requests to `/api/*` are automatically proxied to `http://localhost:8080` via `vite.config.js`.

---

## Automated Verification & Testing

An integration test script has been created to perform end-to-end API validations:

1. Ensure the **backend server** is running on port 8080.
2. In a separate terminal shell, run:

```bash
node backend/../.gemini/antigravity-ide/brain/eb0e4c8d-f1d3-4053-912c-495a02b662ef/scratch/test_integration.js
```

This will run all stages of the flow:
* User registration for Brand & Creator.
* Login & JWT retrieval.
* Profile updates for both roles.
* Category listing retrieval.
* Campaign creation.
* Application submission.
* Application approval by the brand.
* Application status verification by the creator.

---

## Production Build & Deploy

### Backend Package

To bundle the backend into a single executable production JAR:

```bash
cd backend
./mvnw clean package
```

The resulting JAR file will be located at `backend/target/backend-0.0.1-SNAPSHOT.jar` and can be run with:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build

To build the static assets for the frontend:

```bash
cd frontend
npm run build
```

The compiled assets will be built in the `frontend/dist/` directory, ready to be served by the backend or any web server/CDN.
