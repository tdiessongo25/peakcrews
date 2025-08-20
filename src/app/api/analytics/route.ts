import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const timeRange = searchParams.get('timeRange') as 'week' | 'month' | 'quarter' | 'year' || 'month';

    switch (type) {
      case 'overview':
        const overview = await AnalyticsService.getDashboardOverview();
        return NextResponse.json({
          success: true,
          data: overview,
        });

      case 'jobs':
        const jobMetrics = await AnalyticsService.getJobAnalytics(timeRange);
        return NextResponse.json({
          success: true,
          data: jobMetrics,
        });

      case 'users':
        const userMetrics = await AnalyticsService.getUserAnalytics(timeRange);
        return NextResponse.json({
          success: true,
          data: userMetrics,
        });

      case 'applications':
        const applicationMetrics = await AnalyticsService.getApplicationAnalytics(timeRange);
        return NextResponse.json({
          success: true,
          data: applicationMetrics,
        });

      case 'financial':
        const financialMetrics = await AnalyticsService.getFinancialAnalytics(timeRange);
        return NextResponse.json({
          success: true,
          data: financialMetrics,
        });

      case 'engagement':
        const engagementMetrics = await AnalyticsService.getEngagementAnalytics(timeRange);
        return NextResponse.json({
          success: true,
          data: engagementMetrics,
        });

      case 'realtime':
        const realTimeStats = await AnalyticsService.getRealTimeStats();
        return NextResponse.json({
          success: true,
          data: realTimeStats,
        });

      case 'growth':
        const growthMetrics = await AnalyticsService.getGrowthMetrics();
        return NextResponse.json({
          success: true,
          data: growthMetrics,
        });

      case 'geographic':
        const geographicAnalytics = await AnalyticsService.getGeographicAnalytics();
        return NextResponse.json({
          success: true,
          data: geographicAnalytics,
        });

      case 'predictive':
        const predictiveAnalytics = await AnalyticsService.getPredictiveAnalytics();
        return NextResponse.json({
          success: true,
          data: predictiveAnalytics,
        });

      default:
        // Return overview by default
        const defaultOverview = await AnalyticsService.getDashboardOverview();
        return NextResponse.json({
          success: true,
          data: defaultOverview,
        });
    }
  } catch (error: any) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 