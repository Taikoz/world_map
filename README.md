# 🌍 World Map

Welcome to **World Map**! This project is an interactive 3D globe created using **Babylon.js** for the 3D rendering, **Vite.js** for a fast development environment, and **NestJS** for the backend API. This README provides a comprehensive guide to understanding, setting up, and running the project.

---

## ✨ Features

*   **Interactive 3D Globe**: A fully interactive 3D model of the Earth.
*   **City Markers**: Pins on the globe to indicate major cities.
*   **Hurricane Tracking**: Real-time tracking of hurricanes and other natural disasters.
*   **GeoJSON Support**: The ability to draw and visualize GeoJSON data on the globe.
*   **REST API**: A backend API to provide data to the frontend application.

---

## 📂 Project Structure

The project is a monorepo with two main packages:

*   `app`: The frontend application, built with React, Vite, and Babylon.js.
*   `api`: The backend API, built with NestJS.

```
/home/aquennehen/repos/world_map/
├───.env
├───.gitignore
├───docker-compose.yml
├───README.md
├───api/
│   ├───api.Dockerfile
│   ├───package.json
│   └───src/
└───app/
    ├───app.Dockerfile
    ├───package.json
    └───src/
```

---

## 🚀 Getting Started

Follow these simple steps to set up and run the project on your local machine.

### 📋 Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/) (optional)
*   [Docker Compose](https://docs.docker.com/compose/) (optional)

### 🛠️ Installation

1.  **Clone** the repository:

    ```bash
    git clone [YOUR_REPO_URL]
    cd world-map
    ```

2.  **Install** the project dependencies:

    This project is a monorepo with two main parts: `app` and `api`. You will need to install the dependencies for both.

    ```bash
    # From the root directory
    cd app && yarn install
    cd ../api && yarn install
    ```

### ⚙️ Configuration

#### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
# .env

# API
API_PORT=3000

# APP
APP_PORT=5173
```

### 🏃 Running the Project

Once the dependencies are installed, you can run the development servers:

```bash
# For the frontend (app)
cd app && yarn run dev

# For the backend (api)
cd api && yarn run start:dev
```

The frontend application will be available at `http://localhost:5173/`, and the backend API will be available at `http://localhost:3000/`.

---

## 🐳 Docker

You can also run the project using Docker and Docker Compose.

### 🛠️ Build and Run

1.  **Build** the Docker images:

    ```bash
    docker-compose build
    ```

2.  **Run** the containers:

    ```bash
    docker-compose up
    ```

The application will be available at `http://localhost:5173/`.

---

## 📦 Technologies Used

### Frontend

*   **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
*   **[Babylon.js](https://www.babylonjs.com/)**: A powerful, real-time 3D rendering engine for the web.
*   **[Vite.js](https://vitejs.dev/)**: A fast build tool and development server.

### Backend

*   **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

### General

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

---

## 🚀 Deployment

This project is set up for deployment with Docker. You can use the provided `docker-compose.yml` file to deploy the application to any server with Docker and Docker Compose installed.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.