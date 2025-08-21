"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { Loader2, User, LogOut, UserPlus } from "lucide-react";

export default function TestAuthPage() {
  const { 
    currentUser, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout 
  } = useUser();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login('worker');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-xl text-center">Authentication Test</CardTitle>
            <CardDescription className="text-center">
              Test the Cursor API authentication integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status */}
            <div className="space-y-2">
              <h3 className="font-semibold">Current Status:</h3>
              <div className="space-y-1 text-sm">
                <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
                {currentUser && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div>User: {currentUser.name}</div>
                    <div>Email: {currentUser.email}</div>
                    <div>Role: {currentUser.role}</div>
                  </div>
                )}
                {/* Error display removed for now */}
              </div>
            </div>

            {/* Authentication Form */}
            {!isAuthenticated && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Sign Up Only)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isSignUp || isLoading}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isSignUp ? "default" : "outline"}
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    variant={isSignUp ? "outline" : "default"}
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>
              </form>
            )}

            {/* Sign Out Button */}
            {isAuthenticated && (
              <Button 
                onClick={logout}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}

            {/* Test Credentials */}
            <div className="space-y-2">
              <h3 className="font-semibold">Test Credentials:</h3>
              <div className="space-y-1 text-sm">
                <div>Worker: worker@example.com / any password</div>
                <div>Hirer: hirer@example.com / any password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 