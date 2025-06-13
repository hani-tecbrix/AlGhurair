import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  MessageCircle,
  Copy,
  Receipt,
  RefreshCw,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Zap,
  Shield,
  Bell,
  Share2,
  Download,
  ArrowRight,
  ArrowLeft,
  Info,
  QrCode,
  Eye,
  History,
  Star,
  Smartphone
} from 'lucide-react';

interface TransactionStatus {
  id: string;
  referenceNumber: string;
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'pending_verification';
  amount: string;
  currency: string;
  fromAccount: string;
  toAccount: string;
  recipientName: string;
  recipientBank: string;
  recipientIban?: string;
  purpose: string;
  initiatedAt: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  statusHistory: {
    status: string;
    timestamp: string;
    description: string;
    location?: string;
  }[];
  fees: {
    transferFee: string;
    exchangeRate?: string;
    totalCharges: string;
  };
  notifications: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
}

const mockTransactionData: TransactionStatus = {
  id: 'TXN-2024-001234567',
  referenceNumber: 'AG240110001234',
  status: 'processing',
  amount: '2,500.00',
  currency: 'AED',
  fromAccount: 'Al Ghurair Current Account ****9012',
  toAccount: 'Emirates NBD ****5678',
  recipientName: 'Sara Ahmed Al Zahra',
  recipientBank: 'Emirates NBD Bank',
  recipientIban: 'AE070331234567890123456',
  purpose: 'Monthly Allowance',
  initiatedAt: '2024-01-10 14:30:00',
  estimatedCompletion: '2024-01-10 16:30:00',
  statusHistory: [
    {
      status: 'initiated',
      timestamp: '2024-01-10 14:30:00',
      description: 'Transaction initiated successfully',
      location: 'Dubai, UAE'
    },
    {
      status: 'verification_completed',
      timestamp: '2024-01-10 14:32:15',
      description: 'Identity verification completed',
      location: 'Al Ghurair Bank Processing Center'
    },
    {
      status: 'processing',
      timestamp: '2024-01-10 14:35:00',
      description: 'Funds debited from sender account',
      location: 'Al Ghurair Bank Processing Center'
    },
    {
      status: 'in_transit',
      timestamp: '2024-01-10 15:15:00',
      description: 'Transfer in progress to recipient bank',
      location: 'UAE Banking Network'
    }
  ],
  fees: {
    transferFee: '5.00',
    exchangeRate: '1.00',
    totalCharges: '5.00'
  },
  notifications: {
    sms: true,
    email: true,
    push: true
  }
};

const recentTransactions = [
  {
    id: 'TXN-2024-001234566',
    referenceNumber: 'AG240109001233',
    status: 'completed',
    amount: '1,000.00',
    currency: 'AED',
    recipientName: 'Mohammed Hassan',
    completedAt: '2024-01-09 16:45:00'
  },
  {
    id: 'TXN-2024-001234565',
    referenceNumber: 'AG240108001232',
    status: 'completed',
    amount: '750.00',
    currency: 'AED',
    recipientName: 'Fatima Al Rashid',
    completedAt: '2024-01-08 11:20:00'
  }
];

export const TransactionTrackScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("exchange");
  const [searchMode, setSearchMode] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [transactionData, setTransactionData] = useState<TransactionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (autoRefresh && transactionData && transactionData.status === 'processing') {
      const interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Auto-refreshing transaction status...');
      }, 10000); // Refresh every 10 seconds
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, transactionData]);

  const handleSearch = async () => {
    if (!referenceNumber.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (referenceNumber === 'AG240110001234' || referenceNumber === mockTransactionData.id) {
      setTransactionData(mockTransactionData);
      setSearchMode(false);
    } else {
      // Show error for invalid reference
      alert('Transaction not found. Please check your reference number.');
    }
    
    setIsLoading(false);
  };

  const handleCopyReference = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated': return Clock;
      case 'processing': return RefreshCw;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      case 'cancelled': return XCircle;
      case 'pending_verification': return Shield;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
              case 'initiated': return 'text-lime-500 bg-lime-50 border-lime-200';
      case 'processing': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-green-500 bg-green-50 border-green-200';
      case 'failed': return 'text-red-500 bg-red-50 border-red-200';
      case 'cancelled': return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'pending_verification': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'initiated': return 25;
      case 'processing': return 75;
      case 'completed': return 100;
      case 'failed': return 100;
      case 'cancelled': return 100;
      case 'pending_verification': return 50;
      default: return 0;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  if (!searchMode && transactionData) {
    return (
      <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
        <header>
          <Header />
        </header>

        <main>
          <div id="transaction-track" className="screen pt-20 pb-24 px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <Button
                  onClick={() => setSearchMode(true)}
                  variant="ghost"
                  className="p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Transaction Status
                </h1>
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  variant="ghost"
                  className={`p-2 ${autoRefresh ? 'text-green-600' : 'text-zinc-600'}`}
                >
                  <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                </Button>
              </motion.div>

              {/* Status Overview */}
              <motion.div variants={itemVariants}>
                <Card className="border-zinc-200 dark:border-zinc-700 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Status Header */}
                    <div className={`px-6 py-4 ${getStatusColor(transactionData.status)} border-b`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {React.createElement(getStatusIcon(transactionData.status), {
                            className: `w-6 h-6 ${transactionData.status === 'processing' ? 'animate-spin' : ''}`
                          })}
                          <div>
                            <h3 className="font-bold text-lg capitalize">
                              {transactionData.status.replace('_', ' ')}
                            </h3>
                            <p className="text-sm opacity-80">
                              {transactionData.status === 'processing' ? 'Transfer in progress...' : 
                               transactionData.status === 'completed' ? 'Transfer completed successfully' :
                               transactionData.status === 'failed' ? 'Transfer failed' :
                               'Transfer initiated'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl">
                            {transactionData.currency} {transactionData.amount}
                          </p>
                          <p className="text-sm opacity-80">Amount</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4 bg-white dark:bg-zinc-800">
                      <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        <span>Progress</span>
                        <span>{getProgressPercentage(transactionData.status)}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            transactionData.status === 'completed' ? 'bg-green-500' :
                            transactionData.status === 'failed' ? 'bg-red-500' :
                            'bg-lime-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(transactionData.status)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="px-6 py-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Reference Number</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-mono font-medium text-zinc-900 dark:text-white">
                              {transactionData.referenceNumber}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopyReference(transactionData.referenceNumber)}
                              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                            >
                              {copied ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-zinc-400" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Estimated Time</p>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {new Date(transactionData.estimatedCompletion).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Recipient</p>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {transactionData.recipientName}
                            </p>
                            <p className="text-sm text-zinc-500">{transactionData.recipientBank}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">From Account</p>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {transactionData.fromAccount}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Initiated</p>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {new Date(transactionData.initiatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex-col space-y-1 h-auto py-3"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">Details</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-col space-y-1 h-auto py-3"
                >
                  <Receipt className="w-5 h-5" />
                  <span className="text-xs">Receipt</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-col space-y-1 h-auto py-3"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs">Share</span>
                </Button>
              </motion.div>

              {/* Transaction History */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    variants={itemVariants}
                  >
                    <Card className="border-zinc-200 dark:border-zinc-700">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                          Transaction Timeline
                        </h3>
                        <div className="space-y-4">
                          {transactionData.statusHistory.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {item.description}
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-zinc-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                                  {item.location && (
                                    <>
                                      <MapPin className="w-3 h-3" />
                                      <span>{item.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          
                          {/* Future Steps */}
                          {transactionData.status === 'processing' && (
                            <motion.div
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  Processing transfer to recipient bank
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-zinc-500">
                                  <Clock className="w-3 h-3" />
                                  <span>In progress...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Support */}
              <motion.div variants={itemVariants}>
                <Card className="border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-lime-600" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">Need Help?</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Contact our support team
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notifications Settings */}
              <motion.div variants={itemVariants}>
                <Card className="border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-3">
                      Notification Preferences
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                          <span className="text-sm">SMS Updates</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          transactionData.notifications.sms ? 'bg-green-500' : 'bg-zinc-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            transactionData.notifications.sms ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                          <span className="text-sm">Push Notifications</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          transactionData.notifications.push ? 'bg-green-500' : 'bg-zinc-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            transactionData.notifications.push ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>

        <footer className="bottom-nav">
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </footer>
      </div>
    );
  }

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      <header>
        <Header />
      </header>

      <main>
        <div id="transaction-track" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Track Your Transfer
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Enter your reference number to track transfer status
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div variants={itemVariants}>
              <Card className="border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Reference Number
                    </label>
                    <div className="relative">
                      <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-zinc-400`} />
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                        placeholder="AG240110001234 or TXN-2024-001234567"
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-zinc-800`}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Enter the reference number from your transfer confirmation
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSearch}
                      disabled={!referenceNumber.trim() || isLoading}
                      className="w-full py-3 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white rounded-xl disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Searching...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Search className="w-4 h-4" />
                          <span>Track Transfer</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      className="text-lime-600 dark:text-lime-400"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Transfers */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Recent Transfers
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 cursor-pointer"
                    onClick={() => {
                      setReferenceNumber(transaction.referenceNumber);
                      handleSearch();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {transaction.recipientName}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {transaction.referenceNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {transaction.currency} {transaction.amount}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 capitalize">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Help & Support */}
            <motion.div variants={itemVariants}>
                                <Card className="border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-lime-50 to-indigo-100 dark:from-lime-900/20 dark:to-indigo-900/20">
                <CardContent className="p-6 text-center space-y-3">
                                      <div className="w-12 h-12 bg-lime-600 rounded-xl flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Need Help?
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Can't find your transaction? Our support team is here to help 24/7
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Shield className="w-4 h-4" />
                <span>Your transaction data is encrypted and secure</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="bottom-nav">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </footer>
    </div>
  );
}; 