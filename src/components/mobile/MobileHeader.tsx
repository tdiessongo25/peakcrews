"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { useMobile } from '@/hooks/use-mobile';
import { mobileUtils } from '@/hooks/use-mobile';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Camera, 
  Share2, 
  Home,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Plus,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  showCamera?: boolean;
  showShare?: boolean;
  onSearch?: () => void;
  onLocation?: () => void;
  onCamera?: () => void;
  onShare?: () => void;
}

export function MobileHeader({
  title = "PeakCrews",
  showSearch = true,
  showLocation = true,
  showCamera = false,
  showShare = false,
  onSearch,
  onLocation,
  onCamera,
  onShare,
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useUser();
  const mobileInfo = useMobile();
  const router = useRouter();

  const handleLocationRequest = async () => {
    try {
      const position = await mobileUtils.requestLocation();
      console.log('Location obtained:', position);
      onLocation?.();
    } catch (error) {
      console.error('Location request failed:', error);
    }
  };

  const handleCameraRequest = async () => {
    try {
      const stream = await mobileUtils.requestCamera();
      console.log('Camera access granted');
      onCamera?.();
      // Stop the stream immediately as we're just testing access
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera request failed:', error);
    }
  };

  const handleShare = async () => {
    const success = await mobileUtils.share({
              title: 'PeakCrews',
      text: 'Find skilled tradespeople for your projects',
      url: window.location.href,
    });
    if (success) {
      onShare?.();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Briefcase, label: 'Job Feed', href: '/jobs' },
    { icon: FileText, label: 'My Applications', href: '/applications' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu and Title */}
        <div className="flex items-center gap-3">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col h-full">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser?.profileImageUrl} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{currentUser?.name || 'Guest'}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {currentUser?.email || 'Not signed in'}
                    </p>
                    {currentUser && (
                      <Badge variant="secondary" className="mt-1">
                        {currentUser.role}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-4">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="border-t p-4">
                  {currentUser ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login">
                        <Button className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={onSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Location */}
          {showLocation && mobileInfo.hasGeolocation && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleLocationRequest}
            >
              <MapPin className="h-5 w-5" />
            </Button>
          )}

          {/* Camera */}
          {showCamera && mobileInfo.hasCamera && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleCameraRequest}
            >
              <Camera className="h-5 w-5" />
            </Button>
          )}

          {/* Share */}
          {showShare && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                4
              </Badge>
            </Button>
          </Link>

          {/* User Avatar */}
          <Link href="/profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.profileImageUrl} />
              <AvatarFallback>
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile-specific features indicator */}
      {mobileInfo.isStandalone && (
        <div className="bg-blue-50 px-4 py-1 text-xs text-blue-700 text-center">
          📱 Running as PWA
        </div>
      )}
    </header>
  );
}
