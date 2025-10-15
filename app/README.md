# Frontend Application

This is the frontend application for the World Map project. It is built with React, Vite, and Babylon.js.

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Node.js](https://nodejs.org/en/) (v18 or higher) and [Yarn](https://yarnpkg.com/) installed.

### 🛠️ Installation

1.  **Navigate** to the `app` directory:

    ```bash
    cd app
    ```

2.  **Install** the dependencies:

    ```bash
    yarn install
    ```

### ⚙️ Configuration

Create a `.env` file in this directory and add the following environment variables:

```
# .env

APP_PORT=5173
```

### 🏃 Running the App

Once the dependencies are installed, you can run the app in development mode:

```bash
yarn run dev
```

The app will be available at `http://localhost:5173/`.

### 🐳 Docker

You can also run the app using Docker.

1.  **Build** the Docker image from the root directory:

    ```bash
    docker build -t world-map-app -f app/app.Dockerfile .
    ```

2.  **Run** the container:

    ```bash
    docker run -p 5173:5173 world-map-app
    ```

---

## 📦 Technologies Used

*   **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
*   **[Babylon.js](https://www.babylonjs.com/)**: A powerful, real-time 3D rendering engine for the web.
*   **[Vite.js](https://vitejs.dev/)**: A fast build tool and development server.
*   **[Yarn](https://yarnpkg.com/)**: A fast, reliable, and secure package manager.
*   **[Docker](https://www.docker.com/)**: A platform for developing, shipping, and running applications in containers.
