
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import UserRoleSwitcher from '@/components/shared/UserRoleSwitcher';
import { 
  Briefcase, 
  LogIn, 
  UserPlus, 
  Bell, 
  UserCircle, 
  LogOut, 
  PlusCircle, 
  ListOrdered, 
  ClipboardList, 
  Loader2,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { useState } from 'react';
import logoImage from '@/assets/logo160.png'; // Higher resolution logo

export default function Header() {
  const { role, currentUser, logout, isLoading, isAuthenticated } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Logo component using imported logo - NO FALLBACK
  const LogoComponent = () => (
    <div className="flex items-center gap-2">
      <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
        <Image
          src={logoImage}
          alt="PeakCrews"
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <LogoComponent />
            </Link>
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <LogoComponent />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAuthenticated && (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />Find Work
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5 transition-colors">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />Sign In
                  </Link>
                </Button>
                <Button asChild className="btn-gradient">
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />Sign Up
                  </Link>
                </Button>
              </>
            )}

            {isAuthenticated && role === 'worker' && currentUser && (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />Job Feed
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/applications">
                    <ClipboardList className="mr-2 h-4 w-4" />My Applications
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors relative">
                  <Link href="/notifications">
                    <NotificationBadge className="mr-2" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />Profile
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />Sign Out
                </Button>
              </>
            )}

            {isAuthenticated && role === 'hirer' && currentUser && (
              <>
                <Button variant="default" asChild className="btn-accent-gradient">
                  <Link href="/post-job">
                    <PlusCircle className="mr-2 h-4 w-4" />Post Job
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/my-jobs">
                    <ListOrdered className="mr-2 h-4 w-4" />My Jobs
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors relative">
                  <Link href="/notifications">
                    <NotificationBadge className="mr-2" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors">
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />Profile
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />Sign Out
                </Button>
              </>
            )}
            <UserRoleSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated && (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
                      <Briefcase className="mr-2 h-4 w-4" />Find Work
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start btn-gradient">
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserPlus className="mr-2 h-4 w-4" />Sign Up
                    </Link>
                  </Button>
                </>
              )}

              {isAuthenticated && role === 'worker' && currentUser && (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
                      <Briefcase className="mr-2 h-4 w-4" />Job Feed
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/applications" onClick={() => setIsMobileMenuOpen(false)}>
                      <ClipboardList className="mr-2 h-4 w-4" />My Applications
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                      <Bell className="mr-2 h-4 w-4" />Notifications
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserCircle className="mr-2 h-4 w-4" />Profile
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="w-full justify-start border-red-200 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />Sign Out
                  </Button>
                </>
              )}

              {isAuthenticated && role === 'hirer' && currentUser && (
                <>
                  <Button variant="default" asChild className="w-full justify-start btn-accent-gradient">
                    <Link href="/post-job" onClick={() => setIsMobileMenuOpen(false)}>
                      <PlusCircle className="mr-2 h-4 w-4" />Post Job
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/my-jobs" onClick={() => setIsMobileMenuOpen(false)}>
                      <ListOrdered className="mr-2 h-4 w-4" />My Jobs
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                      <Bell className="mr-2 h-4 w-4" />Notifications
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserCircle className="mr-2 h-4 w-4" />Profile
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="w-full justify-start border-red-200 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />Sign Out
                  </Button>
                </>
              )}
              
              <div className="pt-2">
                <UserRoleSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
