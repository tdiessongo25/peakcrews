"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  DollarSign, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import type { PaymentIntent, EscrowAccount } from '@/lib/payment-service';

interface PaymentStats {
  totalEarned: number;
  totalPaid: number;
  pendingPayments: number;
  completedJobs: number;
}

export function PaymentDashboard() {
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchPayments();
    }
  }, [currentUser]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/payments?userId=${currentUser?.id}&role=${currentUser?.role}`);
      
      if (response.ok) {
        const data = await response.json();
        setPaymentIntents(data.paymentIntents);
        setEscrowAccounts(data.escrowAccounts);
        setPaymentStats(data.paymentStats);
      } else {
        toast({
          title: 'Failed to load payments',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast({
        title: 'Failed to load payments',
        description: 'An error occurred while loading payment data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (response.ok) {
        toast({
          title: 'Payment Confirmed',
          description: 'Payment has been successfully confirmed.',
        });
        fetchPayments(); // Refresh data
      } else {
        toast({
          title: 'Failed to confirm payment',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      toast({
        title: 'Failed to confirm payment',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleReleaseEscrow = async (escrowId: string) => {
    try {
      const response = await fetch(`/api/payments/escrow/${escrowId}/release`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Escrow Released',
          description: 'Funds have been released to the worker.',
        });
        fetchPayments(); // Refresh data
      } else {
        toast({
          title: 'Failed to release escrow',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to release escrow:', error);
      toast({
        title: 'Failed to release escrow',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert cents to dollars
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'released':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
      case 'funded':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
      case 'disputed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need to be logged in to view your payments.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage your payments, escrow accounts, and financial activity
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading payment data...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Payment Statistics */}
          {paymentStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">{formatCurrency(paymentStats.totalEarned)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                      <p className="text-2xl font-bold">{formatCurrency(paymentStats.totalPaid)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                      <p className="text-2xl font-bold">{paymentStats.pendingPayments}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
                      <p className="text-2xl font-bold">{paymentStats.completedJobs}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Tabs */}
          <Tabs defaultValue="payments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment History
              </TabsTrigger>
              <TabsTrigger value="escrow" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Escrow Accounts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="space-y-4">
              {paymentIntents.length > 0 ? (
                <div className="space-y-4">
                  {paymentIntents.map((payment) => (
                    <Card key={payment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{payment.description}</h3>
                              {getStatusBadge(payment.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Job ID: {payment.jobId} • {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{formatCurrency(payment.amount)}</span>
                              {payment.completedAt && (
                                <span className="text-muted-foreground">
                                  Completed: {new Date(payment.completedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {payment.status === 'pending' && currentUser.role === 'hirer' && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmPayment(payment.id)}
                              >
                                Confirm Payment
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                    <p className="text-muted-foreground">
                      You haven't made any payments yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="escrow" className="space-y-4">
              {escrowAccounts.length > 0 ? (
                <div className="space-y-4">
                  {escrowAccounts.map((escrow) => (
                    <Card key={escrow.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">Escrow for Job {escrow.jobId}</h3>
                              {getStatusBadge(escrow.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Created: {new Date(escrow.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{formatCurrency(escrow.amount)}</span>
                              {escrow.releasedAt && (
                                <span className="text-muted-foreground">
                                  Released: {new Date(escrow.releasedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {escrow.status === 'funded' && currentUser.role === 'hirer' && (
                              <Button
                                size="sm"
                                onClick={() => handleReleaseEscrow(escrow.id)}
                              >
                                Release Funds
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Escrow Accounts</h3>
                    <p className="text-muted-foreground">
                      You don't have any escrow accounts yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 