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
├── components/                  # Reusable UI components
│   ├── ui/                      # Base UI elements
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── layout/                  # App-level layout wrappers
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   └── shared/                  # Cross-feature shared components
│       ├── LoadingSpinner.jsx
│       └── ErrorBoundary.jsx
│
├── context/                     # React context providers
│   ├── AuthContext.jsx          # Auth state (user, token, login/logout)
│   └── UiContext.jsx            # UI state (theme, modals, toasts)
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.js               # Consume AuthContext
│   ├── useDebounce.js
│   └── useFetch.js
│
├── pages/                       # Feature-based page components
│   ├── auth/                    # Authentication flow
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   │
│   ├── claim-verification/      # Claim verification feature
│   │   ├── components/
│   │   │   └── VerificationMapView.jsx
│   │   └── index.jsx            # Feature entry point
│   │
│   ├── multi-role-dashboard/    # Dashboard feature
│   │   ├── components/
│   │   │   └── RecentActivityFeed.jsx
│   │   └── index.jsx            # Feature entry point
│   │
│   └── ...                      # Other feature pages (same pattern)
│
├── redux/                       # Global state management
│   ├── slices/                  # Redux Toolkit slices
│   │   ├── authSlice.js
│   │   └── uiSlice.js
│   ├── store.js                 # Redux store configuration
│   └── api.js                   # RTK Query / Axios API service
│
├── services/                    # External API call functions
│   ├── authService.js
│   └── claimService.js
│
├── styles/                      # Global styles
│   ├── tailwind.css             # Tailwind base directives
│   └── index.css                # Custom global CSS overrides
│
├── utils/                       # Pure utility/helper functions
│   ├── formatDate.js
│   ├── validators.js
│   └── constants.js
│
├── App.jsx                      # Root component, context providers
├── index.jsx                    # React DOM entry point
└── Routes.jsx                   # App-level route definitions
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

when we go through the app 
<img width="2868" height="1435" alt="image" src="https://github.com/user-attachments/assets/beea64a7-fc99-4607-a135-a561e8117021" />
<img width="2861" height="1382" alt="image" src="https://github.com/user-attachments/assets/ec02210c-569a-4f98-a907-2ea3c6da7d05" />
<img width="2867" height="1631" alt="image" src="https://github.com/user-attachments/assets/8d755ac8-ec04-488c-b7c1-1ccd5e4186b4" />
<img width="2879" height="1630" alt="image" src="https://github.com/user-attachments/assets/02c463ca-209f-4f42-9746-ddb76d502cc1" />
<img width="2878" height="1635" alt="image" src="https://github.com/user-attachments/assets/e47daab9-ca5f-4944-be86-0299361f155d" />




