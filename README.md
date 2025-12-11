<div align="center">

# 🎯 AI Mock Interview Platform

![AI Mock Interview Platform](https://img.shields.io/badge/AI-Mock%20Interview-blue?style=for-the-badge&logo=ai&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

[![GitHub stars](https://img.shields.io/github/stars/Adarshkumar24/ai-mock-interview-platform?style=social)](https://github.com/Adarshkumar24/ai-mock-interview-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Adarshkumar24/ai-mock-interview-platform?style=social)](https://github.com/Adarshkumar24/ai-mock-interview-platform/network)
[![GitHub issues](https://img.shields.io/github/issues/Adarshkumar24/ai-mock-interview-platform)](https://github.com/Adarshkumar24/ai-mock-interview-platform/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**An AI-powered mock interview platform that helps job seekers practice and improve their interview skills with real-time feedback and comprehensive analytics.**

**🌐 Live Demo: https://ai-mock-interview-platform-snowy-one.vercel.app**

[🚀 Live Demo](https://ai-mock-interview-platform-snowy-one.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/Adarshkumar24/ai-mock-interview-platform/issues) • [✨ Request Feature](https://github.com/Adarshkumar24/ai-mock-interview-platform/issues)

</div>

---

## 📸 Screenshots

### 🏠 Homepage
![Homepage](https://raw.githubusercontent.com/Adarshkumar24/ai-mock-interview-platform/main/screenshots/homepage.png)
*Modern landing page with feature highlights and comprehensive service overview*

### 🎤 Interview Mode Selection
![Interview Mode](https://raw.githubusercontent.com/Adarshkumar24/ai-mock-interview-platform/main/screenshots/interviewmode.png)
*Choose between AI Voice Interview and Traditional Video Interview modes*

### 💬 Interactive Interview Interface
![Interview Interface](https://raw.githubusercontent.com/Adarshkumar24/ai-mock-interview-platform/main/screenshots/interview.png)
*Real-time AI conversation with voice recognition and intelligent responses*

### 📈 Comprehensive Feedback & Analytics
![Feedback](https://raw.githubusercontent.com/Adarshkumar24/ai-mock-interview-platform/main/screenshots/feedback.png)
*Detailed performance analysis with ratings, suggestions, and improvement areas*

---

## ✨ Features

### 🤖 **AI-Powered Interviews**
- **Smart Question Generation**: AI creates personalized interview questions based on job role, experience level, and tech stack
- **Real-time Speech Recognition**: Advanced speech-to-text conversion for natural conversation flow
- **Intelligent Feedback**: Comprehensive analysis of answers with improvement suggestions

### 🎥 **Voice & Recording Features**
- **🎤 Voice Interviews**: Real-time voice conversation mode using Web Speech API
- **🗣️ Speech Recognition**: Advanced speech-to-text conversion for natural conversation flow
- **🔊 Text-to-Speech**: AI speaks questions aloud for immersive interview experience
- **📹 Video Recording**: Optional webcam recording for self-review (never stored on servers)
- **🎵 Audio Analysis**: Voice pattern analysis and speech quality assessment
- **🎬 Demo Videos**: Built-in demo functionality to showcase platform capabilities

### 📊 **Analytics & Progress Tracking**
- **Performance Metrics**: Detailed scoring system with ratings out of 10
- **Progress History**: Track improvement over multiple interview sessions
- **Comparative Analysis**: Compare answers with ideal responses

### 🔐 **Authentication & Security**
- **Secure Login**: Powered by Clerk authentication
- **Privacy First**: No video data stored, complete user privacy protection
- **Multi-device Support**: Seamless experience across desktop and mobile

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Theme**: User preference-based theme switching
- **Accessible**: WCAG compliant design for inclusive user experience
- **PWA Ready**: Progressive Web App capabilities for mobile installation

---

## 🛠️ Tech Stack

### **Frontend**
- ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react) **React 18.3.1** with TypeScript
- ![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite) **Vite 6.0.5** for lightning-fast development
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-007ACC?logo=typescript) **TypeScript 5.6.2** for type safety
- ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss) **Tailwind CSS** with shadcn/ui components

### **Backend & Services**
- ![Firebase](https://img.shields.io/badge/Firebase-11.2.0-FFCA28?logo=firebase) **Firebase** for real-time database and storage
- ![Clerk](https://img.shields.io/badge/Clerk-5.22.6-6C47FF?logo=clerk) **Clerk** for authentication
- ![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google) **Google Gemini AI** for question generation
- ![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Voice-FF6B6B?logo=html5) **Web Speech API** for voice recognition & synthesis

### **Development Tools**
- ![ESLint](https://img.shields.io/badge/ESLint-9.17.0-4B32C3?logo=eslint) **ESLint** for code quality
- ![React Router](https://img.shields.io/badge/React%20Router-7.1.3-CA4245?logo=reactrouter) **React Router DOM** for navigation
- ![Zod](https://img.shields.io/badge/Zod-3.24.1-3E67B1?logo=zod) **Zod** for schema validation

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm/pnpm
- Firebase project setup
- Clerk authentication setup
- Google Gemini AI API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adarshkumar24/ai-mock-interview-platform.git
   cd ai-mock-interview-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   ### **🔧 Detailed Environment Configuration**
   
   #### **Firebase Setup**
   1. Go to [Firebase Console](https://console.firebase.google.com)
   2. Create a new project or select existing one
   3. Go to Project Settings → Your apps → Add app (Web)
   4. Copy the configuration values:
   
   #### **Clerk Authentication Setup**  
   1. Sign up at [Clerk](https://clerk.com)
   2. Create a new application
   3. Go to Dashboard → API Keys
   4. Copy the Publishable Key
   
   #### **Google Gemini AI Setup**
   1. Visit [Google AI Studio](https://aistudio.google.com)
   2. Click "Get API Key" 
   3. Create a new API key for your project
   
   Fill in your `.env.local` file:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

   # Google Gemini AI
   VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```
   
   ### **🚀 Vercel Deployment Environment Variables**
   For the deployed version to work properly, add these same environment variables to your Vercel project:
   1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
   2. Select your project → Settings → Environment Variables
   3. Add each variable with the same names and your actual values
   4. Redeploy the project for changes to take effect

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
ai-mock-interview-platform/
├── 📂 public/                    # Static assets
│   ├── 🖼️  assets/img/          # Images and logos
│   ├── 🎬 assets/videos/        # Demo videos
│   └── 📱 manifest.json         # PWA manifest
├── 📂 src/
│   ├── 🧩 components/           # Reusable UI components
│   │   ├── 🎨 ui/              # shadcn/ui components
│   │   └── 📱 *.tsx            # Custom components
│   ├── 📄 routes/              # Page components
│   ├── 🏗️  layouts/            # Layout components
│   ├── 🛠️  lib/                # Utility functions
│   ├── ⚙️  config/             # Configuration files
│   └── 📝 types/               # TypeScript definitions
├── 📸 screenshots/             # App screenshots
├── 📋 .github/                 # GitHub templates & workflows
└── 📖 docs/                    # Documentation files
```

---

## 🎯 Core Functionality

### **Interview Flow**
1. 🎯 **Setup**: User selects job role, experience level, and tech stack
2. 📝 **Mode Selection**: Choose between Traditional (text-based) or Voice Interview modes
3. 🤖 **Generation**: AI creates personalized interview questions
4. � **Voice Interview**: AI speaks questions, user responds via voice (Web Speech API)
5. 📹 **Recording**: User answers questions with optional video recording
6. 📊 **Analysis**: AI analyzes responses and provides detailed feedback
7. 📈 **Review**: Comprehensive feedback with ratings and suggestions

### **Question Categories**
- 💻 **Technical Skills**: Programming, frameworks, tools
- 🤝 **Behavioral**: Leadership, teamwork, problem-solving
- 🎬 **Situational**: Scenario-based questions
- 🎯 **Role-specific**: Tailored to job requirements

---

## 🚀 Deployment

### **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Adarshkumar24/ai-mock-interview-platform)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### **Other Platforms**
- **Netlify**: Works out of the box
- **Firebase Hosting**: Compatible with Firebase integration
- **AWS Amplify**: Supports React/Vite applications

See [📖 VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

[![Contributors](https://contrib.rocks/image?repo=Adarshkumar24/ai-mock-interview-platform)](https://github.com/Adarshkumar24/ai-mock-interview-platform/graphs/contributors)

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Adarshkumar24/ai-mock-interview-platform)
![GitHub code size](https://img.shields.io/github/languages/code-size/Adarshkumar24/ai-mock-interview-platform)
![GitHub language count](https://img.shields.io/github/languages/count/Adarshkumar24/ai-mock-interview-platform)
![GitHub top language](https://img.shields.io/github/languages/top/Adarshkumar24/ai-mock-interview-platform)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Google Gemini AI](https://ai.google.dev/)** - For AI-powered question generation
- **[Clerk](https://clerk.com/)** - For seamless authentication
- **[Firebase](https://firebase.google.com/)** - For backend services
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful UI components
- **[Lucide](https://lucide.dev/)** - For comprehensive icon library

---

## 📞 Support

- 📖 **Documentation**: [Wiki](https://github.com/Adarshkumar24/ai-mock-interview-platform/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Adarshkumar24/ai-mock-interview-platform/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Adarshkumar24/ai-mock-interview-platform/discussions)

---

<div align="center">

**Built with ❤️ by [Amritnayak](https://github.com/ProfAmrit)**

⭐ Star this repository if it helped you!

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Adarshkumar24.ai-mock-interview-platform)

<!-- Repository updated: 2025-08-21 -->

</div>
