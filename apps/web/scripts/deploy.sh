#!/bin/bash

# Agent Management System Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="agent-management-system"
DOCKER_REGISTRY="ghcr.io"
IMAGE_TAG=${1:-latest}
ENVIRONMENT=${2:-production}

echo -e "${BLUE}🚀 Starting deployment for ${PROJECT_NAME}${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Image tag: ${IMAGE_TAG}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if required environment variables are set
    if [ -z "$NODE_ENV" ]; then
        export NODE_ENV=production
        print_warning "NODE_ENV not set, defaulting to production"
    fi
    
    print_status "Prerequisites check completed"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build web application
    docker build -t ${PROJECT_NAME}-web:${IMAGE_TAG} -f Dockerfile .
    
    # Build background service
    docker build -t ${PROJECT_NAME}-background:${IMAGE_TAG} -f Dockerfile.background .
    
    print_status "Docker images built successfully"
}

# Run security scans
security_scan() {
    print_status "Running security scans..."
    
    # Run Trivy vulnerability scanner
    if command -v trivy &> /dev/null; then
        trivy image ${PROJECT_NAME}-web:${IMAGE_TAG}
        trivy image ${PROJECT_NAME}-background:${IMAGE_TAG}
    else
        print_warning "Trivy not installed, skipping security scan"
    fi
    
    print_status "Security scan completed"
}

# Deploy application
deploy() {
    print_status "Deploying application..."
    
    # Create necessary directories
    mkdir -p logs ssl
    
    # Generate self-signed SSL certificate for development
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_warning "Generating self-signed SSL certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem -out ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    fi
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "Application is healthy"
    else
        print_error "Application health check failed"
        docker-compose logs
        exit 1
    fi
    
    print_status "Deployment completed successfully"
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p monitoring
    
    # Create basic Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'agent-management-system'
    static_configs:
      - targets: ['localhost:3000', 'localhost:3001']
EOF
    
    print_status "Monitoring setup completed"
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    
    check_prerequisites
    build_images
    security_scan
    deploy
    setup_monitoring
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}Web Interface: https://localhost${NC}"
    echo -e "${BLUE}Background Service: https://localhost:3001${NC}"
    echo -e "${BLUE}Health Check: https://localhost/health${NC}"
}

# Run main function
main "$@"