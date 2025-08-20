"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { MetricsCard } from '@/components/analytics/MetricsCard';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { JobCategoryChart } from '@/components/analytics/JobCategoryChart';
import { UserActivityChart } from '@/components/analytics/UserActivityChart';
import { GrowthMetricsChart } from '@/components/analytics/GrowthMetricsChart';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Activity,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import type { DashboardOverview } from '@/lib/analytics-service';

export default function EnhancedAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardOverview | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState<any>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchAnalytics();
      fetchRealTimeStats();
    }
  }, [currentUser, timeRange]);

  // Auto-refresh real-time stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        fetchRealTimeStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?type=overview&timeRange=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      } else {
        toast({
          title: 'Failed to load analytics',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: 'Failed to load analytics',
        description: 'An error occurred while loading analytics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      const response = await fetch(`/api/analytics?type=realtime`);
      
      if (response.ok) {
        const data = await response.json();
        setRealTimeStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch real-time stats:', error);
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/PDF report
    toast({
      title: 'Export Started',
      description: 'Your analytics report is being generated...',
    });
  };

  const handleShareDashboard = () => {
    // In a real app, this would share the dashboard URL
    toast({
      title: 'Dashboard Shared',
      description: 'Dashboard link has been copied to clipboard.',
    });
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need admin privileges to view enhanced analytics.
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading enhanced analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground">
              Analytics data is not available at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Enhanced Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Interactive insights and real-time platform performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleShareDashboard} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Stats Banner */}
      {realTimeStats && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-600">Live Platform Stats</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-lg font-bold">{realTimeStats.activeUsers}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-lg font-bold">{realTimeStats.activeJobs}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                  <p className="text-lg font-bold">{realTimeStats.pendingApplications}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-bold text-green-600">
                    ${(realTimeStats.totalRevenue / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Jobs"
              value={analytics.jobMetrics.totalJobs.toLocaleString()}
              description="All time job postings"
              icon={Briefcase}
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricsCard
              title="Active Users"
              value={analytics.userMetrics.activeUsers.toLocaleString()}
              description="Currently active users"
              icon={Users}
              trend={{ value: 8.3, isPositive: true }}
            />
            <MetricsCard
              title="Total Revenue"
              value={`$${(analytics.financialMetrics.totalRevenue / 1000).toFixed(0)}k`}
              description="Platform revenue"
              icon={DollarSign}
              trend={{ value: 15.7, isPositive: true }}
              variant="success"
            />
            <MetricsCard
              title="Success Rate"
              value={`${analytics.jobMetrics.jobSuccessRate}%`}
              description="Job completion rate"
              icon={CheckCircle}
              trend={{ value: 5.2, isPositive: true }}
              variant="success"
            />
          </div>

          {/* Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={analytics.financialMetrics.revenueByMonth}
              title="Revenue Trend"
              description="Monthly revenue performance with interactive insights"
            />
            <JobCategoryChart 
              data={analytics.jobMetrics.topJobCategories}
              title="Job Categories"
              description="Distribution of jobs by category with percentage breakdown"
            />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Revenue"
              value={`$${(analytics.financialMetrics.totalRevenue / 1000).toFixed(0)}k`}
              icon={DollarSign}
              variant="success"
            />
            <MetricsCard
              title="Monthly Revenue"
              value={`$${(analytics.financialMetrics.revenueThisMonth / 1000).toFixed(0)}k`}
              icon={TrendingUp}
              variant="success"
            />
            <MetricsCard
              title="Platform Fees"
              value={`$${(analytics.financialMetrics.platformFees / 1000).toFixed(0)}k`}
              icon={DollarSign}
            />
            <MetricsCard
              title="Escrow Funds"
              value={`$${(analytics.financialMetrics.escrowFunds / 1000).toFixed(0)}k`}
              icon={AlertCircle}
              variant="warning"
            />
          </div>

          <RevenueChart 
            data={analytics.financialMetrics.revenueByMonth}
            title="Revenue Performance"
            description="Detailed revenue analysis with trend indicators"
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Active Jobs"
              value={analytics.jobMetrics.activeJobs}
              icon={Briefcase}
            />
            <MetricsCard
              title="Completed Jobs"
              value={analytics.jobMetrics.completedJobs}
              icon={CheckCircle}
              variant="success"
            />
            <MetricsCard
              title="Avg Job Value"
              value={`$${analytics.jobMetrics.averageJobValue}`}
              icon={DollarSign}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <JobCategoryChart 
              data={analytics.jobMetrics.topJobCategories}
              title="Job Distribution"
              description="Interactive breakdown of job categories"
            />
            <GrowthMetricsChart 
              data={analytics.financialMetrics.revenueByMonth.map((item, index) => ({
                month: item.month,
                users: analytics.userMetrics.totalUsers + (index * 50),
                jobs: analytics.jobMetrics.totalJobs + (index * 10),
                revenue: item.revenue,
                applications: analytics.applicationMetrics.totalApplications + (index * 20),
              }))}
              title="Growth Metrics"
              description="Multi-metric growth analysis"
            />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Messages"
              value={analytics.engagementMetrics.totalMessages.toLocaleString()}
              icon={MessageSquare}
            />
            <MetricsCard
              title="Active Conversations"
              value={analytics.engagementMetrics.activeConversations}
              icon={MessageSquare}
              variant="success"
            />
            <MetricsCard
              title="Avg Response Time"
              value={`${analytics.engagementMetrics.averageResponseTime}h`}
              icon={Clock}
              variant="warning"
            />
            <MetricsCard
              title="Satisfaction Score"
              value={`${analytics.engagementMetrics.userSatisfactionScore}/5`}
              icon={Target}
              variant="success"
            />
          </div>

          <UserActivityChart 
            data={analytics.engagementMetrics.platformUsageByHour}
            title="User Activity Patterns"
            description="Real-time user engagement throughout the day"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 