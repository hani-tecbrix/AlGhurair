import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigation } from "../../contexts/NavigationContext";
import { 
  ArrowLeft, 
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Send,
  Download,
  Share2,
  Home,
  Receipt,
  Loader2
} from "lucide-react";

type TransactionStatus = 'processing' | 'success' | 'failed';

interface TransactionResult {
  status: TransactionStatus;
  transactionId?: string;
  estimatedArrival?: string;
  errorMessage?: string;
}

export const ConfirmationScreen: React.FC = () => {
  const { goBack, navigateTo, screenParams } = useNavigation();
  const beneficiary = screenParams?.beneficiary;
  const transferData = screenParams?.transferData;

  const [transactionResult, setTransactionResult] = useState<TransactionResult>({
    status: 'processing'
  });

  useEffect(() => {
    // Simulate transaction processing
    const timer = setTimeout(() => {
      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setTransactionResult({
          status: 'success',
          transactionId: `TXN${Date.now()}`,
          estimatedArrival: 'Within 24 hours'
        });
      } else {
        setTransactionResult({
          status: 'failed',
          errorMessage: 'Transaction failed due to insufficient funds. Please try again.'
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigateTo('home');
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transfer Receipt',
        text: `Transfer of ${transferData?.amount} ${transferData?.fromCurrency} to ${beneficiary?.name} completed successfully.`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log('Share receipt');
    }
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currencies: { [key: string]: string } = {
      'AED': 'د.إ',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'SAR': 'ر.س',
      'INR': '₹'
    };
    
    const symbol = currencies[currencyCode] || currencyCode;
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 min-h-screen">
        {/* Header */}
        <motion.div
          className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {transactionResult.status === 'processing' ? (
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-zinc-500" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={transactionResult.status === 'failed' ? goBack : handleGoHome}
                  className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  {transactionResult.status === 'failed' ? <ArrowLeft className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {transactionResult.status === 'processing' && 'Processing Transfer'}
                  {transactionResult.status === 'success' && 'Transfer Successful'}
                  {transactionResult.status === 'failed' && 'Transfer Failed'}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {transactionResult.status === 'processing' && 'Please wait...'}
                  {transactionResult.status === 'success' && 'Money sent successfully'}
                  {transactionResult.status === 'failed' && 'Transaction could not be completed'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Processing State */}
            {transactionResult.status === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <Loader2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Processing Your Transfer
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
                    We're securely processing your transfer to {beneficiary?.name}. This usually takes a few moments.
                  </p>
                </div>

                <div className="w-full max-w-xs">
                  <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Shield className="w-4 h-4" />
                    <span>Secured by 256-bit encryption</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {transactionResult.status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>

                {/* Transaction Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Transfer Receipt</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(Number(transferData?.amount || 0), transferData?.fromCurrency || 'AED')}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        sent to {beneficiary?.name}
                      </p>
                    </div>

                    <div className="border-t border-b border-zinc-200 dark:border-zinc-600 py-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Transaction ID</span>
                        <span className="font-mono text-sm">{transactionResult.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Recipient</span>
                        <span className="font-medium">{beneficiary?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Bank</span>
                        <span className="font-medium">{beneficiary?.bank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Amount Sent</span>
                        <span className="font-medium">
                          {formatCurrency(Number(transferData?.amount || 0), transferData?.fromCurrency || 'AED')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Transfer Fee</span>
                        <span className="font-medium">
                          {formatCurrency(transferData?.fees || 0, transferData?.fromCurrency || 'AED')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Total Debited</span>
                        <span className="font-semibold">
                          {formatCurrency(transferData?.totalAmount || 0, transferData?.fromCurrency || 'AED')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Recipient Gets</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(transferData?.receivedAmount || 0, transferData?.toCurrency || 'USD')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Estimated Arrival</span>
                        <span className="font-medium">{transactionResult.estimatedArrival}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-green-700 dark:text-green-300 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Your money is on its way! You'll receive a notification when it arrives.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShareReceipt}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                </div>

                <Button
                  onClick={handleGoHome}
                  className="w-full"
                  size="lg"
                >
                  Back to Home
                </Button>
              </motion.div>
            )}

            {/* Failed State */}
            {transactionResult.status === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center py-8"
                >
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                </motion.div>

                {/* Error Message */}
                <Card className="border-red-200 dark:border-red-800">
                  <CardContent className="p-6 text-center space-y-4">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                      Transfer Failed
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {transactionResult.errorMessage}
                    </p>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        No money has been deducted from your account. Please check your account balance and try again.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={goBack}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoHome}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}; 