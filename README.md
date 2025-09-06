# 🐹 Symbiont - Virtual Pet Capybara Game

**Live Demo**: [https://capycare.onrender.com](https://capycare.onrender.com)

A comprehensive virtual pet capybara game with health tracking, AI assistance, and personalized wellness features. Take care of your digital capybara while improving your own health habits!

![Symbiont Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-purple)

## ✨ Features

### 🎮 Virtual Pet Care
- **Animated Capybara**: Multiple states (idle, walk, eat, celebrate, sick) with pixel-perfect sprite animations
- **Interactive Actions**: Feed, exercise, hydrate, and help your capybara sleep
- **XP System**: Gain experience points and level up through consistent care
- **Real-time Updates**: Live pet state changes using Socket.IO

### 🏥 Health & Wellness Tracking
- **Medicine Streak Tracker**: Track daily medication adherence with visual calendar
- **Health Metrics Dashboard**: Monitor hydration, nutrition, and activity levels
- **Personalized Goals**: Set and track custom health objectives

### 🤖 AI Health Assistant
- **Smart Chat Bot**: Get personalized health advice powered by Google Gemini AI
- **Context-Aware Responses**: AI understands your health profile and goals
- **Quick Questions**: Pre-built health queries for instant advice

### 📊 Nutrition & Fitness
- **Food Search**: Look up nutrition information using Nutritionix API
- **Calorie Tracking**: Monitor daily nutritional intake
- **Exercise Logging**: Track physical activities and workouts
- **Progress Visualization**: Beautiful charts and progress indicators

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent interface elements
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Delightful micro-interactions and transitions
- **Earth-tone Color Palette**: Calming, nature-inspired design

## 🚀 Live Application

**🌐 Frontend**: [https://capycare.onrender.com](https://capycare.onrender.com)  
**⚡ Backend API**: [https://symbiont.onrender.com](https://symbiont.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with glassmorphism effects
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **Google Gemini AI** - AI-powered health assistant
- **Nutritionix API** - Comprehensive food database

### Deployment
- **Render** - Cloud platform for modern applications
- **GitHub** - Version control and CI/CD

## 🎯 How to Play

1. **Visit the live app**: [https://capycare.onrender.com](https://capycare.onrender.com)
2. **Meet your capybara**: Watch your virtual pet in its natural habitat
3. **Care for your pet**: Use the action buttons to feed, exercise, hydrate, and rest
4. **Track your health**: Log your own meals, water intake, and medications
5. **Get AI advice**: Chat with the health assistant for personalized tips
6. **Build streaks**: Maintain consistent care for both you and your capybara
7. **Level up**: Gain XP points and unlock new features

## 🏗️ Local Development

### Prerequisites
- Node.js 18.0.0+
- npm 8.0.0+

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/cupnoodles7/symbiont.git
   cd symbiont
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

3. **Environment Variables**:
   Create `.env` files based on `env.example`:
   ```bash
   # Server environment variables
   PORT=4000
   APP_ID=your_nutritionix_app_id
   APP_KEY=your_nutritionix_app_key
   GEMINI_API_KEY=your_gemini_api_key
   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: Start backend
   cd server && npm start

   # Terminal 2: Start frontend
   cd client && npm run dev
   ```

5. **Open your browser**: Visit `http://localhost:5173`

## 🔑 API Keys

### Nutritionix API (Food Database)
1. Sign up at [developer.nutritionix.com](https://developer.nutritionix.com)
2. Create an application
3. Copy your APP_ID and APP_KEY

### Google Gemini API (AI Assistant)
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Copy your GEMINI_API_KEY

## 📱 Screenshots

*Your virtual capybara companion with beautiful glassmorphism UI, health tracking dashboard, and AI-powered assistance - all in one seamless experience!*

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Report bugs by opening an issue
- Suggest new features
- Share your capybara care strategies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Capybara Sprites**: Custom pixel art animations
- **Nutritionix**: Comprehensive food database API
- **Google Gemini**: Advanced AI capabilities
- **Render**: Reliable cloud hosting platform

---

**Made with ❤️ and lots of ☕ by [cupnoodles7](https://github.com/cupnoodles7)**

*Take care of your capybara, take care of yourself! 🐹💚*
