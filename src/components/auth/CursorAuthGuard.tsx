"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCursorAuth } from '@/hooks/use-cursor-auth';
import type { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface CursorAuthGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function CursorAuthGuard({
  children,
  requiredRoles = [],
  fallback,
  redirectTo = '/login',
}: CursorAuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useCursorAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Loading...</CardTitle>
          <CardDescription>Checking authentication status</CardDescription>
        </Card>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
          <Shield className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Authentication Required</CardTitle>
          <CardDescription className="mb-6">
            You must be signed in to access this page.
          </CardDescription>
          <div className="space-y-3">
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You don't have permission to access this page. Required roles: {requiredRoles.join(', ')}
          </CardDescription>
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Go Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
}

// Convenience components for common role-based guards
export function WorkerGuard({ children, ...props }: Omit<CursorAuthGuardProps, 'requiredRoles'>) {
  return (
    <CursorAuthGuard requiredRoles={['worker']} {...props}>
      {children}
    </CursorAuthGuard>
  );
}

export function HirerGuard({ children, ...props }: Omit<CursorAuthGuardProps, 'requiredRoles'>) {
  return (
    <CursorAuthGuard requiredRoles={['hirer']} {...props}>
      {children}
    </CursorAuthGuard>
  );
}

export function AuthenticatedGuard({ children, ...props }: Omit<CursorAuthGuardProps, 'requiredRoles'>) {
  return (
    <CursorAuthGuard {...props}>
      {children}
    </CursorAuthGuard>
  );
} 