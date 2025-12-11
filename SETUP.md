# AI Mock Interview - Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Firebase account
- Google Cloud account (for Gemini AI)
- Clerk account (for authentication)

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

#### Firebase Setup
1. ✅ Go to [Firebase Console](https://console.firebase.google.com/) - You're already here!
2. ✅ Create a new project - Complete the project creation wizard
3. **Enable Firestore Database:**
   - In your Firebase project dashboard, click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location closest to you
4. **Add a Web App:**
   - Click the gear icon (⚙️) → "Project settings"
   - Scroll down to "Your apps" section
   - Click the "</>" (web) icon to add a web app
   - Give it a name (e.g., "AI Mock Interview")
   - Copy the configuration object
5. **Fill in the Firebase variables in `.env.local`** with the config values

#### Google Gemini AI Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to `VITE_GOOGLE_GEMINI_API_KEY` in `.env.local`

#### Clerk Authentication Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your publishable key
4. Add it to `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`

### 3. Run the Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:5173/`

### 4. Build for Production
```bash
pnpm build
```

### 5. Preview Production Build
```bash
pnpm preview
```

## Features
- **AI-Powered Mock Interviews**: Uses Google Gemini AI to generate interview questions
- **Real-time Recording**: Record and analyze interview responses
- **Authentication**: Secure user authentication with Clerk
- **Firebase Integration**: Store interview data and user progress
- **Responsive Design**: Built with Tailwind CSS and Radix UI components
- **Speech-to-Text**: Convert spoken answers to text
- **Video Recording**: Record video responses during interviews

## Project Structure
- `src/components/` - Reusable UI components
- `src/routes/` - Application pages and routing
- `src/config/` - Configuration files (Firebase, etc.)
- `src/handlers/` - Authentication and API handlers
- `src/layouts/` - Layout components
- `src/lib/` - Utility functions and helpers
- `src/types/` - TypeScript type definitions

## Technologies Used
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **AI**: Google Gemini AI
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **State Management**: React Context/Hooks

## Troubleshooting
1. **Build Errors**: Make sure all environment variables are set correctly
2. **Firebase Errors**: Verify Firebase configuration and ensure Firestore is enabled
3. **Authentication Issues**: Check Clerk setup and publishable key
4. **AI API Errors**: Verify Google Gemini AI API key and quota

## Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build
