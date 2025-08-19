# 🚀 Production Deployment Guide

This guide covers deploying your AI Audio Transcription extension to production with separate frontend and backend services.

## 📋 **Prerequisites**

- Node.js 18+ installed
- Docker and Docker Compose (optional)
- Domain names for frontend and backend
- SSL certificates
- Deepgram API key
- Cloud hosting provider (AWS, Google Cloud, Vercel, etc.)

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   Frontend      │    │   Backend       │
│   Extension     │◄──►│   (Static)      │◄──►│   (Node.js)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 **Frontend Deployment**

### **Option 1: Static Hosting (Recommended)**

1. **Build the extension:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to static hosting:**
   - **Vercel**: `vercel --prod`
   - **Netlify**: `netlify deploy --prod`
   - **AWS S3**: Upload `dist/` folder
   - **GitHub Pages**: Push to `gh-pages` branch

3. **Configure environment:**
   ```bash
   # Create .env file
   VITE_WEBSOCKET_URL=wss://your-api-domain.com
   VITE_API_URL=https://your-api-domain.com
   ```

### **Option 2: Docker Deployment**

```bash
# Build and run frontend container
docker build -t transcription-frontend ./client
docker run -d -p 3000:80 transcription-frontend
```

## 🔧 **Backend Deployment**

### **Option 1: Cloud Platform**

1. **Google Cloud Run:**
   ```bash
   cd server
   gcloud run deploy transcription-server \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **AWS Lambda/ECS:**
   ```bash
   # Use AWS CLI or AWS Console
   aws ecs create-service --cluster your-cluster --service-name transcription-service
   ```

3. **Heroku:**
   ```bash
   cd server
   heroku create your-transcription-app
   git push heroku main
   ```

### **Option 2: VPS/Server**

1. **SSH to your server:**
   ```bash
   ssh user@your-server.com
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/AI-Audio-Transcription.git
   cd AI-Audio-Transcription/server
   npm install
   npm run build
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "transcription-server"
   pm2 startup
   pm2 save
   ```

## 🔒 **SSL/HTTPS Setup**

### **Using Let's Encrypt (Free):**

```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-api-domain.com

# Configure nginx with SSL
sudo nano /etc/nginx/sites-available/transcription
```

### **Nginx SSL Configuration:**

```nginx
server {
    listen 443 ssl http2;
    server_name your-api-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🌍 **Domain Configuration**

### **DNS Records:**

```
Type    Name                    Value
A       api.yourdomain.com      YOUR_SERVER_IP
A       app.yourdomain.com      YOUR_FRONTEND_IP
CNAME   www.yourdomain.com      yourdomain.com
```

### **Environment Variables:**

**Frontend (.env):**
```bash
VITE_WEBSOCKET_URL=wss://api.yourdomain.com
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

**Backend (.env):**
```bash
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
DEEPGRAM_API_KEY=your_key_here
CORS_ORIGIN=https://app.yourdomain.com
```

## 🐳 **Docker Production Deployment**

### **Production Docker Compose:**

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
    restart: unless-stopped
    networks:
      - transcription-network

  frontend:
    build: ./client
    ports:
      - "80:80"
    environment:
      - VITE_WEBSOCKET_URL=wss://api.yourdomain.com
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - transcription-network

networks:
  transcription-network:
    driver: bridge
```

### **Deploy with Docker:**

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy both services
./deploy.sh docker production
```

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoint:**

The backend includes a health check at `/health`:

```bash
curl https://api.yourdomain.com/health
# Should return: {"status": "healthy", "timestamp": "..."}
```

### **Logging:**

```bash
# View logs
pm2 logs transcription-server

# Monitor processes
pm2 monit
```

## 🔄 **Continuous Deployment**

### **GitHub Actions Example:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Your deployment commands
          
      - name: Deploy Frontend
        run: |
          # Your deployment commands
```

## 🧪 **Testing Production Deployment**

1. **Test WebSocket Connection:**
   ```javascript
   const ws = new WebSocket('wss://api.yourdomain.com');
   ws.onopen = () => console.log('Connected!');
   ```

2. **Test Extension:**
   - Load the extension from your deployed frontend
   - Verify it connects to your production backend
   - Test transcription functionality

3. **Monitor Performance:**
   - Check response times
   - Monitor error rates
   - Verify WebSocket stability

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Verify `CORS_ORIGIN` in backend
   - Check frontend domain matches

2. **WebSocket Connection Failed:**
   - Verify SSL certificate
   - Check firewall settings
   - Ensure port 8080 is open

3. **Extension Not Loading:**
   - Check frontend build
   - Verify manifest.json paths
   - Clear browser cache

## 📞 **Support**

For deployment issues:
1. Check logs: `pm2 logs` or `docker logs`
2. Verify environment variables
3. Test endpoints individually
4. Check network connectivity

---

**Happy Deploying! 🚀**
