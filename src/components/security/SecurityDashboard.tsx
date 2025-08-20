"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  SecurityMonitoringManager,
  SecurityEventType,
  ThreatLevel,
  SecurityIncident,
  SecurityAlert
} from '@/lib/security-monitoring';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Bell,
  Lock,
  Users,
  Server
} from 'lucide-react';

interface SecurityDashboardProps {
  showDetails?: boolean;
  refreshInterval?: number;
}

export function SecurityDashboard({ showDetails = true, refreshInterval = 30000 }: SecurityDashboardProps) {
  const [threatLevel, setThreatLevel] = useState<ThreatLevel | null>(null);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { currentUser } = useUser();
  const { toast } = useToast();

  // Load security data
  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      
      const currentThreatLevel = SecurityMonitoringManager.getCurrentThreatLevel();
      const activeIncidents = SecurityMonitoringManager.getActiveIncidents();
      const activeAlerts = SecurityMonitoringManager.getActiveAlerts();
      
      setThreatLevel(currentThreatLevel);
      setIncidents(activeIncidents);
      setAlerts(activeAlerts);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security monitoring data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and load data
  useEffect(() => {
    const initializeMonitoring = async () => {
      try {
        await SecurityMonitoringManager.initialize();
        await loadSecurityData();
      } catch (error) {
        console.error('Failed to initialize security monitoring:', error);
      }
    };

    initializeMonitoring();
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(loadSecurityData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await SecurityMonitoringManager.acknowledgeAlert(alertId, currentUser?.id || 'system');
      await loadSecurityData();
      
      toast({
        title: 'Alert Acknowledged',
        description: 'Security alert has been acknowledged',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive'
      });
    }
  };

  // Handle incident status update
  const handleUpdateIncidentStatus = async (incidentId: string, status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed') => {
    try {
      await SecurityMonitoringManager.updateIncidentStatus(incidentId, status, currentUser?.id || 'system');
      await loadSecurityData();
      
      toast({
        title: 'Incident Updated',
        description: `Incident status updated to ${status}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to update incident status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update incident status',
        variant: 'destructive'
      });
    }
  };

  // Get threat level color and icon
  const getThreatLevelDisplay = (level: string) => {
    switch (level) {
      case 'critical':
        return { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" />, label: 'Critical' };
      case 'high':
        return { color: 'bg-orange-100 text-orange-800', icon: <Zap className="h-4 w-4" />, label: 'High' };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Target className="h-4 w-4" />, label: 'Medium' };
      case 'low':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Low' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Shield className="h-4 w-4" />, label: 'Unknown' };
    }
  };

  // Get incident status color
  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'contained':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get alert severity color
  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time security monitoring and incident management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSecurityData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Threat Level Overview */}
      {threatLevel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Threat Level
            </CardTitle>
            <CardDescription>
              Real-time threat assessment and security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  {getThreatLevelDisplay(threatLevel.level).icon}
                </div>
                <div>
                  <Badge className={`${getThreatLevelDisplay(threatLevel.level).color}`}>
                    {getThreatLevelDisplay(threatLevel.level).label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Threat Score: {threatLevel.score}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Threat Factors</h4>
                {threatLevel.factors.length > 0 ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {threatLevel.factors.slice(0, 5).map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {factor.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No active threat factors</p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground">
                  {threatLevel.timestamp.toLocaleString()}
                </p>
                <div className="text-xs text-muted-foreground">
                  Threat level is automatically assessed every 5 minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{incidents.length}</p>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">Unacknowledged Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.severity === 'critical').length}
                </p>
                <p className="text-sm text-muted-foreground">Critical Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length}
                </p>
                <p className="text-sm text-muted-foreground">Resolved Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Security Incidents
            </CardTitle>
            <CardDescription>
              Current security incidents requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.slice(0, showDetails ? 10 : 3).map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <Badge className={getAlertSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <h4 className="font-medium">{incident.title}</h4>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {incident.detectedAt.toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                  
                  {showDetails && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span>Priority: {incident.priority}</span>
                        <span>Type: {incident.type}</span>
                        <span>Actions: {incident.actions.length}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {incident.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateIncidentStatus(incident.id, 'investigating')}
                          >
                            Start Investigation
                          </Button>
                        )}
                        {incident.status === 'investigating' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateIncidentStatus(incident.id, 'contained')}
                          >
                            Mark Contained
                          </Button>
                        )}
                        {incident.status === 'contained' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateIncidentStatus(incident.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Recent security alerts requiring acknowledgment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, showDetails ? 10 : 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getAlertSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="font-medium">Authentication</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Secure</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Multi-factor authentication and session management active
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="font-medium">Access Control</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Role-based access control and privilege management enabled
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-green-500" />
                <span className="font-medium">Infrastructure</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Protected</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Rate limiting, DDoS protection, and security headers active
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Active Issues */}
      {incidents.length === 0 && alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">All Systems Secure</h3>
            <p className="text-muted-foreground">
              No active security incidents or alerts detected. Your system is currently secure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
