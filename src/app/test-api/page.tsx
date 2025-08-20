"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function TestApiPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    connection: boolean;
    error?: string;
    details?: string;
    envInfo?: string;
    response?: any;
  }>({
    connection: false,
  });

  const testApiConnection = async () => {
    setIsLoading(true);
    setResults({ connection: false });

    try {
      // Log environment information
      const envInfo = `
        API Base URL: ${process.env.NEXT_PUBLIC_CURSOR_API_BASE_URL || 'Not set'}
        API Key: ${process.env.NEXT_PUBLIC_CURSOR_API_KEY ? 'Set' : 'Not set'}
        App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set'}
      `;
      
      console.log('Environment Info:', envInfo);
      setResults(prev => ({ ...prev, envInfo }));

      // Test API connection through backend proxy
      console.log('Testing API connection via backend proxy...');
      
      const response = await fetch('/api/test-cursor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Proxy response status:', response.status);
      
      const data = await response.json();
      console.log('Proxy response data:', data);

      if (data.success) {
        setResults(prev => ({ 
          ...prev, 
          connection: true,
          response: data
        }));
      } else {
        throw new Error(`API test failed: ${data.message} - ${data.error || 'Unknown error'}`);
      }

    } catch (error: any) {
      console.error('API test failed:', error);
      setResults(prev => ({ 
        ...prev, 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Cursor API Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to Cursor API via backend proxy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={testApiConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing API Connection...
              </>
            ) : (
              'Run API Tests'
            )}
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {results.connection ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>API Connection: {results.connection ? 'Success' : 'Failed'}</span>
            </div>
          </div>

          {results.error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">Error: {results.error}</div>
                {results.details && (
                  <div className="mt-2 text-sm opacity-80">
                    <pre className="whitespace-pre-wrap">{results.details}</pre>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {results.connection && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                API connection successful! The Cursor API is accessible.
                {results.response && (
                  <div className="mt-2 text-sm">
                    <strong>Response:</strong> {results.response.message}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {results.envInfo && (
            <div className="text-sm text-muted-foreground">
              <p><strong>Environment Variables:</strong></p>
              <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded">
                {results.envInfo}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 