# CrewSwift Firebase to Cursor Migration Guide

This document outlines the migration from Firebase to Cursor's backend infrastructure for the CrewSwift application.

## Overview

The migration replaces Firebase Authentication, Firestore, and Storage with Cursor's equivalent services while maintaining the same functionality and improving security and developer experience.

## Changes Made

### 1. Configuration & Environment

#### Removed
- Firebase SDK dependencies
- Firebase configuration files
- Firebase-specific environment variables

#### Added
- `cursor.config.ts` - Centralized Cursor configuration
- Environment variables for Cursor API integration
- Next.js rewrites for API routing

### 2. Authentication System

#### Replaced Firebase Auth with Cursor Auth
- **Before**: Firebase Authentication with email/password and OAuth
- **After**: Cursor's token-based authentication with HttpOnly cookies

#### New Authentication Features
- Secure session management with `SameSite=Strict` cookies
- Automatic token refresh
- Role-based access control
- Multi-factor authentication support (configurable)
- Email verification workflow
- Password reset functionality

#### Components Updated
- `src/hooks/use-cursor-auth.ts` - New authentication hook
- `src/contexts/UserContext.tsx` - Integrated with Cursor auth
- `src/app/(auth)/login/page.tsx` - Updated for Cursor auth
- `src/app/(auth)/register/page.tsx` - Updated for Cursor auth
- `src/components/layout/Header.tsx` - Updated for Cursor auth

### 3. Data Layer

#### Replaced Firestore with Cursor Data API
- **Before**: Firestore collections and documents
- **After**: RESTful API endpoints with Cursor's data service

#### New Data Services
- `src/lib/cursor-client.ts` - Cursor API client
- `src/lib/data-service.ts` - High-level data service layer
- Proper error handling and type safety
- Automatic retry logic and caching

### 4. File Storage

#### Replaced Firebase Storage with Cursor Storage
- **Before**: Firebase Storage for file uploads
- **After**: Cursor's file storage service
- Secure file upload with authentication
- Automatic file cleanup and management

### 5. Security Improvements

#### Authentication Security
- HttpOnly cookies prevent XSS attacks
- SameSite=Strict prevents CSRF attacks
- Automatic session expiration
- Secure token refresh mechanism

#### Authorization
- Role-based access control (RBAC)
- Route protection with `CursorAuthGuard`
- API-level permission checks
- User session validation

#### Data Security
- Input validation and sanitization
- SQL injection prevention
- Rate limiting support
- Audit logging capabilities

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your Cursor credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Cursor API Configuration
CURSOR_API_BASE_URL=https://api.cursor.com
CURSOR_API_KEY=your_actual_cursor_api_key
CURSOR_PROJECT_ID=your_cursor_project_id

# Feature Flags
CURSOR_MFA_ENABLED=false
CURSOR_EMAIL_VERIFICATION=true
CURSOR_PASSWORD_RESET=true

# Next.js Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

## API Endpoints

The application now uses the following Cursor API endpoints:

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User logout
- `POST /auth/refresh` - Token refresh
- `POST /auth/verify` - Email verification
- `POST /auth/reset-password` - Password reset

### Data
- `GET /data/users/me` - Get current user
- `PATCH /data/users/:id` - Update user
- `GET /data/jobs` - Get jobs with filters
- `POST /data/jobs` - Create job
- `PATCH /data/jobs/:id` - Update job
- `DELETE /data/jobs/:id` - Delete job
- `GET /data/applications` - Get applications
- `POST /data/applications` - Create application
- `PATCH /data/applications/:id` - Update application
- `GET /data/reviews` - Get reviews
- `POST /data/reviews` - Create review
- `GET /data/notifications` - Get notifications
- `PATCH /data/notifications/:id` - Mark notification as read
- `GET /data/profiles/worker/:id` - Get worker profile
- `PATCH /data/profiles/worker/:id` - Update worker profile
- `GET /data/profiles/hirer/:id` - Get hirer profile
- `PATCH /data/profiles/hirer/:id` - Update hirer profile

### Storage
- `POST /storage/upload` - Upload file
- `DELETE /storage/delete` - Delete file

## Usage Examples

### Authentication

```typescript
import { useCursorAuth } from '@/hooks/use-cursor-auth';

function LoginComponent() {
  const { signIn, isLoading, error } = useCursorAuth();
  
  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };
}
```

### Route Protection

```typescript
import { CursorAuthGuard, WorkerGuard, HirerGuard } from '@/components/auth/CursorAuthGuard';

// Protect any authenticated route
<CursorAuthGuard>
  <ProtectedComponent />
</CursorAuthGuard>

// Protect worker-only routes
<WorkerGuard>
  <WorkerOnlyComponent />
</WorkerGuard>

// Protect hirer-only routes
<HirerGuard>
  <HirerOnlyComponent />
</HirerGuard>
```

### Data Operations

```typescript
import { DataService } from '@/lib/data-service';

// Get jobs
const jobs = await DataService.getJobs({ status: 'open' });

// Create job
const newJob = await DataService.createJob({
  title: 'Plumbing Repair',
  description: 'Need urgent plumbing repair',
  // ... other fields
});

// Update profile
const updatedProfile = await DataService.updateWorkerProfile(userId, {
  skills: ['plumbing', 'electrical']
});
```

## Error Handling

The new system includes comprehensive error handling:

```typescript
try {
  const result = await DataService.createJob(jobData);
} catch (error) {
  if (error.message.includes('permission')) {
    // Handle permission errors
  } else if (error.message.includes('not found')) {
    // Handle not found errors
  } else {
    // Handle general errors
  }
}
```

## Migration Checklist

- [x] Remove Firebase dependencies
- [x] Create Cursor configuration
- [x] Implement Cursor authentication
- [x] Create data service layer
- [x] Update authentication components
- [x] Add route protection
- [x] Update header component
- [x] Create environment configuration
- [x] Add error handling
- [x] Update package.json
- [x] Create migration documentation

## Testing

To test the migration:

1. **Authentication Flow**
   - Test user registration
   - Test user login
   - Test session persistence
   - Test logout functionality

2. **Route Protection**
   - Test protected routes without authentication
   - Test role-based access control
   - Test redirect behavior

3. **Data Operations**
   - Test CRUD operations for jobs
   - Test application management
   - Test profile updates
   - Test file uploads

4. **Error Handling**
   - Test network errors
   - Test permission errors
   - Test validation errors

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check CURSOR_API_KEY in environment
   - Verify CURSOR_API_BASE_URL is correct
   - Check browser console for errors

2. **API calls failing**
   - Verify API endpoints in cursor.config.ts
   - Check network connectivity
   - Review API response in browser dev tools

3. **Environment variables not loading**
   - Ensure .env.local file exists
   - Restart development server
   - Check variable names match cursor.config.ts

### Support

For issues with the migration or Cursor integration, please refer to:
- Cursor API documentation
- Next.js documentation
- React documentation

## Future Enhancements

- [ ] Implement real-time updates with WebSockets
- [ ] Add offline support with service workers
- [ ] Implement advanced caching strategies
- [ ] Add analytics and monitoring
- [ ] Implement advanced security features 