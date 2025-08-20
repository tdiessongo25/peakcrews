"use client";

import { ReactNode, useEffect, useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { useMobile } from '@/hooks/use-mobile';
import { mobileUtils } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Briefcase, 
  FileText, 
  Bell, 
  User,
  Plus,
  Search,
  MapPin,
  Camera,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  showCamera?: boolean;
  showShare?: boolean;
  showFloatingAction?: boolean;
  floatingActionIcon?: ReactNode;
  onFloatingAction?: () => void;
  onSearch?: () => void;
  onLocation?: () => void;
  onCamera?: () => void;
  onShare?: () => void;
}

export function MobileLayout({
  children,
  title,
  showSearch = true,
  showLocation = true,
  showCamera = false,
  showShare = false,
  showFloatingAction = false,
  floatingActionIcon = <Plus className="h-6 w-6" />,
  onFloatingAction,
  onSearch,
  onLocation,
  onCamera,
  onShare,
}: MobileLayoutProps) {
  const mobileInfo = useMobile();
  const { toast } = useToast();
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Back Online',
        description: 'Your connection has been restored.',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Connection Lost',
        description: 'You are currently offline. Some features may be limited.',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Show PWA install prompt
  useEffect(() => {
    if (mobileInfo.isMobile && !mobileInfo.isStandalone) {
      // In a real PWA, this would show the install prompt
      // For now, we'll just log it
      console.log('PWA install prompt available');
    }
  }, [mobileInfo.isMobile, mobileInfo.isStandalone]);

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/', active: pathname === '/' },
    { icon: Briefcase, label: 'Jobs', href: '/jobs', active: pathname.startsWith('/jobs') },
    { icon: FileText, label: 'Applications', href: '/applications', active: pathname.startsWith('/applications') },
    { icon: Bell, label: 'Notifications', href: '/notifications', active: pathname.startsWith('/notifications') },
    { icon: User, label: 'Profile', href: '/profile', active: pathname.startsWith('/profile') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title={title}
        showSearch={showSearch}
        showLocation={showLocation}
        showCamera={showCamera}
        showShare={showShare}
        onSearch={onSearch}
        onLocation={onLocation}
        onCamera={onCamera}
        onShare={onShare}
      />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <p className="text-sm text-red-700 text-center">
            📱 You are currently offline
          </p>
        </div>
      )}

      {/* Network Status Indicator */}
      {mobileInfo.connectionType !== 'unknown' && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-1">
          <p className="text-xs text-blue-700 text-center">
            📶 {mobileInfo.connectionType.toUpperCase()} • {mobileInfo.downlink}Mbps
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Floating Action Button */}
      {showFloatingAction && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={onFloatingAction}
          >
            {floatingActionIcon}
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Safe Area for iOS */}
      <div className="h-20" />

      {/* Mobile-specific features */}
      {mobileInfo.isMobile && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {/* Quick Actions */}
          {showSearch && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full shadow-lg"
              onClick={onSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {showLocation && mobileInfo.hasGeolocation && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full shadow-lg"
              onClick={onLocation}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}

          {showCamera && mobileInfo.hasCamera && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full shadow-lg"
              onClick={onCamera}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}

          {showShare && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full shadow-lg"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* PWA Install Prompt */}
      {mobileInfo.isMobile && !mobileInfo.isStandalone && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-sm">Install PeakCrews</h3>
                <p className="text-xs text-muted-foreground">
                  Add to home screen for quick access
                </p>
              </div>
              <Button size="sm" onClick={mobileUtils.showAddToHomeScreen}>
                Install
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
