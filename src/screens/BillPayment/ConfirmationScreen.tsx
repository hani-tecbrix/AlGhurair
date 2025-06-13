import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  Check, 
  ChevronRight,
  AlertTriangle,
  Lock,
  Receipt,
  Calendar,
  DollarSign,
  User,
  Building2,
  ArrowRight
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  name: string;
  details: string;
  icon: React.ElementType;
  balance?: string;
  fees?: string;
  processingTime: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Al Ghurair Wallet',
    details: 'Available Balance: AED 2,450.00',
    icon: Shield,
    balance: '2,450.00',
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'card1',
    type: 'card',
    name: 'ADCB Mastercard',
    details: '**** **** **** 1234',
    icon: CreditCard,
    fees: 'AED 2.00',
    processingTime: 'Instant'
  },
  {
    id: 'card2',
    type: 'card',
    name: 'Emirates NBD Visa',
    details: '**** **** **** 5678',
    icon: CreditCard,
    fees: 'AED 2.00',
    processingTime: 'Instant'
  }
];

export const ConfirmationScreen: React.FC = () => {
  const { navigateTo, screenParams } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const { biller, formData, billInfo } = screenParams || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("exchange");

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
  const totalAmount = formData?.amount ? parseFloat(formData.amount) : 0;
  const fees = selectedMethod?.fees === 'Free' ? 0 : parseFloat(selectedMethod?.fees?.replace('AED ', '') || '0');
  const finalAmount = totalAmount + fees;

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigateTo('bill-payment-success', {
        biller,
        formData,
        billInfo,
        paymentMethod: selectedMethod,
        transactionId: `BP${Date.now()}`,
        totalAmount: finalAmount,
        fees
      });
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (isProcessing) {
    return (
      <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
        {/* Header */}
        <header>
          <Header />
        </header>

        <main className="pt-20 pb-24 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 px-4"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-green-200 dark:border-green-800 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
              <Lock className="absolute inset-0 m-auto w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Processing Payment
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Please wait while we process your payment securely...
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Processing...</span>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer - Bottom Navigation */}
        <footer className="bottom-nav">
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </footer>
      </div>
    );
  }

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="bill-confirmation" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {t('billPayment.confirm')}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Review your payment details before confirming
              </p>
            </motion.div>

            {/* Bill Summary */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                                            <Building2 className="w-5 h-5 text-lime-500" />
                    <span>Bill Summary</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Biller</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        {biller?.name}
                      </span>
                    </div>
                    
                    {billInfo?.customerName && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Customer</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {billInfo.customerName}
                        </span>
                      </div>
                    )}
                    
                    {formData?.billNumber && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Bill Number</span>
                        <span className="font-mono text-zinc-900 dark:text-white">
                          {formData.billNumber}
                        </span>
                      </div>
                    )}

                    {formData?.mobileNumber && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Mobile Number</span>
                        <span className="font-mono text-zinc-900 dark:text-white">
                          {formData.mobileNumber}
                        </span>
                      </div>
                    )}

                    {formData?.plateNumber && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Plate Number</span>
                        <span className="font-mono text-zinc-900 dark:text-white">
                          {formData.plateNumber}
                        </span>
                      </div>
                    )}
                    
                    {billInfo?.dueDate && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Due Date</span>
                        <span className="text-zinc-900 dark:text-white">
                          {new Date(billInfo.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Methods */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-500" />
                    <span>Payment Method</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedPaymentMethod === method.id;
                      
                      return (
                        <motion.div
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-zinc-200 dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-700'
                            }`}
                          >
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-green-500' : 'text-zinc-400'}`} />
                                <div>
                                  <p className="font-medium text-zinc-900 dark:text-white">
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {method.details}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-zinc-500">
                                      Fee: {method.fees}
                                    </span>
                                    <span className="text-xs text-zinc-400">•</span>
                                    <span className="text-xs text-zinc-500">
                                      {method.processingTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                                isSelected 
                                  ? 'border-green-500 bg-green-500' 
                                  : 'border-zinc-300 dark:border-zinc-600'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white m-auto mt-0.5" />}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Amount Summary */}
            <motion.div variants={itemVariants}>
                              <Card className="bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span>Payment Summary</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Bill Amount</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        AED {totalAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Processing Fee</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        {fees > 0 ? `AED ${fees.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    
                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">Total Amount</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          AED {finalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Shield className="w-4 h-4" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </motion.div>

            {/* Confirm Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleConfirmPayment}
                disabled={!selectedPaymentMethod}
                                  className="w-full py-4 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5 mr-2" />
                Confirm Payment - AED {finalAmount.toFixed(2)}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Bottom Navigation */}
      <footer className="bottom-nav">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </footer>
    </div>
  );
}; 