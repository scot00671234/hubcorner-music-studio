# Whitearmor AI - Autonomous Music Generation Platform

## Overview

This is a full-stack music generation application that creates Whitearmor-style ambient trap music autonomously. The system uses AI models to generate dreamy, ethereal compositions with heavy reverb and atmospheric effects, requiring minimal user input beyond clicking "generate."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom Whitearmor-themed color palette
- **State Management**: TanStack Query for server state and React hooks for local state

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **File Storage**: Local filesystem for generated audio files
- **Music Generation**: Placeholder services for MusicGen integration
- **Audio Processing**: Service layer for applying Whitearmor-style effects

### Development Setup
- **Monorepo Structure**: Shared TypeScript types and schemas
- **Hot Reloading**: Vite dev server with Express integration
- **Path Aliases**: Organized import paths with @ aliases
- **Type Safety**: Strict TypeScript configuration across all layers

## Key Components

### Music Generation System
- **MusicGenerator Service**: Handles AI model interactions and song creation
- **AudioProcessor Service**: Applies Whitearmor-style effects (reverb, delays, pitch shifting)
- **Song Structure Engine**: Creates predefined song arrangements (intro/verse/hook/bridge/outro)
- **Prompt System**: Randomized descriptive prompts for consistent aesthetic

### Data Layer
- **Track Schema**: Stores generated songs with metadata and file paths
- **User Schema**: Basic user management structure
- **Storage Interface**: Abstracted storage layer (currently in-memory, database-ready)

### Frontend Features
- **Generation Interface**: One-click song generation with real-time feedback
- **Audio Player**: Custom player with waveform visualization
- **Recent Tracks**: Library of previously generated compositions
- **Song Structure Visualizer**: Timeline showing composition segments

### UI/UX Design
- **Dark Theme**: Matches Whitearmor aesthetic with deep navy and coral accents
- **Ambient Animations**: Floating particles and subtle hover effects
- **Responsive Layout**: Mobile-optimized interface
- **Toast Notifications**: User feedback for generation status

## Data Flow

1. **Generation Request**: User clicks generate button
2. **Prompt Selection**: System randomly selects Whitearmor-style prompt
3. **AI Generation**: MusicGenerator service processes prompt (currently mocked)
4. **Audio Processing**: AudioProcessor applies signature effects
5. **File Storage**: Generated audio saved to local filesystem
6. **Database Storage**: Track metadata stored with file reference
7. **Client Update**: New track displayed in player and recent tracks list

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless connection
- **AI Models**: Designed for MusicGen integration (Meta's music generation model)
- **Audio Processing**: Web Audio API for client-side visualization
- **File Handling**: Node.js filesystem APIs for audio storage

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with Zod validation

### Development Tools
- **ESBuild**: Production bundling for server code
- **Drizzle Kit**: Database migrations and schema management
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Server Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations initialize PostgreSQL schema
4. **File Storage**: Upload directory created for generated audio files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **File Uploads**: Local filesystem storage in `uploads/` directory

### Scalability Considerations
- **Storage Interface**: Abstracted for easy migration to cloud storage
- **Database Ready**: Drizzle ORM configured for PostgreSQL scaling
- **Stateless Design**: Server can be horizontally scaled
- **CDN Ready**: Static assets can be served from CDN

The application is designed as a proof-of-concept for autonomous music generation, with placeholder services ready for integration with actual AI music generation models like MusicGen or similar technologies.