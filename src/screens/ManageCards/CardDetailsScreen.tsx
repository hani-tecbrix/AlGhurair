import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Settings, 
  Lock, 
  Unlock,
  Heart,
  Star,
  Copy,
  CheckCircle,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Activity,
  Shield,
  Smartphone,
  Nfc,
  Download,
  Share2,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  MapPin,
  Receipt,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: string;
  currency: string;
  description: string;
  merchant: string;
  category: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  location?: string;
  icon: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'debit',
    amount: '45.00',
    currency: 'AED',
    description: 'Coffee & Breakfast',
    merchant: 'Starbucks Mall of Emirates',
    category: 'Food & Dining',
    date: '2024-01-10',
    time: '08:30 AM',
    status: 'completed',
    location: 'Dubai, UAE',
    icon: '☕'
  },
  {
    id: '2',
    type: 'debit',
    amount: '1,250.00',
    currency: 'AED',
    description: 'Grocery Shopping',
    merchant: 'Carrefour City Centre',
    category: 'Groceries',
    date: '2024-01-09',
    time: '07:15 PM',
    status: 'completed',
    location: 'Dubai, UAE',
    icon: '🛒'
  },
  {
    id: '3',
    type: 'credit',
    amount: '500.00',
    currency: 'AED',
    description: 'Cashback Reward',
    merchant: 'Al Ghurair Bank',
    category: 'Rewards',
    date: '2024-01-08',
    time: '12:00 PM',
    status: 'completed',
    icon: '🎁'
  },
  {
    id: '4',
    type: 'debit',
    amount: '85.50',
    currency: 'AED',
    description: 'Fuel Payment',
    merchant: 'ADNOC Station',
    category: 'Transportation',
    date: '2024-01-08',
    time: '09:45 AM',
    status: 'completed',
    location: 'Dubai, UAE',
    icon: '⛽'
  },
  {
    id: '5',
    type: 'debit',
    amount: '320.00',
    currency: 'AED',
    description: 'Online Purchase',
    merchant: 'Amazon.ae',
    category: 'Shopping',
    date: '2024-01-07',
    time: '03:20 PM',
    status: 'pending',
    icon: '📦'
  }
];

export const CardDetailsScreen: React.FC = () => {
  const { navigateTo, screenParams } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("exchange");
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock card data - in real app, fetch based on screenParams.cardId
  const cardData = {
    id: '1',
    type: 'credit',
    brand: 'visa',
    name: 'Al Ghurair Platinum',
    number: '4532123456789012',
    maskedNumber: '**** **** **** 9012',
    expiryDate: '12/26',
    balance: '15,750.00',
    availableCredit: '34,250.00',
    creditLimit: '50,000.00',
    currency: 'AED',
    isDefault: true,
    isBlocked: false,
    isFavorite: true,
    lastUsed: '2024-01-10',
    monthlySpend: '2,450.00',
    cardholderName: 'Ahmed Al Mansouri',
    status: 'active',
    features: ['contactless', 'premium', 'rewards'],
    color: 'gradient-gold',
    rewards: {
      pointsEarned: '1,250',
      cashbackEarned: '125.00',
      tier: 'Platinum'
    },
    limits: {
      dailyLimit: '10,000.00',
      monthlyLimit: '100,000.00',
      remainingDaily: '7,550.00',
      remainingMonthly: '97,550.00'
    }
  };

  const handleCopyCardNumber = async () => {
    if (showFullNumber) {
      await navigator.clipboard.writeText(cardData.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCardAction = (action: string) => {
    switch (action) {
      case 'edit':
        navigateTo('edit-card', { cardId: cardData.id });
        break;
      case 'settings':
        navigateTo('card-settings', { cardId: cardData.id });
        break;
      case 'block':
        // Handle block/unblock
        break;
      case 'favorite':
        // Handle favorite toggle
        break;
    }
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesFilter = transactionFilter === 'all' || transaction.type === transactionFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
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
        <div id="card-details" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Card Display */}
            <motion.div variants={cardVariants} className="perspective-1000">
              <motion.div
                className="relative p-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-xl text-white overflow-hidden"
                whileHover={{ 
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-8 -translate-y-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-6 translate-y-6" />
                </div>

                {/* Card Header */}
                <div className="relative flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">💳</span>
                      <div>
                        <h3 className="font-bold text-lg">{cardData.name}</h3>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-300" />
                          <span className="text-sm opacity-90 capitalize">{cardData.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center space-x-2">
                    {cardData.isFavorite && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="w-5 h-5 text-red-300 fill-current" />
                      </motion.div>
                    )}
                    {cardData.isDefault && (
                      <div className="px-2 py-1 bg-white/20 rounded-full">
                        <span className="text-xs font-medium">Default</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg tracking-wider">
                      {showFullNumber ? cardData.number.replace(/(.{4})/g, '$1 ').trim() : cardData.maskedNumber}
                    </span>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowFullNumber(!showFullNumber)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                      >
                        {showFullNumber ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                      {showFullNumber && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleCopyCardNumber}
                          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                        >
                          {copied ? (
                            <CheckCircle className="w-5 h-5 text-green-300" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-sm opacity-80">Available Balance</p>
                    <p className="text-xl font-bold">
                      {showBalance ? (
                        `${cardData.currency} ${cardData.balance}`
                      ) : (
                        '••••••'
                      )}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {showBalance ? 'Hide Balance' : 'Show Balance'}
                    </motion.button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Expires</p>
                    <p className="font-mono">{cardData.expiryDate}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="relative mt-4 flex items-center space-x-2">
                  {cardData.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-1">
                      {feature === 'contactless' && <Nfc className="w-4 h-4" />}
                      {feature === 'premium' && <Star className="w-4 h-4" />}
                      {feature === 'rewards' && <Zap className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <Card className="border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">This Month</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {cardData.currency} {cardData.monthlySpend}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Rewards</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {cardData.rewards.pointsEarned} pts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card Info Tabs */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Card className="border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Credit Limit</p>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {cardData.currency} {cardData.creditLimit}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Daily Limit</p>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {cardData.currency} {cardData.limits.dailyLimit}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Last Used</p>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {new Date(cardData.lastUsed).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleCardAction('settings')}
                variant="outline"
                className="py-3 border-zinc-300 dark:border-zinc-600 rounded-xl"
              >
                <Settings className="w-4 h-4 mr-2" />
                Card Settings
              </Button>
              
              <Button
                onClick={() => handleCardAction('block')}
                variant="outline"
                className={`py-3 rounded-xl ${
                  cardData.isBlocked 
                    ? 'border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    : 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                {cardData.isBlocked ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Unblock Card
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Block Card
                  </>
                )}
              </Button>
            </motion.div>

            {/* Transaction History */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Recent Transactions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 dark:text-green-400"
                >
                  View All
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-zinc-400`} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                <select
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value as any)}
                  className="px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl">{transaction.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-white">
                              {transaction.description}
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {transaction.merchant}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              <span className="text-xs text-zinc-500">
                                {transaction.time} • {new Date(transaction.date).toLocaleDateString()}
                              </span>
                              {transaction.location && (
                                <>
                                  <MapPin className="w-3 h-3 text-zinc-400" />
                                  <span className="text-xs text-zinc-500">{transaction.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'credit' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-zinc-900 dark:text-white'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{transaction.currency} {transaction.amount}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {transaction.type === 'credit' ? (
                              <ArrowDownLeft className="w-3 h-3 text-green-500" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTransactions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Receipt className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-600 dark:text-zinc-400">No transactions found</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Export Options */}
            <motion.div variants={itemVariants} className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 py-3 border-zinc-300 dark:border-zinc-600 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Statement
              </Button>
              <Button
                variant="outline"
                className="flex-1 py-3 border-zinc-300 dark:border-zinc-600 rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Details
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