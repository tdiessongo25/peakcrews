"use client";

import { useState, useEffect } from 'react';

export interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isStandalone: boolean; // PWA mode
  hasGeolocation: boolean;
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasNotifications: boolean;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'ethernet' | 'unknown';
  effectiveConnectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
  downlink: number; // Mbps
  rtt: number; // Round trip time in ms
}

export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isStandalone: false,
    hasGeolocation: false,
    hasCamera: false,
    hasMicrophone: false,
    hasNotifications: false,
    connectionType: 'unknown',
    effectiveConnectionType: 'unknown',
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      if (typeof window === 'undefined') return;
      
      const userAgent = navigator.userAgent;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Device detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      
      // Screen size detection
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;
      
      // Orientation detection
      const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
      
      // Touch device detection
      const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      
      // PWA detection
      const isStandalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true);
      
      // Feature detection
      const hasGeolocation = 'geolocation' in navigator;
      const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
      const hasMicrophone = hasCamera; // Usually available with camera
      const hasNotifications = typeof window !== 'undefined' && 'Notification' in window;
      
      // Network information
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const connectionType = connection?.type || 'unknown';
      const effectiveConnectionType = connection?.effectiveType || 'unknown';
      const downlink = connection?.downlink || 0;
      const rtt = connection?.rtt || 0;

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        screenHeight,
        orientation,
        isTouchDevice,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isFirefox,
        isStandalone,
        hasGeolocation,
        hasCamera,
        hasMicrophone,
        hasNotifications,
        connectionType,
        effectiveConnectionType,
        downlink,
        rtt,
      });
    };

    // Initial detection
    updateMobileInfo();

    // Listen for resize events
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateMobileInfo);
      window.addEventListener('orientationchange', updateMobileInfo);
    }
    
    // Listen for network changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateMobileInfo);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateMobileInfo);
        window.removeEventListener('orientationchange', updateMobileInfo);
      }
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateMobileInfo);
      }
    };
  }, []);

  return mobileInfo;
}

// Utility functions for mobile-specific features
export const mobileUtils = {
  // Request geolocation permission
  requestLocation: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  },

  // Request camera access
  requestCamera: (): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, // Use back camera on mobile
      audio: false,
    });
  },

  // Request microphone access
  requestMicrophone: (): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  },

  // Request notification permission
  requestNotifications: (): Promise<NotificationPermission> => {
    return Notification.requestPermission();
  },

  // Add to home screen prompt
  showAddToHomeScreen: () => {
    // This would typically be handled by a PWA service worker
    // For now, we'll show a manual prompt
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // PWA installation logic would go here
      console.log('PWA installation available');
    }
  },

  // Share content (Web Share API)
  share: async (data: { title?: string; text?: string; url?: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }
    return false;
  },

  // Vibrate device (if supported)
  vibrate: (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  // Check if device is online
  isOnline: (): boolean => {
    return navigator.onLine;
  },

  // Get battery information
  getBatteryInfo: async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
      } catch (error) {
        console.error('Battery info not available:', error);
        return null;
      }
    }
    return null;
  },
};
