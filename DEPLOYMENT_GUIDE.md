# 🚀 Symbiont Deployment Guide for Render

This guide will help you deploy your Symbiont app (React frontend + Node.js backend) on Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **API Keys**: Get your API keys ready:
   - Nutritionix API (APP_ID, APP_KEY)
   - Google Gemini API Key
   - Firebase configuration (if using)

## 🛠️ Deployment Options

### Option 1: Blueprint Deployment (Recommended)

1. **Push the `render.yaml` file** to your GitHub repository
2. **Go to Render Dashboard** → "New" → "Blueprint"
3. **Connect your GitHub repository**
4. **Render will automatically create both services** based on the `render.yaml` configuration

### Option 2: Manual Service Creation

#### Deploy Backend First:

1. **Create Web Service**:
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `symbiont-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Health Check Path**: `/health`

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4000
   APP_ID=your_nutritionix_app_id
   APP_KEY=your_nutritionix_app_key
   GEMINI_API_KEY=your_gemini_api_key
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

#### Deploy Frontend:

1. **Create Web Service**:
   - **Name**: `symbiont-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Start Command**: `cd client && npm run preview -- --host 0.0.0.0 --port $PORT`

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

## 🔧 Configuration Steps

### 1. Update CORS Settings

After deploying, update your backend's `ALLOWED_ORIGINS` environment variable:
```
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:5173
```

### 2. Update Frontend API URL

Set the `VITE_API_URL` environment variable in your frontend service:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3. Firebase Configuration (if using)

Add Firebase environment variables to your frontend:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🔑 Getting API Keys

### Nutritionix API:
1. Sign up at [developer.nutritionix.com](https://developer.nutritionix.com)
2. Create an application
3. Get your APP_ID and APP_KEY

### Google Gemini API:
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Use it as GEMINI_API_KEY

## 🚨 Important Notes

### Free Tier Limitations:
- **Render Free Tier**: Services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep takes ~30 seconds
- **Build time**: Limited to 20 minutes

### Production Considerations:
- **Upgrade to paid plan** for production use
- **Use persistent storage** if you need file uploads
- **Set up monitoring** for uptime tracking

## 🔄 Deployment Process

1. **Push your code** to GitHub
2. **Create Render services** using Blueprint or manually
3. **Set environment variables** in Render dashboard
4. **Wait for builds** to complete (5-10 minutes)
5. **Test your deployment** using the provided URLs
6. **Update CORS settings** with actual URLs

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **CORS Errors**:
   - Update ALLOWED_ORIGINS with actual frontend URL
   - Ensure both HTTP and HTTPS are allowed if needed

3. **API Key Issues**:
   - Double-check environment variable names
   - Ensure API keys are valid and have proper permissions

4. **Cold Start Issues**:
   - Consider upgrading to paid plan
   - Implement health check endpoints

### Debug Commands:
```bash
# Check environment variables
console.log(process.env.NODE_ENV);
console.log(process.env.VITE_API_URL);

# Test API endpoints
curl https://your-backend-url.onrender.com/health
```

## 📱 Post-Deployment

1. **Test all features**:
   - AI chat functionality
   - Nutrition tracking
   - Medicine streak tracking
   - User authentication (if implemented)

2. **Monitor performance**:
   - Check response times
   - Monitor error rates
   - Set up alerts

3. **Update documentation**:
   - Update README with live URLs
   - Document any production-specific configurations

## 🎉 Success!

Your Symbiont app should now be live! 

- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

Share your live app and enjoy your deployed virtual pet capybara! 🐹

---

## 📞 Support

If you run into issues:
1. Check Render's documentation
2. Review build logs in the dashboard
3. Test API endpoints individually
4. Verify environment variables are set correctly

Happy deploying! 🚀
