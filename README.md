# PeakCrews

A modern platform connecting skilled trades to urgent job needs, built with Next.js and Cursor's backend infrastructure.

## Features

- **Role-based Authentication**: Secure login for workers and contractors
- **Job Management**: Post, browse, and manage job listings
- **Application System**: Workers can apply to jobs, contractors can review applications
- **Profile Management**: Detailed profiles for both workers and contractors
- **Review System**: Rate and review completed jobs
- **Real-time Notifications**: Stay updated on job status and applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Cursor API (Authentication, Data, Storage)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cursor API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd peakcrews-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Cursor credentials:
   ```env
   CURSOR_API_BASE_URL=https://api.cursor.com
   CURSOR_API_KEY=your_cursor_api_key_here
   CURSOR_PROJECT_ID=your_cursor_project_id_here
   CURSOR_MFA_ENABLED=false
   CURSOR_EMAIL_VERIFICATION=true
   CURSOR_PASSWORD_RESET=true
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (app)/             # Protected application routes
│   │   ├── applications/  # Job applications
│   │   ├── jobs/          # Job listings and details
│   │   ├── my-jobs/       # Posted jobs management
│   │   ├── notifications/ # User notifications
│   │   ├── post-job/      # Job posting form
│   │   └── profile/       # User profile management
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Sign in page
│   │   └── register/      # Sign up page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── jobs/              # Job-related components
│   ├── layout/            # Layout components
│   ├── notifications/     # Notification components
│   ├── profile/           # Profile components
│   ├── reviews/           # Review components
│   ├── shared/            # Shared components
│   └── ui/                # Base UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── cursor-client.ts   # Cursor API client
│   ├── data-service.ts    # Data service layer
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── ai/                    # AI integration (Genkit)
```

## Key Features

### Authentication & Authorization

- **Secure Authentication**: Token-based authentication with HttpOnly cookies
- **Role-based Access**: Separate interfaces for workers and contractors
- **Route Protection**: Automatic redirect for unauthenticated users
- **Session Management**: Automatic token refresh and session persistence

### Job Management

- **Job Posting**: Contractors can create detailed job listings
- **Job Browsing**: Workers can search and filter available jobs
- **Application System**: Workers can apply, contractors can review
- **Status Tracking**: Real-time updates on job and application status

### User Profiles

- **Worker Profiles**: Skills, certifications, availability, and reviews
- **Contractor Profiles**: Company information, contact details, and ratings
- **Profile Management**: Easy editing and updating of profile information

### Notifications

- **Real-time Updates**: Instant notifications for job applications and status changes
- **Email Notifications**: Optional email alerts for important events
- **Notification Center**: Centralized notification management

## API Integration

The application uses Cursor's backend services:

- **Authentication API**: User registration, login, and session management
- **Data API**: CRUD operations for jobs, applications, profiles, and reviews
- **Storage API**: File upload and management for profile images and documents

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `CURSOR_API_BASE_URL`
- `CURSOR_API_KEY`
- `CURSOR_PROJECT_ID`
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`

### Build and Deploy

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Check the [Migration Guide](MIGRATION_GUIDE.md) for detailed setup instructions
- Review the [API Documentation](docs/api.md) for endpoint details
- Open an issue for bugs or feature requests

## Migration from Firebase

This project has been migrated from Firebase to Cursor's backend infrastructure. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed information about the migration process and setup instructions.
