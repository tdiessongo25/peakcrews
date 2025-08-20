import { Metadata } from 'next';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, AlertTriangle, Bell, TrendingUp, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Monitoring - PeakCrews',
  description: 'Real-time security monitoring and incident response',
};

export default function SecurityMonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time threat detection, incident response, and security analytics
          </p>
        </div>

        {/* Security Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Operations Center
            </CardTitle>
            <CardDescription>
              Comprehensive security monitoring and incident management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-medium">Threat Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time threat detection and pattern recognition
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Incident Response</h3>
                <p className="text-sm text-muted-foreground">
                  Automated incident response and containment
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium">Alert Management</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent alerting and notification system
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Security analytics and threat intelligence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Dashboard */}
        <SecurityDashboard showDetails={true} refreshInterval={30000} />

        {/* Monitoring Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring Capabilities
            </CardTitle>
            <CardDescription>
              Advanced security monitoring features and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Real-time Monitoring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Continuous security event monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Pattern recognition and correlation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Threat level assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Behavioral analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Anomaly detection
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Incident Response</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Automated incident creation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Priority-based incident management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Automated containment measures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Escalation procedures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Incident lifecycle tracking
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Security Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators and security metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Response Times</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Critical Incidents</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">5 min</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Priority</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">15 min</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium Priority</span>
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">1 hour</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Detection Rates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Threat Detection</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>False Positives</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">0.1%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Automated Response</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">95%</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">System Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">99.99%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Processing</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Real-time</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Capacity</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Unlimited</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Advanced Security Features
            </CardTitle>
            <CardDescription>
              Enterprise-grade security monitoring capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Threat Intelligence</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time threat feeds integration</li>
                  <li>• Machine learning-based threat detection</li>
                  <li>• Behavioral analysis and profiling</li>
                  <li>• Threat actor identification</li>
                  <li>• Vulnerability assessment</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Automation & Orchestration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Automated incident response</li>
                  <li>• Playbook execution</li>
                  <li>• Integration with security tools</li>
                  <li>• Workflow automation</li>
                  <li>• Custom response actions</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Compliance & Reporting</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Regulatory compliance monitoring</li>
                  <li>• Audit trail maintenance</li>
                  <li>• Custom report generation</li>
                  <li>• Executive dashboards</li>
                  <li>• Compliance attestation</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Integration & APIs</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• RESTful API access</li>
                  <li>• Third-party integrations</li>
                  <li>• Webhook notifications</li>
                  <li>• Custom connector support</li>
                  <li>• Data export capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              24/7 Security Operations
            </CardTitle>
            <CardDescription>
              Round-the-clock security monitoring and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Emergency Contacts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Security Hotline:</span>
                    <span className="font-medium">+1-800-SECURITY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">security@peakcrews.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">5 minutes</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Support Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Security Monitoring:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">24/7</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Incident Response:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">24/7</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical Support:</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">24/7</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
