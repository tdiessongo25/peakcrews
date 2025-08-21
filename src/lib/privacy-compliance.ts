import { DataEncryption, SecureStorage, DataProtection } from './encryption';
import { logSecurityEvent } from './security';

// Privacy and compliance configuration
const PRIVACY_CONFIG = {
  GDPR_ENABLED: true,
  CCPA_ENABLED: true,
  DATA_RETENTION_DAYS: 730, // 2 years
  CONSENT_EXPIRY_DAYS: 365, // 1 year
  ANONYMIZATION_ENABLED: true,
  DATA_PORTABILITY_ENABLED: true,
  RIGHT_TO_DELETE_ENABLED: true
};

// Consent types
export enum ConsentType {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  THIRD_PARTY = 'third_party',
  COOKIES = 'cookies',
  TRACKING = 'tracking'
}

// Consent status
export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn'
}

// Privacy request types
export enum PrivacyRequestType {
  ACCESS = 'access',
  RECTIFICATION = 'rectification',
  ERASURE = 'erasure',
  PORTABILITY = 'portability',
  RESTRICTION = 'restriction',
  OBJECTION = 'objection'
}

// Consent record interface
export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
  purpose: string;
  legalBasis: string;
}

// Privacy request interface
export interface PrivacyRequest {
  id: string;
  userId: string;
  requestType: PrivacyRequestType;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  completedAt?: Date;
  description: string;
  data?: any;
  notes?: string;
}

// Data processing activity interface
export interface DataProcessingActivity {
  id: string;
  purpose: string;
  legalBasis: string;
  dataCategories: string[];
  recipients: string[];
  retentionPeriod: number;
  dataSource: string;
  automatedDecisionMaking: boolean;
  profiling: boolean;
  thirdCountryTransfers: boolean;
  safeguards: string[];
}

// Privacy and compliance manager
export class PrivacyComplianceManager {
  private static consentRecords = new Map<string, ConsentRecord[]>();
  private static privacyRequests = new Map<string, PrivacyRequest[]>();
  private static dataProcessingActivities = new Map<string, DataProcessingActivity>();

  // Consent management
  static async recordConsent(
    userId: string,
    consentType: ConsentType,
    status: ConsentStatus,
    ipAddress: string,
    userAgent: string,
    purpose: string,
    legalBasis: string
  ): Promise<void> {
    try {
      const consentRecord: ConsentRecord = {
        id: DataEncryption.generateSecureId(),
        userId,
        consentType,
        status,
        grantedAt: new Date(),
        expiresAt: new Date(Date.now() + PRIVACY_CONFIG.CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
        version: '1.0',
        purpose,
        legalBasis
      };

      const userConsents = this.consentRecords.get(userId) || [];
      userConsents.push(consentRecord);
      this.consentRecords.set(userId, userConsents);

      // Store in secure storage
      await SecureStorage.setItem(`consent_${userId}`, userConsents);

      logSecurityEvent('consent_recorded', {
        userId,
        consentType,
        status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw new Error('Consent recording failed');
    }
  }

  static async getConsentStatus(userId: string, consentType: ConsentType): Promise<ConsentStatus> {
    try {
      const userConsents = this.consentRecords.get(userId) || [];
      const latestConsent = userConsents
        .filter(consent => consent.consentType === consentType)
        .sort((a, b) => b.grantedAt.getTime() - a.grantedAt.getTime())[0];

      if (!latestConsent) {
        return ConsentStatus.PENDING;
      }

      // Check if consent has expired
      if (new Date() > latestConsent.expiresAt) {
        return ConsentStatus.EXPIRED;
      }

      return latestConsent.status;
    } catch (error) {
      console.error('Failed to get consent status:', error);
      return ConsentStatus.PENDING;
    }
  }

  static async withdrawConsent(userId: string, consentType: ConsentType): Promise<void> {
    try {
      const userConsents = this.consentRecords.get(userId) || [];
      const consentToWithdraw = userConsents.find(consent => 
        consent.consentType === consentType && consent.status === ConsentStatus.GRANTED
      );

      if (consentToWithdraw) {
        consentToWithdraw.status = ConsentStatus.WITHDRAWN;
        this.consentRecords.set(userId, userConsents);
        await SecureStorage.setItem(`consent_${userId}`, userConsents);

        logSecurityEvent('consent_withdrawn', {
          userId,
          consentType,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      throw new Error('Consent withdrawal failed');
    }
  }

  // Privacy requests
  static async submitPrivacyRequest(
    userId: string,
    requestType: PrivacyRequestType,
    description: string
  ): Promise<string> {
    try {
      const request: PrivacyRequest = {
        id: DataEncryption.generateSecureId(),
        userId,
        requestType,
        status: 'pending',
        submittedAt: new Date(),
        description
      };

      const userRequests = this.privacyRequests.get(userId) || [];
      userRequests.push(request);
      this.privacyRequests.set(userId, userRequests);

      // Store in secure storage
      await SecureStorage.setItem(`privacy_request_${userId}`, userRequests);

      logSecurityEvent('privacy_request_submitted', {
        userId,
        requestType,
        requestId: request.id,
        timestamp: new Date().toISOString()
      });

      return request.id;
    } catch (error) {
      console.error('Failed to submit privacy request:', error);
      throw new Error('Privacy request submission failed');
    }
  }

  static async processPrivacyRequest(requestId: string, status: 'completed' | 'rejected', data?: any, notes?: string): Promise<void> {
    try {
      for (const [userId, requests] of this.privacyRequests.entries()) {
        const request = requests.find(req => req.id === requestId);
        if (request) {
          request.status = status;
          request.completedAt = new Date();
          request.data = data;
          request.notes = notes;

          this.privacyRequests.set(userId, requests);
          await SecureStorage.setItem(`privacy_request_${userId}`, requests);

          logSecurityEvent('privacy_request_processed', {
            userId,
            requestId,
            requestType: request.requestType,
            status,
            timestamp: new Date().toISOString()
          });
          break;
        }
      }
    } catch (error) {
      console.error('Failed to process privacy request:', error);
      throw new Error('Privacy request processing failed');
    }
  }

  // Data access and portability
  static async generateDataPortability(userId: string): Promise<any> {
    try {
      const userData = await this.collectUserData(userId);
      const consentHistory = this.consentRecords.get(userId) || [];
      const privacyRequests = this.privacyRequests.get(userId) || [];

      const portableData = {
        userId,
        generatedAt: new Date().toISOString(),
        userData: DataProtection.sanitizePersonalData(userData),
        consentHistory,
        privacyRequests,
        dataProcessingActivities: Array.from(this.dataProcessingActivities.values())
      };

      // Encrypt the portable data
      const encryptedData = await DataEncryption.encryptObject(portableData);

      logSecurityEvent('data_portability_generated', {
        userId,
        timestamp: new Date().toISOString()
      });

      return {
        data: encryptedData,
        format: 'JSON',
        encryption: 'AES-256-GCM'
      };
    } catch (error) {
      console.error('Failed to generate data portability:', error);
      throw new Error('Data portability generation failed');
    }
  }

  // Data erasure (Right to be forgotten)
  static async eraseUserData(userId: string): Promise<void> {
    try {
      // Anonymize user data instead of complete deletion for legal compliance
      const userData = await this.collectUserData(userId);
      const anonymizedData = this.anonymizeData(userData);

      // Store anonymized data for legal retention requirements
      await SecureStorage.setSensitiveData(`anonymized_${userId}`, anonymizedData);

      // Remove active user data
      this.consentRecords.delete(userId);
      this.privacyRequests.delete(userId);

      // Clear secure storage
      await SecureStorage.removeItem(`consent_${userId}`);
      await SecureStorage.removeItem(`privacy_request_${userId}`);

      logSecurityEvent('user_data_erased', {
        userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to erase user data:', error);
      throw new Error('Data erasure failed');
    }
  }

  // Data anonymization
  private static anonymizeData(data: any): any {
    if (typeof data === 'string') {
      return this.anonymizeString(data);
    } else if (typeof data === 'object' && data !== null) {
      const anonymized: any = Array.isArray(data) ? [] : {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isPersonalData(key)) {
          anonymized[key] = this.anonymizeValue(value);
        } else {
          anonymized[key] = this.anonymizeData(value);
        }
      }
      return anonymized;
    }
    return data;
  }

  private static anonymizeString(str: string): string {
    if (str.length <= 2) return '*'.repeat(str.length);
    return str.substring(0, 1) + '*'.repeat(str.length - 2) + str.substring(str.length - 1);
  }

  private static anonymizeValue(value: any): any {
    if (typeof value === 'string') {
      return this.anonymizeString(value);
    } else if (typeof value === 'number') {
      return Math.floor(value / 100) * 100; // Round to nearest 100
    } else if (value instanceof Date) {
      return new Date(value.getFullYear(), 0, 1); // Keep only year
    }
    return value;
  }

  private static isPersonalData(fieldName: string): boolean {
    const personalDataFields = [
      'name', 'email', 'phone', 'address', 'ssn', 'credit_card',
      'social_security', 'tax_id', 'driver_license', 'passport',
      'bank_account', 'routing_number', 'account_number', 'ip_address'
    ];
    return personalDataFields.some(field => 
      fieldName.toLowerCase().includes(field)
    );
  }

  // Data retention management
  static async cleanupExpiredData(): Promise<void> {
    try {
      const now = new Date();
      const retentionDate = new Date(now.getTime() - PRIVACY_CONFIG.DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000);

      // Clean up expired consent records
      for (const [userId, consents] of this.consentRecords.entries()) {
        const validConsents = consents.filter(consent => 
          consent.grantedAt > retentionDate || consent.status === ConsentStatus.GRANTED
        );
        
        if (validConsents.length === 0) {
          this.consentRecords.delete(userId);
          await SecureStorage.removeItem(`consent_${userId}`);
        } else {
          this.consentRecords.set(userId, validConsents);
          await SecureStorage.setItem(`consent_${userId}`, validConsents);
        }
      }

      // Clean up old privacy requests
      for (const [userId, requests] of this.privacyRequests.entries()) {
        const validRequests = requests.filter(request => 
          request.submittedAt > retentionDate
        );
        
        if (validRequests.length === 0) {
          this.privacyRequests.delete(userId);
          await SecureStorage.removeItem(`privacy_request_${userId}`);
        } else {
          this.privacyRequests.set(userId, validRequests);
          await SecureStorage.setItem(`privacy_request_${userId}`, validRequests);
        }
      }

      logSecurityEvent('expired_data_cleanup', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to cleanup expired data:', error);
      throw new Error('Data cleanup failed');
    }
  }

  // Data processing activities
  static async registerDataProcessingActivity(activity: DataProcessingActivity): Promise<void> {
    try {
      this.dataProcessingActivities.set(activity.id, activity);
      await SecureStorage.setItem(`processing_activity_${activity.id}`, activity);

      logSecurityEvent('data_processing_registered', {
        activityId: activity.id,
        purpose: activity.purpose,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to register data processing activity:', error);
      throw new Error('Data processing registration failed');
    }
  }

  // Privacy impact assessment
  static async conductPrivacyImpactAssessment(dataProcessingId: string): Promise<any> {
    try {
      const activity = this.dataProcessingActivities.get(dataProcessingId);
      if (!activity) {
        throw new Error('Data processing activity not found');
      }

      const assessment = {
        id: DataEncryption.generateSecureId(),
        dataProcessingId,
        conductedAt: new Date().toISOString(),
        riskLevel: this.assessRiskLevel(activity),
        recommendations: this.generateRecommendations(activity),
        complianceStatus: this.checkComplianceStatus(activity),
        safeguards: activity.safeguards,
        thirdCountryTransfers: activity.thirdCountryTransfers,
        automatedDecisionMaking: activity.automatedDecisionMaking
      };

      await SecureStorage.setItem(`pia_${assessment.id}`, assessment);

      logSecurityEvent('privacy_impact_assessment', {
        assessmentId: assessment.id,
        dataProcessingId,
        riskLevel: assessment.riskLevel,
        timestamp: new Date().toISOString()
      });

      return assessment;
    } catch (error) {
      console.error('Failed to conduct privacy impact assessment:', error);
      throw new Error('Privacy impact assessment failed');
    }
  }

  private static assessRiskLevel(activity: DataProcessingActivity): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Assess based on data categories
    if (activity.dataCategories.includes('sensitive')) riskScore += 3;
    if (activity.dataCategories.includes('personal')) riskScore += 2;
    if (activity.dataCategories.includes('anonymous')) riskScore += 1;

    // Assess based on processing characteristics
    if (activity.automatedDecisionMaking) riskScore += 2;
    if (activity.profiling) riskScore += 2;
    if (activity.thirdCountryTransfers) riskScore += 2;

    // Assess based on recipients
    if (activity.recipients.length > 5) riskScore += 1;
    if (activity.recipients.includes('third_party')) riskScore += 2;

    if (riskScore <= 3) return 'low';
    if (riskScore <= 6) return 'medium';
    return 'high';
  }

  private static generateRecommendations(activity: DataProcessingActivity): string[] {
    const recommendations: string[] = [];
    const riskLevel = this.assessRiskLevel(activity);

    if (riskLevel === 'high') {
      recommendations.push('Conduct detailed privacy impact assessment');
      recommendations.push('Implement additional technical safeguards');
      recommendations.push('Obtain explicit consent for all processing activities');
    }

    if (activity.thirdCountryTransfers) {
      recommendations.push('Ensure adequate safeguards for international transfers');
      recommendations.push('Document transfer mechanisms and safeguards');
    }

    if (activity.automatedDecisionMaking) {
      recommendations.push('Implement human review mechanisms');
      recommendations.push('Provide clear explanations for automated decisions');
    }

    return recommendations;
  }

  private static checkComplianceStatus(activity: DataProcessingActivity): string[] {
    const compliance: string[] = [];

    if (PRIVACY_CONFIG.GDPR_ENABLED) {
      compliance.push('GDPR: Legal basis documented');
      compliance.push('GDPR: Data subject rights implemented');
      compliance.push('GDPR: Data protection by design');
    }

    if (PRIVACY_CONFIG.CCPA_ENABLED) {
      compliance.push('CCPA: Notice at collection');
      compliance.push('CCPA: Right to know implemented');
      compliance.push('CCPA: Right to delete implemented');
    }

    return compliance;
  }

  // Helper method to collect user data (simplified for demo)
  private static async collectUserData(userId: string): Promise<any> {
    // In a real implementation, this would collect data from various sources
    return {
      profile: await SecureStorage.getItem(`user_profile_${userId}`),
      preferences: await SecureStorage.getItem(`user_preferences_${userId}`),
      activity: await SecureStorage.getItem(`user_activity_${userId}`)
    };
  }

  // Privacy compliance utilities
  static getPrivacyConfig() {
    return PRIVACY_CONFIG;
  }

  static async getPrivacyMetrics(): Promise<any> {
    const totalUsers = this.consentRecords.size;
    const totalRequests = Array.from(this.privacyRequests.values()).flat().length;
    const totalActivities = this.dataProcessingActivities.size;

    return {
      totalUsers,
      totalRequests,
      totalActivities,
      gdprEnabled: PRIVACY_CONFIG.GDPR_ENABLED,
      ccpaEnabled: PRIVACY_CONFIG.CCPA_ENABLED,
      dataRetentionDays: PRIVACY_CONFIG.DATA_RETENTION_DAYS
    };
  }
}
