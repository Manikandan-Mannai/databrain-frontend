# Data Query and Visualization Platform - Frontend

A modern frontend built with React, TypeScript, Redux Toolkit, and Material UI for building and visualizing data queries through interactive dashboards.

## Overview

This frontend allows users to upload data, create queries, and visualize results as interactive charts or tables. It includes full authentication, role-based access, and dashboard management. The app connects to the backend API to manage data sources, charts, and dashboards securely.

## Features

- **Authentication:** Login, register, and logout with JWT.
- **Role-Based Access:** Admin, Editor, and Viewer support.
- **Data Source Upload:** Import CSV files to generate datasets.
- **Query Builder:** Filter, group, and aggregate data (SUM, AVG, COUNT, MIN, MAX).
- **Chart Builder:** Create charts (Bar, Line, Pie) from queries.
- **Dashboards:** Save, view, and organize charts into dashboards.
- **Access Control:** Private, Public, or Shared chart visibility.
- **User Management:** Admin can manage roles and users.
- **Theming:** Light/Dark mode with MUI theme support.
- **Optimized Performance:** Efficient rendering with Redux Toolkit and memoization.

## Tech Stack

- React  
- TypeScript  
- Redux Toolkit  
- Material UI  
- ApexCharts / Chart.js  
- React Router  
- Axios  

## Roles and Capabilities

| Role   | Capabilities                                          |
| ------ | ----------------------------------------------------- |
| Admin  | Full access to users, charts, data, and dashboards    |
| Editor | Create and manage own queries, charts, and dashboards |
| Viewer | View shared and public dashboards                     |

## Folder Structure

```

src/
├── assets/                # Static images, icons, and resources
├── components/
│   ├── auth/              # Auth-related UI components
│   ├── charts/            # Chart visualization components
│   └── layout/            # Layout components (MainLayout)
├── pages/
│   ├── auth/              # Login/Register pages
│   ├── ChartBuilder/      # Chart creation page
│   ├── dashboard/         # Dashboard listing and viewing
│   ├── DataSource/        # CSV data upload and management
│   ├── Profile/           # Profile and role management
│   └── QueryBuilder/      # Query creation and testing
├── redux/
│   ├── slices/            # Redux slices (auth, chart, dashboard)
│   ├── store.ts           # Redux store configuration
│   └── types.ts           # Shared TypeScript types
├── routes/
│   ├── AppRoutes.tsx      # Route configuration
│   └── PrivateRoute.tsx   # Protected route wrapper
├── services/
│   └── apiService.ts      # Axios service wrapper
├── theme/                 # MUI theme configuration
├── App.tsx
├── App.css
├── index.css
└── main.tsx

````

## Setup

### 1. Install dependencies
```bash
npm install
````

### 2. Run the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Build production-ready app |
| `npm run lint`  | Run code linter            |

## Application Screenshots

| Login                                       | Register                                    |
| ------------------------------------------- | ------------------------------------------- |
| <img src="./src/assets/1.png" width="400"/> | <img src="./src/assets/2.png" width="400"/> |

| Dashboard                                   | Data Source                                 |
| ------------------------------------------- | ------------------------------------------- |
| <img src="./src/assets/3.png" width="400"/> | <img src="./src/assets/4.png" width="400"/> |

| CSV Preview                               | Query Builder & Result                                |
| ------------------------------------------- | ------------------------------------------- |
| <img src="./src/assets/5.png" width="400"/> | <img src="./src/assets/6.png" width="400"/> |

| Chart Builder with preview                  | Line Chart                                  |
| ------------------------------------------- | ------------------------------------------- |
| <img src="./src/assets/7.png" width="400"/> | <img src="./src/assets/8.png" width="400"/> |

| Pie Chart View                              | Set Access Level & Publish Dashboard                                |
| ------------------------------------------- | -------------------------------------------- |
| <img src="./src/assets/9.png" width="400"/> | <img src="./src/assets/10.png" width="400"/> |

| Set Shared People                                      | Role Management                              |
| -------------------------------------------- | -------------------------------------------- |
| <img src="./src/assets/11.png" width="400"/> | <img src="./src/assets/12.png" width="400"/> |
