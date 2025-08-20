'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
          <Card className="w-full max-w-md text-center p-8 shadow-xl">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
            
            <CardTitle className="text-2xl font-bold mb-2">Something went wrong!</CardTitle>
            <CardDescription className="mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </CardDescription>
            
            <div className="space-y-3">
              <Button onClick={reset} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </Card>
        </div>
      </body>
    </html>
  );
} 