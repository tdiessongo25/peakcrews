"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SecureLoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultRole?: 'worker' | 'hirer' | 'admin';
}

export function SecureLoginForm({ onSuccess, onCancel, defaultRole = 'worker' }: SecureLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'worker' | 'hirer' | 'admin'>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; feedback: string[] } | null>(null);

  const { secureLogin, isAccountLocked, getRemainingAttempts, getRemainingLockoutTime, validatePassword } = useUser();
  const { toast } = useToast();

  // Check account status on email change
  useEffect(() => {
    if (email) {
      const locked = isAccountLocked(email);
      if (locked) {
        const remainingTime = getRemainingLockoutTime(email);
        setLockoutTime(remainingTime);
        setError(`Account is temporarily locked. Please try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
      } else {
        const attempts = getRemainingAttempts(email);
        setRemainingAttempts(attempts);
        setLockoutTime(null);
        setError('');
      }
    }
  }, [email, isAccountLocked, getRemainingAttempts, getRemainingLockoutTime]);

  // Validate password strength
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordStrength(validation);
    } else {
      setPasswordStrength(null);
    }
  }, [password, validatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get client IP (in production, this would come from the server)
      const ipAddress = '127.0.0.1'; // Replace with actual IP detection
      const userAgent = navigator.userAgent;

      const result = await secureLogin(email, password, role, ipAddress, userAgent);

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to PeakCrews!",
          variant: "default",
        });
        onSuccess?.();
      } else {
        setError(result.message);
        
        // Update remaining attempts
        const attempts = getRemainingAttempts(email);
        setRemainingAttempts(attempts);

        // Check if account is now locked
        if (isAccountLocked(email)) {
          const remainingTime = getRemainingLockoutTime(email);
          setLockoutTime(remainingTime);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && !isLoading && !lockoutTime;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your PeakCrews account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading || !!lockoutTime}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLoading || !!lockoutTime}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm">
                  {passwordStrength.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className={passwordStrength.isValid ? "text-green-600" : "text-yellow-600"}>
                    Password Strength
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {feedback}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Sign in as</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['worker', 'hirer', 'admin'] as const).map((roleOption) => (
                <Button
                  key={roleOption}
                  type="button"
                  variant={role === roleOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRole(roleOption)}
                  disabled={isLoading || !!lockoutTime}
                  className="capitalize"
                >
                  {roleOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Security Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {remainingAttempts !== null && remainingAttempts < 5 && !lockoutTime && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {remainingAttempts} login attempts remaining
              </AlertDescription>
            </Alert>
          )}

          {lockoutTime && (
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Account locked. Please try again in {Math.ceil(lockoutTime / 60000)} minutes.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Additional Links */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground text-center border-t pt-4">
          <p>🔒 Your account is protected with advanced security measures</p>
          <p>• Brute force protection • Session management • Activity monitoring</p>
        </div>
      </CardContent>
    </Card>
  );
}
