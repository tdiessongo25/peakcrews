import { Metadata } from 'next';
import { ConsentManager } from '@/components/privacy/ConsentManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Download, Trash2, Settings, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Settings - PeakCrews',
  description: 'Manage your privacy preferences and exercise your data rights',
};

export default function PrivacySettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Privacy Settings</h1>
          <p className="text-muted-foreground">
            Manage your privacy preferences and exercise your data rights under GDPR and CCPA
          </p>
        </div>

        {/* Privacy Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Overview
            </CardTitle>
            <CardDescription>
              Your privacy is important to us. Learn about how we protect your data and your rights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and protected with industry-standard security measures
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear information about how we collect, use, and protect your data
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Control</h3>
                <p className="text-sm text-muted-foreground">
                  Full control over your data and privacy preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Status
            </CardTitle>
            <CardDescription>
              Current compliance status with privacy regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GDPR Compliance</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Compliant
                  </Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Legal basis for processing documented</li>
                  <li>• Data subject rights implemented</li>
                  <li>• Data protection by design</li>
                  <li>• Privacy impact assessments</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">CCPA Compliance</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Compliant
                  </Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Notice at collection</li>
                  <li>• Right to know implemented</li>
                  <li>• Right to delete implemented</li>
                  <li>• Opt-out mechanisms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Manager */}
        <ConsentManager />

        {/* Data Rights Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Your Data Rights
            </CardTitle>
            <CardDescription>
              Understand your rights and how to exercise them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Right to Access</h3>
                <p className="text-sm text-muted-foreground">
                  You have the right to request a copy of all personal data we hold about you. 
                  This includes data we've collected, processed, and stored.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Response Time:</strong> Within 30 days
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Right to Portability</h3>
                <p className="text-sm text-muted-foreground">
                  You can request your data in a structured, commonly used, and machine-readable format 
                  for easy transfer to another service.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Format:</strong> JSON with encryption
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Right to Erasure</h3>
                <p className="text-sm text-muted-foreground">
                  You can request deletion of your personal data. We'll anonymize data for legal 
                  retention requirements while removing identifiable information.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Some data may be retained for legal compliance
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Right to Rectification</h3>
                <p className="text-sm text-muted-foreground">
                  You can request correction of inaccurate or incomplete personal data. 
                  We'll update your information promptly upon verification.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Process:</strong> Verification required for accuracy
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Processing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Data Processing Information
            </CardTitle>
            <CardDescription>
              How we process your data and what we do with it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Data We Collect</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Account information (name, email, phone)</li>
                  <li>• Profile data (skills, experience, preferences)</li>
                  <li>• Usage data (job applications, interactions)</li>
                  <li>• Technical data (IP address, device info)</li>
                  <li>• Communication data (messages, feedback)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">How We Use Your Data</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide and improve our services</li>
                  <li>• Match workers with job opportunities</li>
                  <li>• Process payments and transactions</li>
                  <li>• Send important notifications</li>
                  <li>• Ensure platform security</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                We retain your personal data for as long as necessary to provide our services 
                and comply with legal obligations. Data is automatically deleted or anonymized 
                after the retention period expires.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Get in touch with our privacy team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have any questions about your privacy rights or need help exercising them, 
                please contact our privacy team:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:privacy@peakcrews.com" className="text-blue-600 hover:underline">
                    privacy@peakcrews.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Response Time:</span>
                  <span className="text-muted-foreground">Within 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Data Protection Officer:</span>
                  <span className="text-muted-foreground">Available upon request</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
