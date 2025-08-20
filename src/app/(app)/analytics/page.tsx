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
import { ChartCard } from '@/components/analytics/ChartCard';
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
  MapPin,
  Activity,
  Calendar,
  PieChart
} from 'lucide-react';
import type { DashboardOverview } from '@/lib/analytics-service';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardOverview | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchAnalytics();
    }
  }, [currentUser, timeRange]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need admin privileges to view analytics.
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
            <span>Loading analytics...</span>
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
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive insights into platform performance
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
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Jobs"
              value={formatNumber(analytics.jobMetrics.totalJobs)}
              description="All time job postings"
              icon={Briefcase}
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricsCard
              title="Active Users"
              value={formatNumber(analytics.userMetrics.activeUsers)}
              description="Currently active users"
              icon={Users}
              trend={{ value: 8.3, isPositive: true }}
            />
            <MetricsCard
              title="Total Revenue"
              value={formatCurrency(analytics.financialMetrics.totalRevenue)}
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

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Job Categories" icon={PieChart}>
              <div className="space-y-3">
                {analytics.jobMetrics.topJobCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Revenue Trend" icon={TrendingUp}>
              <div className="space-y-3">
                {analytics.financialMetrics.revenueByMonth.slice(-6).map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(month.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Active Jobs"
              value={analytics.jobMetrics.activeJobs}
              icon={Briefcase}
              variant="default"
            />
            <MetricsCard
              title="Completed Jobs"
              value={analytics.jobMetrics.completedJobs}
              icon={CheckCircle}
              variant="success"
            />
            <MetricsCard
              title="Avg Job Value"
              value={formatCurrency(analytics.jobMetrics.averageJobValue)}
              icon={DollarSign}
              variant="default"
            />
          </div>

          <ChartCard title="Job Status Distribution" icon={PieChart}>
            <div className="space-y-3">
              {analytics.jobMetrics.jobsByStatus.map((status, index) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'active' ? 'bg-blue-500' :
                      status.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">{status.status}</span>
                  </div>
                  <Badge variant="secondary">{status.count}</Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Total Users"
              value={formatNumber(analytics.userMetrics.totalUsers)}
              icon={Users}
            />
            <MetricsCard
              title="New Users (This Month)"
              value={analytics.userMetrics.newUsersThisMonth}
              icon={TrendingUp}
              variant="success"
            />
            <MetricsCard
              title="Retention Rate"
              value={`${analytics.userMetrics.userRetentionRate}%`}
              icon={Target}
              variant="success"
            />
          </div>

          <ChartCard title="Top Performing Users" icon={Users}>
            <div className="space-y-3">
              {analytics.userMetrics.topPerformingUsers.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.completedJobs} jobs completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(user.totalEarnings)}</p>
                    <p className="text-sm text-muted-foreground">Total earnings</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Revenue"
              value={formatCurrency(analytics.financialMetrics.totalRevenue)}
              icon={DollarSign}
              variant="success"
            />
            <MetricsCard
              title="Monthly Revenue"
              value={formatCurrency(analytics.financialMetrics.revenueThisMonth)}
              icon={TrendingUp}
              variant="success"
            />
            <MetricsCard
              title="Platform Fees"
              value={formatCurrency(analytics.financialMetrics.platformFees)}
              icon={DollarSign}
            />
            <MetricsCard
              title="Escrow Funds"
              value={formatCurrency(analytics.financialMetrics.escrowFunds)}
              icon={AlertCircle}
              variant="warning"
            />
          </div>

          <ChartCard title="Top Earning Workers" icon={Users}>
            <div className="space-y-3">
              {analytics.financialMetrics.topEarningWorkers.map((worker, index) => (
                <div key={worker.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{worker.name}</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {formatCurrency(worker.earnings)}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Messages"
              value={formatNumber(analytics.engagementMetrics.totalMessages)}
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

          <ChartCard title="Platform Usage by Hour" icon={Activity}>
            <div className="grid grid-cols-6 gap-2">
              {analytics.engagementMetrics.platformUsageByHour.map((hour) => (
                <div key={hour.hour} className="text-center">
                  <div className="text-xs text-muted-foreground">{hour.hour}:00</div>
                  <div className="text-sm font-medium">{hour.users}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
} 