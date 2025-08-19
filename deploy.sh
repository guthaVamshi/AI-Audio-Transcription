#!/bin/bash

# Deployment Script for AI Audio Transcription
# Usage: ./deploy.sh [frontend|backend|both] [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
SERVICE=${1:-"both"}
ENVIRONMENT=${2:-"production"}

echo -e "${GREEN}🚀 Starting deployment for $SERVICE in $ENVIRONMENT environment${NC}"

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}📱 Deploying Frontend...${NC}"
    
    cd client
    
    # Install dependencies
    echo "Installing dependencies..."
    npm ci
    
    # Build for production
    echo "Building for production..."
    npm run build
    
    # Create production build
    echo "Creating production build..."
    
    cd ..
    echo -e "${GREEN}✅ Frontend deployment completed${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}🔧 Deploying Backend...${NC}"
    
    cd server
    
    # Install dependencies
    echo "Installing dependencies..."
    npm ci
    
    # Build TypeScript
    echo "Building TypeScript..."
    npm run build
    
    # Set environment
    export NODE_ENV=$ENVIRONMENT
    
    cd ..
    echo -e "${GREEN}✅ Backend deployment completed${NC}"
}

# Function to deploy with Docker
deploy_docker() {
    echo -e "${YELLOW}🐳 Deploying with Docker...${NC}"
    
    # Build and start services
    docker-compose -f docker-compose.yml up -d --build
    
    echo -e "${GREEN}✅ Docker deployment completed${NC}"
}

# Function to deploy to cloud (example for AWS/Google Cloud)
deploy_cloud() {
    echo -e "${YELLOW}☁️  Deploying to Cloud...${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Deploying to production cloud environment..."
        # Add your cloud deployment commands here
        # Example: gcloud app deploy, aws deploy, etc.
    else
        echo "Deploying to staging cloud environment..."
        # Add your staging deployment commands here
    fi
    
    echo -e "${GREEN}✅ Cloud deployment completed${NC}"
}

# Main deployment logic
case $SERVICE in
    "frontend")
        deploy_frontend
        ;;
    "backend")
        deploy_backend
        ;;
    "both")
        deploy_frontend
        deploy_backend
        ;;
    "docker")
        deploy_docker
        ;;
    "cloud")
        deploy_cloud
        ;;
    *)
        echo -e "${RED}❌ Invalid service: $SERVICE${NC}"
        echo "Usage: ./deploy.sh [frontend|backend|both|docker|cloud] [environment]"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update your environment variables"
echo "2. Configure your domain names"
echo "3. Set up SSL certificates"
echo "4. Test the connection"
