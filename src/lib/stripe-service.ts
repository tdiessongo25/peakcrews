import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2024-12-18.acacia',
});

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: Stripe.PaymentIntent.Status;
  client_secret: string;
  jobId: string;
  workerId: string;
  hirerId: string;
  description: string;
  created: number;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  metadata: {
    userId: string;
    role: 'worker' | 'hirer';
  };
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
    email: string;
  };
}

export class StripeService {
  // Create a customer in Stripe
  static async createCustomer(data: {
    email: string;
    name: string;
    userId: string;
    role: 'worker' | 'hirer';
    phone?: string;
  }): Promise<StripeCustomer> {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: {
          userId: data.userId,
          role: data.role,
        },
      });

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || '',
        phone: customer.phone || undefined,
        metadata: {
          userId: data.userId,
          role: data.role,
        },
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  // Create a payment intent for job completion
  static async createPaymentIntent(data: {
    amount: number;
    currency: string;
    jobId: string;
    workerId: string;
    hirerId: string;
    description: string;
    customerId: string;
    applicationFeeAmount?: number;
  }): Promise<StripePaymentIntent> {
    try {
      // Validate amount
      if (data.amount <= 0) {
        throw new Error('Payment amount must be greater than 0');
      }

      // Calculate application fee (platform fee)
      const applicationFeeAmount = data.applicationFeeAmount || Math.round(data.amount * 0.05); // 5% platform fee

      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        customer: data.customerId,
        description: data.description,
        metadata: {
          jobId: data.jobId,
          workerId: data.workerId,
          hirerId: data.hirerId,
        },
        application_fee_amount: applicationFeeAmount,
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: data.workerId, // Worker's Stripe account ID
        },
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || '',
        jobId: data.jobId,
        workerId: data.workerId,
        hirerId: data.hirerId,
        description: data.description,
        created: paymentIntent.created,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm a payment intent
  static async confirmPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || '',
        jobId: paymentIntent.metadata.jobId || '',
        workerId: paymentIntent.metadata.workerId || '',
        hirerId: paymentIntent.metadata.hirerId || '',
        description: paymentIntent.description || '',
        created: paymentIntent.created,
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment intent');
    }
  }

  // Create a payment method
  static async createPaymentMethod(data: {
    type: 'card';
    card: {
      token: string;
    };
    billing_details: {
      name: string;
      email: string;
    };
  }): Promise<StripePaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: data.type,
        card: data.card,
        billing_details: data.billing_details,
      });

      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year,
        } : undefined,
        billing_details: {
          name: paymentMethod.billing_details?.name || '',
          email: paymentMethod.billing_details?.email || '',
        },
      };
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Failed to create payment method');
    }
  }

  // Attach payment method to customer
  static async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<void> {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw new Error('Failed to attach payment method');
    }
  }

  // Get customer's payment methods
  static async getCustomerPaymentMethods(customerId: string): Promise<StripePaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        } : undefined,
        billing_details: {
          name: pm.billing_details?.name || '',
          email: pm.billing_details?.email || '',
        },
      }));
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      throw new Error('Failed to get payment methods');
    }
  }

  // Create a refund
  static async createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    try {
      const refundData: any = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = amount;
      }

      const refund = await stripe.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  // Get payment intent details
  static async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || '',
        jobId: paymentIntent.metadata.jobId || '',
        workerId: paymentIntent.metadata.workerId || '',
        hirerId: paymentIntent.metadata.hirerId || '',
        description: paymentIntent.description || '',
        created: paymentIntent.created,
      };
    } catch (error) {
      console.error('Error getting payment intent:', error);
      throw new Error('Failed to get payment intent');
    }
  }

  // Create a transfer to worker's account
  static async createTransfer(data: {
    amount: number;
    currency: string;
    destination: string; // Worker's Stripe account ID
    description: string;
    metadata: {
      jobId: string;
      workerId: string;
      hirerId: string;
    };
  }): Promise<Stripe.Transfer> {
    try {
      const transfer = await stripe.transfers.create({
        amount: data.amount,
        currency: data.currency,
        destination: data.destination,
        description: data.description,
        metadata: data.metadata,
      });

      return transfer;
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw new Error('Failed to create transfer');
    }
  }

  // Create a connected account for workers
  static async createConnectedAccount(data: {
    type: 'express' | 'standard';
    country: string;
    email: string;
    business_type: 'individual' | 'company';
    capabilities: {
      card_payments: { requested: boolean };
      transfers: { requested: boolean };
    };
  }): Promise<Stripe.Account> {
    try {
      const account = await stripe.accounts.create({
        type: data.type,
        country: data.country,
        email: data.email,
        business_type: data.business_type,
        capabilities: data.capabilities,
      });

      return account;
    } catch (error) {
      console.error('Error creating connected account:', error);
      throw new Error('Failed to create connected account');
    }
  }

  // Get account link for onboarding
  static async createAccountLink(data: {
    account: string;
    refresh_url: string;
    return_url: string;
    type: 'account_onboarding' | 'account_update';
  }): Promise<Stripe.AccountLink> {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: data.account,
        refresh_url: data.refresh_url,
        return_url: data.return_url,
        type: data.type,
      });

      return accountLink;
    } catch (error) {
      console.error('Error creating account link:', error);
      throw new Error('Failed to create account link');
    }
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

  // Calculate platform fee
  static calculatePlatformFee(amount: number, feePercentage: number = 0.05): number {
    return Math.round(amount * feePercentage);
  }

  // Calculate worker payout
  static calculateWorkerPayout(amount: number, feePercentage: number = 0.05): number {
    const platformFee = this.calculatePlatformFee(amount, feePercentage);
    return amount - platformFee;
  }
}
