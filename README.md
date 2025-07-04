# DG Peaks Laptop Marketplace

A full-stack laptop marketplace application currently in development for a tourism company client. The project demonstrates modern web development practices with React and NestJS, featuring complex search functionality, role-based authentication, and a comprehensive admin system.

**Live Demo:** [dgpeaks.netlify.app](https://dgpeaks.netlify.app/)  
**Backend Repository:** [github.com/ajikia15/klaptBack](https://github.com/ajikia15/klaptBack)

## Technical Architecture

This React frontend showcases several advanced patterns and architectural decisions:

### Advanced Search & Filtering System

The application implements a sophisticated search interface with real-time filtering capabilities:

- **Type-safe URL-based filters** using TanStack Router's search parameter validation
- **Dynamic filter options** that update based on current selections to prevent dead-end searches
- **Optimized query management** with React Query for efficient data fetching and caching
- **20+ filterable attributes** including technical specs (GPU, CPU, RAM, storage), price ranges, and custom tags

The search system demonstrates complex state synchronization between URL parameters, React state, and backend APIs, with debounced inputs and pagination.

### Authentication & Authorization

Built with JWT-based authentication featuring:

- **Role-based access control** with admin/user permissions
- **Protected route components** with automatic redirects
- **Google OAuth integration** for streamlined user onboarding
- **Context-based auth state** management across the application

### Content Management System

Comprehensive admin dashboard including:

- **Content moderation workflows** for approving/rejecting user submissions
- **User management system** with role promotion and account controls
- **Batch operations** for efficient content administration

### Frontend Engineering Highlights

- **TanStack Router** implementation with type-safe routing and search parameters
- **Custom React hooks** for search, authentication, and data management
- **Optimistic UI updates** for improved perceived performance
- **Responsive design** with mobile-first approach using Tailwind CSS
- **Component composition** with Radix UI primitives and custom implementations

## Tech Stack

**Frontend:**

- React 19 + TypeScript
- TanStack Router & Query
- Tailwind CSS + Radix UI
- Vite build system
- i18next for internationalization

**Backend:**

- NestJS + TypeScript
- JWT authentication with Passport
- TypeORM with SQLite
- Class-validator for request validation
- Google OAuth integration

## Project Context

This is a freelance project being developed for a Georgian tourism company. The application will serve as their laptop marketplace platform, handling inventory management, user transactions, and content moderation at scale.

The current implementation focuses on building a robust foundation with clean architecture patterns that can accommodate future feature expansion and increased user load.
