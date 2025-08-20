"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminSetupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    setupKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    passwordLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
    passwordsMatch: false,
  });
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    setRequirements({
      passwordLength: password.length >= 12,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      passwordsMatch: password === formData.confirmPassword && password.length > 0,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      validatePassword(value);
    } else if (field === 'confirmPassword') {
      setRequirements(prev => ({
        ...prev,
        passwordsMatch: value === formData.password && value.length > 0,
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.includes('@') &&
      Object.values(requirements).every(req => req) &&
      formData.setupKey.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: 'Validation Error',
        description: 'Please check all requirements are met.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          setupKey: formData.setupKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Admin Account Created!',
          description: `Admin account created successfully for ${data.adminEmail}`,
        });
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          setupKey: '',
        });
        setRequirements({
          passwordLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumbers: false,
          hasSymbols: false,
          passwordsMatch: false,
        });
      } else {
        toast({
          title: 'Setup Failed',
          description: data.error || 'Failed to create admin account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: 'Setup Error',
        description: 'An error occurred during admin setup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>
            Create the initial administrator account for PeakCrews
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> This page should only be used during initial setup. 
              Keep your setup key secure and use it only once.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@peakcrews.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter strong password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Setup Key */}
            <div className="space-y-2">
              <Label htmlFor="setupKey">Setup Key</Label>
              <Input
                id="setupKey"
                type="password"
                value={formData.setupKey}
                onChange={(e) => handleInputChange('setupKey', e.target.value)}
                placeholder="Enter your setup key"
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Password Requirements</Label>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${requirements.passwordLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  At least 12 characters
                </div>
                <div className={`flex items-center gap-2 ${requirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${requirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  One lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${requirements.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  One number
                </div>
                <div className={`flex items-center gap-2 ${requirements.hasSymbols ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  One special character
                </div>
                <div className={`flex items-center gap-2 ${requirements.passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  Passwords match
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              After creating your admin account, you can access the admin panel at{' '}
              <code className="bg-gray-100 px-1 rounded">/admin</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
