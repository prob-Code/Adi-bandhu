# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   ├── layout/          # Layout components (header, footer, sidebar)
│   └── shared/          # Shared components used across features
├── context/             # React context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── UiContext.jsx    # UI state (theme, modals, etc.)
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── claim-verification/  # Claim verification feature
│   │   ├── components/
│   │   │   └── VerificationMapView.jsx
│   │   └── index.jsx
│   ├── multi-role-dashboard/ # Dashboard components
│   │   ├── components/
│   │   │   └── RecentActivityFeed.jsx
│   │   └── index.jsx
│   └── ...              # Other feature pages
├── redux/               # Redux store configuration
│   ├── slices/          # Redux slices
│   ├── store.js         # Redux store
│   └── api.js           # API service configuration
├── services/            # API services
├── styles/              # Global styles
│   ├── tailwind.css     # Tailwind directives
│   └── index.css        # Custom styles
├── utils/               # Utility functions
├── App.jsx              # Root component
├── index.jsx            # Entry point
└── Routes.jsx           # Application routing

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

