# API

This is the backend API for the World Map project. It is built with NestJS and provides data to the frontend application.

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Node.js](https://nodejs.org/en/) (v18 or higher) and [Yarn](https://yarnpkg.com/) installed.

### 🛠️ Installation

1.  **Navigate** to the `api` directory:

    ```bash
    cd api
    ```

2.  **Install** the dependencies:

    ```bash
    yarn install
    ```

### ⚙️ Configuration

Create a `.env` file in this directory and add the following environment variables:

```
# .env

API_PORT=3000
```

### 🏃 Running the API

Once the dependencies are installed, you can run the API in development mode:

```bash
yarn run start:dev
```

The API will be available at `http://localhost:3000/`.

### 🐳 Docker

You can also run the API using Docker.

1.  **Build** the Docker image from the root directory:

    ```bash
    docker build -t world-map-api -f api/api.Dockerfile .
    ```

2.  **Run** the container:

    ```bash
    docker run -p 3000:3000 world-map-api
    ```

---

## 📦 Technologies Used

*   **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   **[Yarn](https://yarnpkg.com/)**: A fast, reliable, and secure package manager.
*   **[Docker](https://www.docker.com/)**: A platform for developing, shipping, and running applications in containers.

---

## 📝 API Endpoints

The backend API provides the following endpoints:

*   `GET /api/locations`: Get a list of all locations.
*   `GET /api/locations/:id`: Get a specific location by ID.
*   `POST /api/locations`: Create a new location.
*   `PUT /api/locations/:id`: Update a location.
*   `DELETE /api/locations/:id`: Delete a location.
