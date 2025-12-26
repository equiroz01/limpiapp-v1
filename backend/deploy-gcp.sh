#!/bin/bash

# LimpiApp Backend - GCP Deployment Script
# This script deploys the backend to Google Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=""
REGION="us-central1"
SERVICE_NAME="limpiapp-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
MIN_INSTANCES=0
MAX_INSTANCES=10
MEMORY="512Mi"
CPU=1
PORT=3000

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install it from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Prompt for project ID if not set
if [ -z "$PROJECT_ID" ]; then
    print_info "Available GCP projects:"
    gcloud projects list
    echo ""
    read -p "Enter your GCP Project ID: " PROJECT_ID
fi

# Set the project
print_info "Setting GCP project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
print_info "Enabling required GCP APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com

# Build the Docker image
print_info "Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Push the image to Google Container Registry
print_info "Pushing image to Google Container Registry..."
docker push $IMAGE_NAME:latest

# Create secrets in Secret Manager (if not already created)
print_info "Setting up secrets in Secret Manager..."
print_warning "Make sure you have created the following secrets in Secret Manager:"
echo "  - DATABASE_URL"
echo "  - JWT_SECRET"
echo "  - JWT_REFRESH_SECRET"
echo "  - STRIPE_SECRET_KEY"
echo "  - TWILIO_AUTH_TOKEN"
echo "  - SENDGRID_API_KEY"
echo "  - AWS_SECRET_ACCESS_KEY"
echo ""
read -p "Have you created these secrets? (y/n): " secrets_created

if [ "$secrets_created" != "y" ]; then
    print_warning "Please create the secrets first and run this script again."
    print_info "You can create secrets using:"
    echo "  echo -n 'your-secret-value' | gcloud secrets create SECRET_NAME --data-file=-"
    exit 0
fi

# Deploy to Cloud Run
print_info "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory $MEMORY \
    --cpu $CPU \
    --min-instances $MIN_INSTANCES \
    --max-instances $MAX_INSTANCES \
    --port $PORT \
    --set-env-vars "NODE_ENV=production,PORT=${PORT}" \
    --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,TWILIO_AUTH_TOKEN=TWILIO_AUTH_TOKEN:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest,AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY:latest,STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,TWILIO_ACCOUNT_SID=TWILIO_ACCOUNT_SID:latest,TWILIO_PHONE_NUMBER=TWILIO_PHONE_NUMBER:latest,SENDGRID_FROM_EMAIL=SENDGRID_FROM_EMAIL:latest,AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID:latest,AWS_REGION=AWS_REGION:latest,AWS_S3_BUCKET=AWS_S3_BUCKET:latest,GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY:latest"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

print_info "Deployment completed successfully!"
print_info "Service URL: $SERVICE_URL"
print_info "To view logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
print_info "To view service details: gcloud run services describe $SERVICE_NAME --region $REGION"

# Test the deployment
print_info "Testing the deployment..."
if curl -f -s "${SERVICE_URL}/health" > /dev/null; then
    print_info "Health check passed! Service is running correctly."
else
    print_warning "Health check failed. Please check the logs."
fi

echo ""
print_info "Deployment script completed!"
