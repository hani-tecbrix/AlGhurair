import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useNavigation } from "../../contexts/NavigationContext";
import { 
  ArrowLeft, 
  DollarSign,
  TrendingUp,
  Calculator,
  Send,
  AlertCircle,
  Info,
  User
} from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate to AED
}

interface TransferData {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  reason: string;
  fees: number;
  exchangeRate: number;
  totalAmount: number;
  receivedAmount: number;
}

const currencies: Currency[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 3.67 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 4.01 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 4.64 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 0.98 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 0.044 },
];

const transferReasons = [
  'Family Support',
  'Business Payment',
  'Personal Transfer',
  'Education Fees',
  'Medical Expenses',
  'Property Purchase',
  'Investment',
  'Other'
];

export const AmountScreen: React.FC = () => {
  const { goBack, navigateTo, screenParams } = useNavigation();
  const beneficiary = screenParams?.beneficiary;

  const [transferData, setTransferData] = useState<TransferData>({
    fromCurrency: 'AED',
    toCurrency: 'USD',
    amount: '',
    reason: '',
    fees: 25,
    exchangeRate: 3.67,
    totalAmount: 0,
    receivedAmount: 0
  });

  const [error, setError] = useState<string | null>(null);

  const fromCurrency = currencies.find(c => c.code === transferData.fromCurrency);
  const toCurrency = currencies.find(c => c.code === transferData.toCurrency);

  useEffect(() => {
    calculateTransfer();
  }, [transferData.amount, transferData.fromCurrency, transferData.toCurrency]);

  const calculateTransfer = () => {
    if (!transferData.amount || isNaN(Number(transferData.amount))) {
      setTransferData(prev => ({
        ...prev,
        totalAmount: 0,
        receivedAmount: 0
      }));
      return;
    }

    const amount = Number(transferData.amount);
    const fromRate = fromCurrency?.rate || 1;
    const toRate = toCurrency?.rate || 1;
    const exchangeRate = fromRate / toRate;
    
    const fees = amount > 1000 ? 25 : 15; // Different fee structure
    const totalAmount = amount + fees;
    const receivedAmount = amount * exchangeRate;

    setTransferData(prev => ({
      ...prev,
      fees,
      exchangeRate,
      totalAmount,
      receivedAmount
    }));
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    
    // Limit to 2 decimal places
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    
    setTransferData(prev => ({ ...prev, amount: cleanValue }));
    setError(null);
  };

  const handleSendMoney = () => {
    setError(null);

    if (!transferData.amount || Number(transferData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(transferData.amount) < 10) {
      setError('Minimum transfer amount is 10');
      return;
    }

    if (Number(transferData.amount) > 50000) {
      setError('Maximum transfer amount is 50,000 per transaction');
      return;
    }

    if (!transferData.reason) {
      setError('Please select a reason for transfer');
      return;
    }

    // Navigate to confirmation screen
    navigateTo('send-money-confirmation', {
      beneficiary,
      transferData
    });
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    return `${currency.symbol}${amount.toLocaleString('en-US', { 
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
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Send Money
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Enter amount and details
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Beneficiary Info */}
          {beneficiary && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {beneficiary.name}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {beneficiary.bank} • {beneficiary.accountNumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Amount Input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Transfer Amount</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Currency Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <Select 
                      value={transferData.fromCurrency} 
                      onValueChange={(value) => setTransferData(prev => ({ ...prev, fromCurrency: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To</Label>
                    <Select 
                      value={transferData.toCurrency} 
                      onValueChange={(value) => setTransferData(prev => ({ ...prev, toCurrency: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <Label>Amount to Send</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                      {fromCurrency?.symbol}
                    </span>
                    <Input
                      placeholder="0.00"
                      value={transferData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pl-8 text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Exchange Rate Info */}
                {transferData.amount && Number(transferData.amount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>Exchange Rate</span>
                      </span>
                      <span className="font-medium">
                        1 {transferData.fromCurrency} = {transferData.exchangeRate.toFixed(4)} {transferData.toCurrency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Recipient gets</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(transferData.receivedAmount, toCurrency!)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Transfer Reason */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Transfer Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={transferData.reason} 
                  onValueChange={(value) => setTransferData(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {transferReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transfer Summary */}
          {transferData.amount && Number(transferData.amount) > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span>Transfer Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Send Amount</span>
                    <span className="font-medium">
                      {formatCurrency(Number(transferData.amount), fromCurrency!)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer Fee</span>
                    <span className="font-medium">
                      {formatCurrency(transferData.fees, fromCurrency!)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-600 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Debit</span>
                      <span>
                        {formatCurrency(transferData.totalAmount, fromCurrency!)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Recipient Receives</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {formatCurrency(transferData.receivedAmount, toCurrency!)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Important Notice */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
                              <Info className="w-5 h-5 text-lime-600 dark:text-lime-400 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-lime-700 dark:text-lime-300">
                <p className="font-medium mb-1">Important Information</p>
                <ul className="space-y-1 text-xs">
                  <li>• Exchange rates are updated in real-time</li>
                  <li>• Transfer fees vary based on amount and destination</li>
                  <li>• Transfers are typically processed within 24 hours</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Send Money Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pb-4"
          >
            <Button
              onClick={handleSendMoney}
              disabled={!transferData.amount || !transferData.reason || Number(transferData.amount) <= 0}
              className="w-full py-4 text-lg font-semibold"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Money
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 