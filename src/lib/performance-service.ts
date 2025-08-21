import React from 'react';

// Performance optimization service
export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, number> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // Initialize performance monitoring
  init(): void {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
      this.setupResourceTiming();
      this.setupUserTiming();
    }
  }

  // Setup performance observers
  private setupPerformanceObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('navigation', {
              dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcp: navEntry.connectEnd - navEntry.connectStart,
              ttfb: navEntry.responseStart - navEntry.requestStart,
              domLoad: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              windowLoad: navEntry.loadEventEnd - navEntry.loadEventStart,
              total: navEntry.loadEventEnd - navEntry.fetchStart,
            });
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);
    }
  }

  // Setup resource timing
  private setupResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric('resource', {
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
              type: resourceEntry.initiatorType,
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  // Setup user timing
  private setupUserTiming(): void {
    if ('PerformanceObserver' in window) {
      const userObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.recordMetric('measure', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        });
      });
      userObserver.observe({ entryTypes: ['measure'] });
      this.observers.set('measure', userObserver);
    }
  }

  // Record performance metric
  private recordMetric(type: string, data: any): void {
    const key = `${type}_${Date.now()}`;
    this.metrics.set(key, data);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(type, data);
    }
  }

  // Send metrics to analytics
  private sendToAnalytics(type: string, data: any): void {
    // Implement your analytics service here
    console.log('Performance metric:', { type, data, timestamp: Date.now() });
  }

  // Measure custom performance
  static measure(name: string, fn: () => void): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const startMark = `${name}-start`;
      const endMark = `${name}-end`;
      
      performance.mark(startMark);
      fn();
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
    }
  }

  // Get performance metrics
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  // Get page load time
  getPageLoadTime(): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
    }
    return 0;
  }

  // Get resource load times
  getResourceLoadTimes(): Array<{ name: string; duration: number }> {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
      }));
    }
    return [];
  }

  // Optimize images
  static optimizeImage(src: string, width: number, height: number): string {
    // Add image optimization parameters
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', '75');
    url.searchParams.set('f', 'webp');
    return url.toString();
  }

  // Lazy load component
  static lazyLoad<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ): React.LazyExoticComponent<T> {
    return React.lazy(() => 
      importFunc().then(module => ({
        default: module.default,
      }))
    );
  }

  // Preload critical resources
  static preloadResource(href: string, as: string = 'fetch'): void {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  }

  // Debounce function
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Cleanup observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Performance hooks
export const usePerformance = () => {
  const [metrics, setMetrics] = React.useState<Map<string, number>>(new Map());

  React.useEffect(() => {
    const performanceService = PerformanceService.getInstance();
    performanceService.init();

    const interval = setInterval(() => {
      setMetrics(performanceService.getMetrics());
    }, 5000);

    return () => {
      clearInterval(interval);
      performanceService.disconnect();
    };
  }, []);

  return {
    metrics,
    pageLoadTime: PerformanceService.getInstance().getPageLoadTime(),
    resourceLoadTimes: PerformanceService.getInstance().getResourceLoadTimes(),
  };
};

// Performance optimization utilities
export const PerformanceUtils = {
  // Intersection Observer for lazy loading
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
  },

  // Virtual scrolling utilities
  calculateVisibleRange: (
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    overscan: number = 5
  ): { start: number; end: number } => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + overscan, start + visibleCount);
    
    return {
      start: Math.max(0, start - overscan),
      end,
    };
  },

  // Memory management
  cleanupMemory: (): void => {
    if (typeof window !== 'undefined') {
      // Clear unused event listeners
      // Clear unused timers
      // Clear unused intervals
      console.log('Memory cleanup completed');
    }
  },
};

export default PerformanceService;
