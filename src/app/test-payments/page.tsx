"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { 
  DollarSign, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function TestPaymentsPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { toast } = useToast();
  const { currentUser, role } = useUser();

  const addTestResult = (test: string, status: 'pass' | 'fail', message: string) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Check if user is authenticated
      if (!currentUser) {
        addTestResult('Authentication', 'fail', 'User not authenticated');
        return;
      }
      addTestResult('Authentication', 'pass', `User authenticated as ${currentUser.name} (${role})`);

      // Test 2: Test payment intent creation
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 5000, // $50.00
            currency: 'usd',
            jobId: 'test-job-1',
            workerId: 'test-worker-1',
            hirerId: currentUser.id,
            description: 'Test payment for job completion',
          }),
        });

        const data = await response.json();

        if (response.ok && data.client_secret) {
          addTestResult('Payment Intent Creation', 'pass', 'Payment intent created successfully');
        } else {
          addTestResult('Payment Intent Creation', 'fail', data.error || 'Failed to create payment intent');
        }
      } catch (error) {
        addTestResult('Payment Intent Creation', 'fail', `Error: ${error}`);
      }

      // Test 3: Test payment statistics
      try {
        const response = await fetch(`/api/payments/stats?userId=${currentUser.id}&role=${role}`);
        const data = await response.json();

        if (response.ok) {
          addTestResult('Payment Statistics', 'pass', 'Payment statistics retrieved successfully');
        } else {
          addTestResult('Payment Statistics', 'fail', data.error || 'Failed to get payment statistics');
        }
      } catch (error) {
        addTestResult('Payment Statistics', 'fail', `Error: ${error}`);
      }

      // Test 4: Test transaction history
      try {
        const response = await fetch(`/api/payments/transactions?userId=${currentUser.id}&role=${role}`);
        const data = await response.json();

        if (response.ok) {
          addTestResult('Transaction History', 'pass', `Retrieved ${data.transactions?.length || 0} transactions`);
        } else {
          addTestResult('Transaction History', 'fail', data.error || 'Failed to get transaction history');
        }
      } catch (error) {
        addTestResult('Transaction History', 'fail', `Error: ${error}`);
      }

      // Test 5: Test escrow release (simulated)
      try {
        const response = await fetch('/api/payments/escrow/test-escrow/release', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            role: role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          addTestResult('Escrow Release', 'pass', 'Escrow release functionality working');
        } else {
          addTestResult('Escrow Release', 'fail', data.error || 'Failed to release escrow');
        }
      } catch (error) {
        addTestResult('Escrow Release', 'fail', `Error: ${error}`);
      }

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setShowPaymentForm(false);
    toast({
      title: 'Test Payment Successful!',
      description: 'Test payment has been processed successfully.',
    });
    addTestResult('Live Payment Test', 'pass', 'Payment processed successfully');
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Processing Test</h1>
          <p className="text-muted-foreground">
            Test the payment processing functionality to ensure Stripe integration and payment flows are working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Role:</strong> {role}</p>
                  <p><strong>ID:</strong> {currentUser.id}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not authenticated</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Stripe Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Secure Payment Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Escrow Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Transaction History</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Test Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentForm(true)}
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Test Payment Form
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link href="/payments">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Open Payments
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Payment Test */}
        {showPaymentForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Live Payment Test</CardTitle>
              <CardDescription>
                Test the payment form with a real Stripe integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm
                amount={5000} // $50.00
                jobId="test-job-1"
                workerId="test-worker-1"
                description="Test payment for job completion"
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from the latest test run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What's Working</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Stripe payment processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure payment forms
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Escrow management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Transaction tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Payment notifications
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Real-time payment processing
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Platform fee calculation
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Worker payout management
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Payment method management
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Refund processing
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
