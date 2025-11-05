# RER - frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3-green.svg)](https://vuejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8.svg)](https://tailwindcss.com/) [![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/) [![Docker](https://img.shields.io/badge/Docker-24+-blue.svg)](https://www.docker.com/)

## 📑 Table of Contents

- [RER - frontend](#rer---frontend)
  - [📑 Table of Contents](#-table-of-contents)
  - [About the Module](#about-the-module)
  - [Prerequisites](#prerequisites)
  - [Installation and Execution](#installation-and-execution)
    - [Integrated Execution](#integrated-execution)
    - [Local Development](#local-development)
      - [Private Repository Access Configuration](#private-repository-access-configuration)
      - [Install Dependencies](#install-dependencies)
      - [Development with Hot-Reload](#development-with-hot-reload)
      - [Production Build](#production-build)
    - [Docker Execution](#docker-execution)
  - [Service Access](#service-access)
  - [Features](#features)
    - [Main Interface](#main-interface)
    - [Configuration Generation](#configuration-generation)
    - [Technologies](#technologies)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Map Integration](#map-integration)
  - [Container Management](#container-management)
    - [Check Status](#check-status)
    - [Stop Services](#stop-services)
    - [Logs](#logs)
  - [License](#license)
  - [Contribution](#contribution)
  - [Support](#support)

---

## About the Module

**frontend** is the modern web interface of RER, developed in Vue.js 3 with Vite. It offers a responsive and intuitive user experience for registering and viewing rural environmental data, seamlessly integrating with the map component and backend services.

**Main features:**

- 🌐 Modern web interface with Vue.js 3
- ⚡ Optimized build with Vite
- 🗺️ Integration with interactive map component
- 🔄 Complete integration with backend APIs
- 🎨 Customizable and accessible interface
- 🔧 Automatic configuration generation

---

## Prerequisites

- **Docker** version 24+ ([installation](https://docs.docker.com/engine/install/))
- **Docker Compose** version 2.20+ ([installation](https://docs.docker.com/compose/install/linux/#install-using-the-repository))
- **Node.js** version 18+ (for local development)
- **Git** ([installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))

---

## Installation and Execution

### Integrated Execution

This module runs automatically as part of the main RER system. To run the complete system:

1. **In the main project directory:**
   ```bash
   ./start.sh
   ```

### Local Development

#### Private Repository Access Configuration

This project has a private dependency (`dpg-mapa`) hosted in a Git repository. For the `npm install` command to work, you need to configure your local Git to authenticate to this repository.

Run the following command once on your machine, replacing `<YOUR_USER>` and `<YOUR_TOKEN>` with your access credentials:

```bash
git config --global url."https://<YOUR_USER>:<YOUR_TOKEN>@inovacao.dataprev.gov.br".insteadOf "https://inovacao.dataprev.gov.br"
```

After running this command, Git will automatically use your credentials when fetching dependencies from `inovacao.dataprev.gov.br`.

#### Install Dependencies

```bash
npm install
```

#### Development with Hot-Reload

```bash
npm run dev
```

#### Production Build

```bash
npm run build
```

### Docker Execution

```bash
docker-compose up -d
```

The service will be available on port 5000.

---

## Service Access

After execution, the frontend will be available at:

- **Main Frontend:** http://localhost/<BASE_URL>

> The `<BASE_URL>` variable is defined in the environment configurations.

---

## Features

### Main Interface

- **Property Registration:** Complete interface for rural property registration
- **Map Visualization:** Integration with interactive map component
- **Data Management:** CRUD for system entities
- **Authentication:** Integration with Keycloak authentication system

### Configuration Generation

The system has a script that automatically collects configurations during build:

```bash
./scripts/generate-config.sh
```

This script consolidates information from:
- `.env` files
- `package.json`
- Map configurations
- Other relevant configurations

### Technologies

- Vue.js 3 (Composition API)
- Vite (Build tool)
- TypeScript
- Tailwind CSS
- Vue Router
- Axios (HTTP client)

---

## Project Structure

```
frontend/
├── public/
│   ├── images/                 # Static images
│   └── favicon.ico
├── scripts/
│   └── generate-config.sh      # Configuration generation script
├── src/
│   ├── adapters/               # Data adapters
│   ├── assets/                 # Static assets
│   ├── components/             # Reusable Vue components
│   ├── config/                 # Configuration files
│   ├── context/                # Application contexts
│   ├── interfaces/             # TypeScript interfaces
│   ├── lib/                    # Helper libraries
│   ├── router/                 # Route configuration
│   ├── services/               # API services
│   ├── states/                 # Global states
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilities
│   ├── views/                  # Pages/Views
│   ├── App.vue                 # Root component
│   └── main.ts                 # Entry point
├── tests/
│   └── unit/                   # Unit tests
├── .env                        # Environment variables
├── .env.development            # Development variables
├── components.json             # Component configuration
├── docker-compose.yaml         # Docker orchestration
├── Dockerfile                  # Docker image
├── nginx.conf                  # Nginx configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# Unit tests
npm run test

# Linting
npm run lint

# Code formatting
npm run format
```

---

## Configuration

### Environment Variables

Main configurable variables in `.env` file:

- `VITE_BASE_URL` - Frontend Context-Path
- `VITE_DPG_URL` - Backend URL

### Map Integration

The frontend integrates with the `Map-Component` for map functionalities:

```vue
<template>
  <MapaDpg
    :layers="layers"
    :options="options"
    @onDrawing="handleDrawing"
  />
</template>
```

---

## Container Management

### Check Status

```bash
docker-compose ps
```

### Stop Services

```bash
docker-compose down
```

### Logs

```bash
docker-compose logs -f
```

---

## License

This project is distributed under the [GPL-3.0](https://github.com/Rural-Environmental-Registry/core/blob/main/LICENSE).

---

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

By submitting a pull request or patch, you affirm that you are the author of the code and that you agree to license your contribution under the terms of the GNU General Public License v3.0 (or later) for this project. You also agree to assign the copyright of your contribution to the Ministry of Management and Innovation in Public Services (MGI), the owner of this project.

---

## Support

For technical support or project-related questions:

- **Documentation:** Check the individual READMEs for each submodule
- **Issues:** Report problems via the GitHub issue tracker
 
---

Copyright (C) 2024-2025 Ministry of Management and Innovation in Public Services (MGI), Government of Brazil.

This program was developed by Dataprev as part of a contract with the Ministry of Management and Innovation in Public Services (MGI).
