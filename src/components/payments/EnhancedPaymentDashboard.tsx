"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { PaymentForm } from './PaymentForm';
import { 
  DollarSign, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Wallet,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface PaymentStats {
  totalEarned: number;
  totalPaid: number;
  pendingPayments: number;
  completedJobs: number;
  thisMonth: number;
  lastMonth: number;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: 'payment' | 'escrow' | 'refund' | 'fee';
  jobId: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

export function EnhancedPaymentDashboard() {
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { currentUser, role } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchPaymentData();
    }
  }, [currentUser]);

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch payment statistics
      const statsResponse = await fetch(`/api/payments/stats?userId=${currentUser?.id}&role=${role}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setPaymentStats(statsData);
      }

      // Fetch transactions
      const transactionsResponse = await fetch(`/api/payments/transactions?userId=${currentUser?.id}&role=${role}`);
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      toast({
        title: 'Failed to load payment data',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setShowPaymentForm(false);
    setSelectedJob(null);
    fetchPaymentData(); // Refresh data
    toast({
      title: 'Payment Successful!',
      description: 'Your payment has been processed successfully.',
    });
  };

  const handleReleaseEscrow = async (escrowId: string) => {
    try {
      const response = await fetch(`/api/payments/escrow/${escrowId}/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          role: role,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Escrow Released',
          description: 'Escrow funds have been released successfully.',
        });
        fetchPaymentData(); // Refresh data
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Loader2 },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const iconConfig = {
      payment: DollarSign,
      escrow: Shield,
      refund: ArrowDownRight,
      fee: Banknote,
    };

    const Icon = iconConfig[type as keyof typeof iconConfig] || DollarSign;
    return <Icon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payment data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage your payments and transactions
          </p>
        </div>
        {role === 'hirer' && (
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogDescription>
                  Complete payment for a job
                </DialogDescription>
              </DialogHeader>
              {selectedJob && (
                <PaymentForm
                  amount={selectedJob.amount}
                  jobId={selectedJob.id}
                  workerId={selectedJob.workerId}
                  description={selectedJob.title}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentForm(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {role === 'worker' ? 'Total Earned' : 'Total Paid'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(role === 'worker' ? paymentStats.totalEarned : paymentStats.totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{formatAmount(paymentStats.thisMonth)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentStats.lastMonth > 0 
                  ? `${Math.round(((paymentStats.thisMonth - paymentStats.lastMonth) / paymentStats.lastMonth) * 100)}%`
                  : '0%'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                vs last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View all your payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="escrow">Escrow</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatAmount(transaction.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          Job #{transaction.jobId}
                        </p>
                      </div>
                      {getStatusBadge(transaction.status)}
                      {transaction.type === 'escrow' && transaction.status === 'pending' && role === 'hirer' && (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseEscrow(transaction.id)}
                        >
                          Release
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="space-y-4">
                {transactions
                  .filter(t => t.type === 'payment')
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Job #{transaction.jobId}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="escrow" className="space-y-4">
              <div className="space-y-4">
                {transactions
                  .filter(t => t.type === 'escrow')
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Job #{transaction.jobId}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                        {transaction.status === 'pending' && role === 'hirer' && (
                          <Button
                            size="sm"
                            onClick={() => handleReleaseEscrow(transaction.id)}
                          >
                            Release
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-4">
              <div className="space-y-4">
                {transactions
                  .filter(t => t.type === 'refund')
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <ArrowDownRight className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Job #{transaction.jobId}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
