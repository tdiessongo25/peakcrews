'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Clock, 
  Download, 
  Gauge, 
  HardDrive, 
  Network, 
  RefreshCw, 
  TrendingUp,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { usePerformance } from '@/lib/performance-service';

interface PerformanceMetrics {
  pageLoadTime: number;
  resourceLoadTimes: Array<{ name: string; duration: number }>;
  metrics: Map<string, any>;
}

export default function PerformanceDashboard() {
  const { metrics, pageLoadTime, resourceLoadTimes } = usePerformance();
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [performanceScore, setPerformanceScore] = useState(0);

  // Calculate performance score
  useEffect(() => {
    const calculateScore = () => {
      let score = 100;
      
      // Deduct points for slow page load
      if (pageLoadTime > 3000) score -= 30;
      else if (pageLoadTime > 2000) score -= 20;
      else if (pageLoadTime > 1000) score -= 10;

      // Deduct points for slow resources
      const slowResources = resourceLoadTimes.filter(r => r.duration > 1000);
      score -= slowResources.length * 5;

      setPerformanceScore(Math.max(0, score));
    };

    calculateScore();
  }, [pageLoadTime, resourceLoadTimes]);

  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { status: 'Excellent', color: 'bg-green-500', icon: Zap };
    if (score >= 70) return { status: 'Good', color: 'bg-yellow-500', icon: TrendingUp };
    if (score >= 50) return { status: 'Fair', color: 'bg-orange-500', icon: AlertTriangle };
    return { status: 'Poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  const performanceStatus = getPerformanceStatus(performanceScore);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time performance monitoring and optimization insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isMonitoring ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <span className="text-2xl font-bold">{performanceScore}</span>
              </div>
              <div 
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  background: `conic-gradient(${performanceStatus.color} ${performanceScore * 3.6}deg, transparent 0deg)`
                }}
              />
            </div>
            <div>
              <Badge className={`${performanceStatus.color} text-white`}>
                <performanceStatus.icon className="h-3 w-3 mr-1" />
                {performanceStatus.status}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Based on page load time, resource performance, and user experience metrics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(pageLoadTime)}</div>
            <p className="text-xs text-muted-foreground">
              {pageLoadTime < 1000 ? "Excellent" : pageLoadTime < 2000 ? "Good" : "Needs improvement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources Loaded</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceLoadTimes.length}</div>
            <p className="text-xs text-muted-foreground">
              {resourceLoadTimes.filter(r => r.duration < 500).length} fast, {resourceLoadTimes.filter(r => r.duration > 1000).length} slow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof window !== 'undefined' && 'memory' in performance 
                ? formatBytes((performance as any).memory.usedJSHeapSize)
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              JavaScript heap memory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof window !== 'undefined' && 'connection' in navigator
                ? (navigator as any).connection?.effectiveType || 'Unknown'
                : 'Unknown'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Connection type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Resource Performance</TabsTrigger>
          <TabsTrigger value="timing">Timing Breakdown</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Load Times</CardTitle>
              <CardDescription>
                Performance of individual resources loaded on this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceLoadTimes
                  .sort((a, b) => b.duration - a.duration)
                  .slice(0, 10)
                  .map((resource, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{resource.name}</p>
                        <Progress 
                          value={Math.min((resource.duration / 2000) * 100, 100)} 
                          className="mt-1"
                        />
                      </div>
                      <Badge variant={resource.duration > 1000 ? "destructive" : "secondary"}>
                        {formatTime(resource.duration)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Load Timing</CardTitle>
              <CardDescription>
                Detailed breakdown of page load performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typeof window !== 'undefined' && 'performance' in window && (
                  (() => {
                    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                    if (!navigation) return <p>No timing data available</p>;

                    const timings = [
                      { name: 'DNS Lookup', value: navigation.domainLookupEnd - navigation.domainLookupStart },
                      { name: 'TCP Connection', value: navigation.connectEnd - navigation.connectStart },
                      { name: 'Time to First Byte', value: navigation.responseStart - navigation.requestStart },
                      { name: 'DOM Content Loaded', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart },
                      { name: 'Window Load', value: navigation.loadEventEnd - navigation.loadEventStart },
                    ];

                    return timings.map((timing, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{timing.name}</span>
                        <Badge variant="outline">{formatTime(timing.value)}</Badge>
                      </div>
                    ));
                  })()
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                Suggestions to improve your application's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageLoadTime > 2000 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Slow Page Load</h4>
                      <p className="text-sm text-yellow-700">
                        Consider implementing code splitting, lazy loading, and optimizing images.
                      </p>
                    </div>
                  </div>
                )}

                {resourceLoadTimes.filter(r => r.duration > 1000).length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <Download className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Slow Resources</h4>
                      <p className="text-sm text-orange-700">
                        {resourceLoadTimes.filter(r => r.duration > 1000).length} resources are loading slowly. 
                        Consider using CDN, compression, and caching.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">General Optimizations</h4>
                    <ul className="text-sm text-blue-700 space-y-1 mt-2">
                      <li>• Enable gzip compression</li>
                      <li>• Use browser caching</li>
                      <li>• Minimize HTTP requests</li>
                      <li>• Optimize images and use WebP format</li>
                      <li>• Implement lazy loading for images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
