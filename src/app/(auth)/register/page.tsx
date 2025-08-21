
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import type { UserRole } from "@/lib/types";
import { Loader2, Eye, EyeOff, Sparkles, ArrowRight, Shield, Clock, Star, CheckCircle } from "lucide-react";

function RegisterForm() {
  const { login, isLoading } = useUser();
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleToRegister, setRoleToRegister] = useState<UserRole>("worker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const roleFromQuery = searchParams.get('role') as UserRole;
    if (roleFromQuery && (roleFromQuery === 'worker' || roleFromQuery === 'hirer')) {
      setRoleToRegister(roleFromQuery);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      // Handle password mismatch error
      return;
    }
    
    try {
      await login(roleToRegister);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const isFormValid = name.trim() && email.trim() && password.length >= 8 && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2">Join PeakCrews</h1>
          <p className="text-muted-foreground">Create your account and start your journey</p>
        </div>

        <Card className="card-glass animate-slide-up">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join as a skilled Worker or as a Contractor to post jobs for your projects
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name / Company Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe or Your Company LLC" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                  disabled={isLoading}
                  className="input-modern"
              />
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                  disabled={isLoading}
                  className="input-modern"
              />
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
              <Input 
                id="password" 
                    type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                    disabled={isLoading}
                    minLength={8}
                    className="input-modern pr-10"
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
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
              <Input 
                id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                    disabled={isLoading}
                    className="input-modern pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Register as</Label>
              <select 
                id="role" 
                value={roleToRegister} 
                onChange={(e) => setRoleToRegister(e.target.value as UserRole)}
                  className="w-full p-3 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  disabled={isLoading}
              >
                <option value="worker">Worker</option>
                <option value="hirer">Contractor (General/Subcontractor)</option>
              </select>
            </div>
              
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-bounce-in">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full btn-gradient text-base py-3"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
            </Button>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </div>
              </div>
          </form>
        </CardContent>
      </Card>

        {/* Benefits */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="text-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Why choose PeakCrews?</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              "Free to join and use",
              "Verified worker profiles",
              "Secure payment processing",
              "24/7 customer support"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-green-500" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2">Loading...</h1>
          <p className="text-muted-foreground">Preparing registration form</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
