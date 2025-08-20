#!/bin/bash

# 🚀 PeakCrews Deployment Script
# This script automates the deployment process for PeakCrews

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    local required_vars=(
        "CURSOR_API_KEY"
        "CURSOR_PROJECT_ID"
        "NEXT_PUBLIC_APP_URL"
        "ADMIN_SETUP_KEY"
        "STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Function to run pre-deployment checks
run_pre_deployment_checks() {
    print_status "Running pre-deployment checks..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check Node.js version
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_success "Pre-deployment checks passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --production=false
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Type checking
    print_status "Running TypeScript type checking..."
    npm run typecheck
    
    # Linting
    print_status "Running ESLint..."
    npm run lint
    
    print_success "All tests passed"
}

# Function to build the application
build_application() {
    print_status "Building application for production..."
    
    # Clean previous build
    if [ -d ".next" ]; then
        rm -rf .next
    fi
    
    # Build the application
    npm run build
    
    print_success "Application built successfully"
}

# Function to check build output
check_build_output() {
    print_status "Checking build output..."
    
    if [ ! -d ".next" ]; then
        print_error "Build failed: .next directory not found"
        exit 1
    fi
    
    if [ ! -f ".next/server.js" ]; then
        print_error "Build failed: server.js not found"
        exit 1
    fi
    
    print_success "Build output verified"
}

# Function to generate security keys
generate_security_keys() {
    print_status "Generating security keys..."
    
    if [ -z "$ADMIN_SETUP_KEY" ]; then
        print_warning "ADMIN_SETUP_KEY not set. Generating a secure key..."
        export ADMIN_SETUP_KEY=$(openssl rand -base64 32)
        echo "Generated ADMIN_SETUP_KEY: $ADMIN_SETUP_KEY"
        echo "Please save this key securely and update your environment variables."
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        print_warning "NEXTAUTH_SECRET not set. Generating a secure secret..."
        export NEXTAUTH_SECRET=$(openssl rand -base64 32)
        echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
        echo "Please save this secret securely and update your environment variables."
    fi
    
    print_success "Security keys generated"
}

# Function to create production environment file
create_production_env() {
    print_status "Creating production environment file..."
    
    if [ ! -f ".env.production" ]; then
        if [ -f "env.production.example" ]; then
            cp env.production.example .env.production
            print_warning "Created .env.production from template. Please update with your actual values."
        else
            print_warning "No production environment template found. Please create .env.production manually."
        fi
    else
        print_success "Production environment file already exists"
    fi
}

# Function to start the application
start_application() {
    print_status "Starting application..."
    
    # Check if port is available
    local port=${PORT:-3000}
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port $port is already in use. Please stop the existing process or change the port."
        exit 1
    fi
    
    # Start the application
    npm start &
    local pid=$!
    
    # Wait for the application to start
    print_status "Waiting for application to start..."
    sleep 10
    
    # Check if the application is running
    if kill -0 $pid 2>/dev/null; then
        print_success "Application started successfully on port $port"
        echo "PID: $pid"
        echo "URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:$port}"
    else
        print_error "Application failed to start"
        exit 1
    fi
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    local url=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null; then
            print_success "Health check passed"
            return 0
        fi
        
        print_status "Health check attempt $attempt/$max_attempts failed, retrying in 2 seconds..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Health check failed after $max_attempts attempts"
    exit 1
}

# Function to display deployment summary
display_deployment_summary() {
    print_success "🚀 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "  - Application URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    echo "  - Admin Setup: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/admin-setup"
    echo "  - Admin Panel: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/admin"
    echo ""
    echo "🔧 Next Steps:"
    echo "  1. Create admin account at /admin-setup"
    echo "  2. Test all features and functionality"
    echo "  3. Configure monitoring and analytics"
    echo "  4. Set up SSL certificates (if not already done)"
    echo "  5. Configure backup and disaster recovery"
    echo ""
    echo "📚 Useful URLs:"
    echo "  - Test Payments: /test-payments"
    echo "  - Test Search: /test-search"
    echo "  - Test Reviews: /test-reviews"
    echo "  - Test Admin: /test-admin"
    echo "  - Mobile Jobs: /mobile-jobs"
    echo ""
    echo "🔒 Security Reminders:"
    echo "  - Change default admin password"
    echo "  - Enable two-factor authentication"
    echo "  - Monitor access logs"
    echo "  - Keep dependencies updated"
}

# Main deployment function
main() {
    echo "🚀 Starting PeakCrews deployment..."
    echo ""
    
    # Run all deployment steps
    run_pre_deployment_checks
    check_env_vars
    install_dependencies
    run_tests
    generate_security_keys
    create_production_env
    build_application
    check_build_output
    start_application
    run_health_checks
    display_deployment_summary
}

# Check if script is being sourced or run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
