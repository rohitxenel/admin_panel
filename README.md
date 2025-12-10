# G&R Custom Elevator Cabs - Admin Control Hub

![Next.js](https://img.shields.io/badge/-Next.js-blue

 ![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=CSS-38B2AC?logo=tailwind-

   

## 📝 Description

A modern, enterprise-grade admin dashboard built with **Next.js 15** and **React 19** for managing elevator cab projects end-to-end. This application streamlines the management of materials, designs, and configurations for custom elevator cabins with a focus on performance, security, and user experience.

Perfect for teams that need centralized control over elevator cab customization workflows—from material selections to design approvals. Built with modern web technologies and best practices in mind.



### 🛠️ Product Management
- **Ceiling Management** — Upload, organize, and manage ceiling design images
- **Finishes Management** — Handle multiple finish categories (plastic, marble, steel) with image galleries
- **Handrail Management** — Manage handrail designs with main and thumbnail images
- **Size Management** — Configure and maintain cab dimensions (weight, height, width, depth specifications)

### 🎨 User Interface
- **Responsive Sidebar** — Collapsible navigation with active state highlighting and smooth transitions
- **Animated Transitions** — Smooth, professional animations powered by Framer Motion
- **Dashboard Overview** — Real-time statistics and management metrics
- **Mobile-First Design** — Fully responsive layout that works on all devices

### ⚡ Performance & Developer Experience
- Fast page loads with Next.js 15 App Router
- Optimized state management with Zustand
- Type-safe development with modern JavaScript patterns
- Modular component architecture for easy maintenance and scaling

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.1 | React framework with App Router & SSR |
| **React** | 19.0.0 | UI library with hooks & context |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Zustand** | Latest | Lightweight state management library |
| **Framer Motion** | 12.23.24 | Smooth animations & transitions |
| **React Icons** | 5.5.0 | Icon library (Feather & more) |
| **Chart.js** | 4.5.0 | Data visualization |
| **Next/Image** | Built-in | Optimized image rendering |



## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Run the Application

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```


## 📁 Project Structure

```
elevator-admin-panel/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── page.js                   # Login page
│   │   ├── layout.js                 # Root layout
│   │   ├── dashboard/
│   │   │   ├── layout.js
│   │   │   └── page.js               # Dashboard home
│   │   ├── orders/
│   │   │   ├── layout.js
│   │   │   └── page.js               # Management pages
│   │   └── help-support/
│   │       └── page.js
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.js          # Main layout wrapper
│   │       ├── Sidebar.js            # Navigation sidebar
│   │       └── ProtectedRoute.js     # Auth guard
│   │
│   ├── context/
│   │   └── AuthContext.js            # Auth state & logic
│   │
│   ├── lib/
│   │   ├── apiClient.js              # Authorized fetch wrapper
│   │   ├── apiConfig.js              # API configuration
│   │   └── getTokenFromCookies.js    # Cookie utilities
│   │
│   ├── services/
│   │   └── admincontrol.js           # API service functions
│   │
│   ├── store/
│   │   └── userStore.js              # Zustand store
│   │
│   └── styles/
│       └── globals.css               # Global styles
│
├── middleware.js                      # Next.js middleware
├── next.config.mjs                    # Next.js configuration
├── tailwind.config.js                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
├── jsconfig.json                      # JS config paths
├── .env.local                         # Environment variables
└── package.json                       # Dependencies & scripts
```

## 🔐 Authentication Flow

```
1. User Login
   ↓
2. API validates credentials
   ↓
3. Server returns JWT token
   ↓
4. Token stored in: 
   - HTTP-only Cookie (auth-token)
   - localStorage (auth-user)
   ↓
5. AuthContext validates both on mount
   ↓
6. Protected Routes check auth status
   ↓
7. Unauth users redirected to /
```


## 📊 Performance Optimizations

- ✅ Next.js Image optimization for faster loading
- ✅ Code splitting with dynamic imports
- ✅ Efficient state management with Zustand
- ✅ CSS Modules and Tailwind for minimal bundle size




