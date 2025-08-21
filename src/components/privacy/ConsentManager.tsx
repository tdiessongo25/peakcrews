"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  PrivacyComplianceManager, 
  ConsentType, 
  ConsentStatus,
  PrivacyRequestType 
} from '@/lib/privacy-compliance';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Eye, 
  Cookie, 
  BarChart3, 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Trash2,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface ConsentManagerProps {
  onConsentChange?: (consents: Record<ConsentType, ConsentStatus>) => void;
  showPrivacyRequests?: boolean;
}

interface ConsentOption {
  type: ConsentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  purpose: string;
  legalBasis: string;
  category: 'necessary' | 'functional' | 'analytics' | 'marketing';
}

const CONSENT_OPTIONS: ConsentOption[] = [
  {
    type: ConsentType.NECESSARY,
    title: 'Necessary Cookies',
    description: 'Essential cookies for website functionality and security',
    icon: <Shield className="h-5 w-5" />,
    required: true,
    purpose: 'Website functionality and security',
    legalBasis: 'Legitimate interest',
    category: 'necessary'
  },
  {
    type: ConsentType.ANALYTICS,
    title: 'Analytics',
    description: 'Help us understand how visitors interact with our website',
    icon: <BarChart3 className="h-5 w-5" />,
    required: false,
    purpose: 'Website analytics and performance monitoring',
    legalBasis: 'Consent',
    category: 'analytics'
  },
  {
    type: ConsentType.MARKETING,
    title: 'Marketing',
    description: 'Personalized advertising and marketing communications',
    icon: <Mail className="h-5 w-5" />,
    required: false,
    purpose: 'Marketing and advertising',
    legalBasis: 'Consent',
    category: 'marketing'
  },
  {
    type: ConsentType.THIRD_PARTY,
    title: 'Third-party Services',
    description: 'Integration with third-party services and APIs',
    icon: <Users className="h-5 w-5" />,
    required: false,
    purpose: 'Third-party service integration',
    legalBasis: 'Consent',
    category: 'functional'
  },
  {
    type: ConsentType.TRACKING,
    title: 'Tracking & Profiling',
    description: 'User behavior tracking and profile building',
    icon: <Eye className="h-5 w-5" />,
    required: false,
    purpose: 'User behavior analysis and profiling',
    legalBasis: 'Consent',
    category: 'analytics'
  }
];

export function ConsentManager({ onConsentChange, showPrivacyRequests = true }: ConsentManagerProps) {
  const [consents, setConsents] = useState<Record<ConsentType, ConsentStatus>>({} as Record<ConsentType, ConsentStatus>);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<Record<ConsentType, boolean>>({} as Record<ConsentType, boolean>);
  const [privacyRequests, setPrivacyRequests] = useState<any[]>([]);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const { currentUser } = useUser();
  const { toast } = useToast();

  // Load existing consents
  useEffect(() => {
    const loadConsents = async () => {
      if (!currentUser) return;

      try {
        const consentStatuses: Record<ConsentType, ConsentStatus> = {} as Record<ConsentType, ConsentStatus>;
        
        for (const option of CONSENT_OPTIONS) {
          const status = await PrivacyComplianceManager.getConsentStatus(currentUser.id, option.type);
          consentStatuses[option.type] = status;
        }

        setConsents(consentStatuses);
        onConsentChange?.(consentStatuses);
      } catch (error) {
        console.error('Failed to load consents:', error);
      }
    };

    loadConsents();
  }, [currentUser, onConsentChange]);

  const handleConsentChange = async (consentType: ConsentType, granted: boolean) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const status = granted ? ConsentStatus.GRANTED : ConsentStatus.DENIED;
      const option = CONSENT_OPTIONS.find(opt => opt.type === consentType);
      
      if (option) {
        await PrivacyComplianceManager.recordConsent(
          currentUser.id,
          consentType,
          status,
          '127.0.0.1', // In production, get from request
          navigator.userAgent,
          option.purpose,
          option.legalBasis
        );

        setConsents(prev => ({
          ...prev,
          [consentType]: status
        }));

        onConsentChange?.({
          ...consents,
          [consentType]: status
        });

        toast({
          title: `Consent ${granted ? 'Granted' : 'Denied'}`,
          description: `${option.title} consent has been ${granted ? 'granted' : 'denied'}`,
          variant: granted ? 'default' : 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to update consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to update consent preferences',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawConsent = async (consentType: ConsentType) => {
    if (!currentUser) return;

    try {
      await PrivacyComplianceManager.withdrawConsent(currentUser.id, consentType);
      
      setConsents(prev => ({
        ...prev,
        [consentType]: ConsentStatus.WITHDRAWN
      }));

      const option = CONSENT_OPTIONS.find(opt => opt.type === consentType);
      toast({
        title: 'Consent Withdrawn',
        description: `${option?.title} consent has been withdrawn`,
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to withdraw consent',
        variant: 'destructive'
      });
    }
  };

  const handlePrivacyRequest = async (requestType: PrivacyRequestType) => {
    if (!currentUser) return;

    setIsSubmittingRequest(true);
    try {
      const requestId = await PrivacyComplianceManager.submitPrivacyRequest(
        currentUser.id,
        requestType,
        `User requested ${requestType}`
      );

      toast({
        title: 'Privacy Request Submitted',
        description: `Your ${requestType} request has been submitted (ID: ${requestId})`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to submit privacy request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit privacy request',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const getConsentStatusBadge = (status: ConsentStatus) => {
    switch (status) {
      case ConsentStatus.GRANTED:
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Granted</Badge>;
      case ConsentStatus.DENIED:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Denied</Badge>;
      case ConsentStatus.EXPIRED:
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Expired</Badge>;
      case ConsentStatus.WITHDRAWN:
        return <Badge variant="outline" className="border-orange-200 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Withdrawn</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const toggleDetails = (consentType: ConsentType) => {
    setShowDetails(prev => ({
      ...prev,
      [consentType]: !prev[consentType]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Consent Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Consent Management
          </CardTitle>
          <CardDescription>
            Manage your privacy preferences and consent settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {CONSENT_OPTIONS.map((option) => (
            <div key={option.type} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{option.title}</h4>
                      {option.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      {getConsentStatusBadge(consents[option.type])}
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!option.required && (
                    <Switch
                      checked={consents[option.type] === ConsentStatus.GRANTED}
                      onCheckedChange={(checked) => handleConsentChange(option.type, checked)}
                      disabled={isLoading || option.required}
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDetails(option.type)}
                  >
                    Details
                  </Button>
                </div>
              </div>

              {showDetails[option.type] && (
                <div className="ml-8 space-y-2 text-sm">
                  <div><strong>Purpose:</strong> {option.purpose}</div>
                  <div><strong>Legal Basis:</strong> {option.legalBasis}</div>
                  <div><strong>Category:</strong> {option.category}</div>
                  
                  {consents[option.type] === ConsentStatus.GRANTED && !option.required && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWithdrawConsent(option.type)}
                      className="mt-2"
                    >
                      Withdraw Consent
                    </Button>
                  )}
                </div>
              )}

              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Rights */}
      {showPrivacyRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Privacy Rights
            </CardTitle>
            <CardDescription>
              Exercise your privacy rights under GDPR and CCPA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Right to Access
                </h4>
                <p className="text-sm text-muted-foreground">
                  Request a copy of your personal data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrivacyRequest(PrivacyRequestType.ACCESS)}
                  disabled={isSubmittingRequest}
                >
                  Request Data Access
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Data Portability
                </h4>
                <p className="text-sm text-muted-foreground">
                  Download your data in a portable format
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrivacyRequest(PrivacyRequestType.PORTABILITY)}
                  disabled={isSubmittingRequest}
                >
                  Download My Data
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Right to Erasure
                </h4>
                <p className="text-sm text-muted-foreground">
                  Request deletion of your personal data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrivacyRequest(PrivacyRequestType.ERASURE)}
                  disabled={isSubmittingRequest}
                >
                  Request Deletion
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Right to Rectification
                </h4>
                <p className="text-sm text-muted-foreground">
                  Request correction of inaccurate data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrivacyRequest(PrivacyRequestType.RECTIFICATION)}
                  disabled={isSubmittingRequest}
                >
                  Request Correction
                </Button>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Privacy requests are processed within 30 days as required by law. 
                You will receive a confirmation email once your request is processed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">GDPR Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Legal basis for processing documented</li>
                <li>• Data subject rights implemented</li>
                <li>• Data protection by design</li>
                <li>• Privacy impact assessments</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">CCPA Compliance</h4>
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
    </div>
  );
}
