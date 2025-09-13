# Elysian - Zimbabwe's Premier Dating Platform

## Overview

Elysian is a premium dating platform designed to connect hearts across Zimbabwe's beautiful landscape. The application celebrates Zimbabwean culture while facilitating meaningful connections from Harare to Bulawayo, Victoria Falls to Mutare, and everywhere in between. Built with a focus on sophisticated user experience and cultural authenticity, Elysian provides features for profile discovery, matching, messaging, search functionality, and premium subscriptions at $2.50/month for enhanced features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system following Apple HIG principles
- **State Management**: TanStack Query for server state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom light/dark mode implementation with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with `/api` prefix
- **Development**: Hot reload with Vite middleware integration

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless platform
- **Schema Management**: Drizzle Kit for migrations and schema definitions
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Current Schema**: Basic user authentication with username/password fields

### Design System
- **Color Palette**: Warm rose-pink primary (#345 85% 65%) with coral accents, supporting neutral backgrounds
- **Typography**: SF Pro Display/Text system fonts with Playfair Display for romantic headlines
- **Component Philosophy**: Glass morphism effects, subtle shadows, and elevated interactions following "hover-elevate" patterns
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations

### Key Features Architecture
- **Profile Discovery**: Card-based swiping interface with like/pass functionality
- **Messaging System**: Real-time chat interface with message history and online status
- **Search & Filtering**: Advanced filters by age range, distance, interests, and cultural preferences
- **User Profiles**: Multi-photo support with interest tags and cultural background information

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless platform
- **Build System**: Vite for frontend development and production builds
- **Package Management**: npm with lockfile-based dependency resolution

### UI/UX Libraries
- **Component Library**: Radix UI primitives for accessibility-first components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Playfair Display) for romantic accent typography

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Development Environment**: Replit-specific tooling for cloud development

### Utilities
- **Form Handling**: React Hook Form with Zod validation schemas
- **Date Management**: date-fns for timestamp formatting and calculations
- **State Management**: TanStack Query for server state caching and synchronization
- **Class Management**: clsx and tailwind-merge for conditional styling