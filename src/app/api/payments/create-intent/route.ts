import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe-service';
import { cursorClient } from '@/lib/cursor-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, jobId, workerId, hirerId, description } = body;

    // Validate required fields
    if (!amount || !currency || !jobId || !workerId || !hirerId || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment amount
    const validation = StripeService.validatePaymentAmount(amount, currency);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get or create customer for hirer
    let customer;
    try {
      const hirer = await cursorClient.getUser(hirerId);
      customer = await StripeService.createCustomer({
        email: hirer.email,
        name: hirer.name,
        userId: hirerId,
        role: 'hirer',
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    // Get worker's Stripe account ID (in a real app, this would be stored in the user profile)
    const workerStripeAccountId = 'acct_worker_test'; // This should come from worker's profile

    // Create payment intent
    const paymentIntent = await StripeService.createPaymentIntent({
      amount,
      currency,
      jobId,
      workerId,
      hirerId,
      description,
      customerId: customer.id,
      applicationFeeAmount: StripeService.calculatePlatformFee(amount),
    });

    return NextResponse.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Failed to create payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
