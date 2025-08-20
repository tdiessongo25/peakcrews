import { useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export function useCursorAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setError(null);
      } else {
        // For development, set a default user if no session
        const defaultUser = {
          id: 'user1',
          name: 'John Worker',
          email: 'worker@example.com',
          role: 'worker' as UserRole,
          profileImageUrl: 'https://placehold.co/100x100.png',
        };
        setUser(defaultUser);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      // For development, set a default user on error
      const defaultUser = {
        id: 'user1',
        name: 'John Worker',
        email: 'worker@example.com',
        role: 'worker' as UserRole,
        profileImageUrl: 'https://placehold.co/100x100.png',
      };
      setUser(defaultUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${data.user.name}`,
        });
        
        // Redirect based on role
        if (data.user.role === 'worker') {
          router.push('/jobs');
        } else {
          router.push('/post-job');
        }
      } else {
        setError(data.error || 'Sign in failed');
        toast({
          title: 'Sign in failed',
          description: data.error || 'Sign in failed',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'Sign in failed';
      setError(errorMessage);
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const signUp = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
        
        // Redirect to profile setup
        router.push('/profile?new=true');
      } else {
        setError(data.error || 'Sign up failed');
        toast({
          title: 'Sign up failed',
          description: data.error || 'Sign up failed',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'Sign up failed';
      setError(errorMessage);
      toast({
        title: 'Sign up failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      setUser(null);
      setError(null);
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
      // Even if sign out fails, clear local state
      setUser(null);
      setError(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setError(null);
      } else {
        setUser(null);
        setError('Session expired. Please sign in again.');
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setUser(null);
      setError('Session expired. Please sign in again.');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
    clearError,
  };
} 