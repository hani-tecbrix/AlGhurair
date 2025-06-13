import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Calendar, 
  Copy,
  Home,
  RefreshCw,
  Receipt,
  Building2,
  CreditCard,
  DollarSign,
  Clock,
  User,
  Star,
  Sparkles
} from 'lucide-react';

export const SuccessScreen: React.FC = () => {
  const { navigateTo, screenParams, resetNavigation } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const { 
    biller, 
    formData, 
    billInfo, 
    paymentMethod, 
    transactionId, 
    totalAmount, 
    fees 
  } = screenParams || {};

  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [activeTab, setActiveTab] = useState("exchange");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyTransactionId = async () => {
    if (transactionId) {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    console.log('Downloading receipt...');
  };

  const handleShareReceipt = () => {
    // Simulate sharing
    if (navigator.share) {
      navigator.share({
        title: 'Bill Payment Receipt',
        text: `Payment successful for ${biller?.name}. Transaction ID: ${transactionId}`,
      });
    }
  };

  const handlePayAnother = () => {
    navigateTo('bill-payment');
  };

  const handleGoHome = () => {
    resetNavigation();
  };

  const handleSetReminder = () => {
    // Simulate setting reminder
    console.log('Setting reminder...');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const successIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.1
      }
    }
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="bill-success" className="screen pt-20 pb-24 px-4 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-950/20 dark:to-green-900/20 relative overflow-hidden">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-lime-500 rounded-full"
                  initial={{
                    x: Math.random() * 300,
                    y: -20,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{
                    y: 600,
                    rotate: 360,
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Success Header */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <motion.div
                variants={successIconVariants}
                className="relative w-24 h-24 mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl"></div>
                <div className="absolute inset-2 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border-4 border-transparent border-t-green-400 rounded-full"
                />
              </motion.div>
              
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold text-green-800 dark:text-green-400"
                >
                  {t('success.paymentCompleted')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-zinc-600 dark:text-zinc-400"
                >
                  {t('success.billPaid')}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                                  className="inline-block bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg"
              >
                AED {totalAmount?.toFixed(2) || '0.00'}
              </motion.div>
            </motion.div>

            {/* Transaction Details */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <Receipt className="w-5 h-5 text-green-500" />
                    <span>Transaction Details</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Transaction ID</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-zinc-900 dark:text-white">
                          {transactionId}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleCopyTransactionId}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-zinc-400" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Biller</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        {biller?.name}
                      </span>
                    </div>
                    
                    {billInfo?.customerName && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Customer</span>
                        <span className="text-zinc-900 dark:text-white">
                          {billInfo.customerName}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Payment Method</span>
                      <span className="text-zinc-900 dark:text-white">
                        {paymentMethod?.name}
                      </span>
                    </div>
                    
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">Date & Time</span>
                      <span className="text-zinc-900 dark:text-white">
                        {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {fees > 0 && (
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">Processing Fee</span>
                        <span className="text-zinc-900 dark:text-white">
                          AED {fees.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="w-full py-3 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleShareReceipt}
                  variant="outline"
                  className="w-full py-3 border-lime-500 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20 rounded-xl"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Receipt
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Quick Actions</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handlePayAnother}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Pay Another Bill
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSetReminder}
                    variant="outline"
                    className="w-full py-3 border-zinc-300 dark:border-zinc-600 rounded-xl"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Set Payment Reminder
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleGoHome}
                    variant="ghost"
                    className="w-full py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Success Animation */}
            <motion.div
              variants={itemVariants}
              className="text-center pt-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
              </motion.div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Thank you for using Al Ghurair Exchange
              </p>
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