// Payment service for handling secure payment processing
// In a real app, this would integrate with Stripe, PayPal, or similar payment processors

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  jobId: string;
  workerId: string;
  hirerId: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

export interface EscrowAccount {
  id: string;
  jobId: string;
  amount: number;
  currency: string;
  status: 'funded' | 'released' | 'refunded' | 'disputed';
  hirerId: string;
  workerId: string;
  createdAt: string;
  releasedAt?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export class PaymentService {
  // Mock payment methods for development
  private static mockPaymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true,
    },
    {
      id: 'pm_2',
      type: 'card',
      last4: '5555',
      brand: 'mastercard',
      isDefault: false,
    },
  ];

  // Mock payment intents
  private static mockPaymentIntents: PaymentIntent[] = [
    {
      id: 'pi_1',
      amount: 50000, // $500.00 in cents
      currency: 'usd',
      status: 'completed',
      jobId: '1',
      workerId: 'user1',
      hirerId: 'hirer1',
      description: 'Emergency Electrical Repair',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'pi_2',
      amount: 75000, // $750.00 in cents
      currency: 'usd',
      status: 'pending',
      jobId: '2',
      workerId: 'user1',
      hirerId: 'hirer2',
      description: 'Plumbing Repair - Leaky Faucet',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ];

  // Mock escrow accounts
  private static mockEscrowAccounts: EscrowAccount[] = [
    {
      id: 'escrow_1',
      jobId: '1',
      amount: 50000,
      currency: 'usd',
      status: 'released',
      hirerId: 'hirer1',
      workerId: 'user1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      releasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'escrow_2',
      jobId: '2',
      amount: 75000,
      currency: 'usd',
      status: 'funded',
      hirerId: 'hirer2',
      workerId: 'user1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ];

  // Get payment methods for a user
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockPaymentMethods;
  }

  // Create a payment intent for job completion
  static async createPaymentIntent(data: {
    amount: number;
    currency: string;
    jobId: string;
    workerId: string;
    hirerId: string;
    description: string;
  }): Promise<PaymentIntent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      jobId: data.jobId,
      workerId: data.workerId,
      hirerId: data.hirerId,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    this.mockPaymentIntents.push(paymentIntent);
    
    console.log('Created payment intent:', paymentIntent);
    return paymentIntent;
  }

  // Confirm payment intent
  static async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentIntent = this.mockPaymentIntents.find(pi => pi.id === paymentIntentId);
    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    paymentIntent.status = 'completed';
    paymentIntent.completedAt = new Date().toISOString();
    
    console.log('Confirmed payment intent:', paymentIntent);
    return paymentIntent;
  }

  // Create escrow account for job
  static async createEscrowAccount(data: {
    jobId: string;
    amount: number;
    currency: string;
    hirerId: string;
    workerId: string;
  }): Promise<EscrowAccount> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const escrowAccount: EscrowAccount = {
      id: `escrow_${Date.now()}`,
      jobId: data.jobId,
      amount: data.amount,
      currency: data.currency,
      status: 'funded',
      hirerId: data.hirerId,
      workerId: data.workerId,
      createdAt: new Date().toISOString(),
    };

    this.mockEscrowAccounts.push(escrowAccount);
    
    console.log('Created escrow account:', escrowAccount);
    return escrowAccount;
  }

  // Release escrow funds to worker
  static async releaseEscrow(escrowId: string): Promise<EscrowAccount> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const escrowAccount = this.mockEscrowAccounts.find(escrow => escrow.id === escrowId);
    if (!escrowAccount) {
      throw new Error('Escrow account not found');
    }

    escrowAccount.status = 'released';
    escrowAccount.releasedAt = new Date().toISOString();
    
    console.log('Released escrow:', escrowAccount);
    return escrowAccount;
  }

  // Get payment intents for a user
  static async getPaymentIntents(userId: string, role: 'hirer' | 'worker'): Promise<PaymentIntent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockPaymentIntents.filter(pi => 
      role === 'hirer' ? pi.hirerId === userId : pi.workerId === userId
    );
  }

  // Get escrow accounts for a user
  static async getEscrowAccounts(userId: string, role: 'hirer' | 'worker'): Promise<EscrowAccount[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockEscrowAccounts.filter(escrow => 
      role === 'hirer' ? escrow.hirerId === userId : escrow.workerId === userId
    );
  }

  // Get payment statistics
  static async getPaymentStats(userId: string): Promise<{
    totalEarned: number;
    totalPaid: number;
    pendingPayments: number;
    completedJobs: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const workerPayments = this.mockPaymentIntents.filter(pi => 
      pi.workerId === userId && pi.status === 'completed'
    );
    
    const hirerPayments = this.mockPaymentIntents.filter(pi => 
      pi.hirerId === userId && pi.status === 'completed'
    );

    return {
      totalEarned: workerPayments.reduce((sum, pi) => sum + pi.amount, 0),
      totalPaid: hirerPayments.reduce((sum, pi) => sum + pi.amount, 0),
      pendingPayments: this.mockPaymentIntents.filter(pi => 
        (pi.workerId === userId || pi.hirerId === userId) && pi.status === 'pending'
      ).length,
      completedJobs: workerPayments.length,
    };
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number, currency: string): { isValid: boolean; error?: string } {
    if (amount <= 0) {
      return { isValid: false, error: 'Payment amount must be greater than 0' };
    }

    if (currency !== 'usd') {
      return { isValid: false, error: 'Only USD currency is supported' };
    }

    if (amount > 1000000) { // $10,000 limit
      return { isValid: false, error: 'Payment amount exceeds maximum limit' };
    }

    return { isValid: true };
  }
} 