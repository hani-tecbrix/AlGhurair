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
  Filter, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Edit3,
  MoreVertical,
  Download,
  Share2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  categoryIcon: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  reference?: string;
  tags: string[];
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    category: 'Shopping',
    categoryIcon: '🛍️',
    amount: 254.50,
    currency: 'AED',
    description: 'Mall of Emirates Shopping',
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    merchant: 'Mall of Emirates',
    reference: 'TXN-2024-001',
    tags: ['retail', 'weekend']
  },
  {
    id: '2',
    type: 'income',
    category: 'Salary',
    categoryIcon: '💰',
    amount: 8500.00,
    currency: 'AED',
    description: 'Monthly Salary',
    date: '2024-01-01T09:00:00Z',
    status: 'completed',
    merchant: 'Al Ghurair Exchange',
    reference: 'SAL-2024-001',
    tags: ['salary', 'monthly']
  },
  {
    id: '3',
    type: 'transfer',
    category: 'Bill Payment',
    categoryIcon: '💳',
    amount: 450.00,
    currency: 'AED',
    description: 'DEWA Electricity Bill',
    date: '2024-01-14T15:45:00Z',
    status: 'pending',
    merchant: 'DEWA',
    reference: 'BILL-2024-003',
    tags: ['utilities', 'bills']
  },
  {
    id: '4',
    type: 'expense',
    category: 'Food',
    categoryIcon: '🍽️',
    amount: 125.75,
    currency: 'AED',
    description: 'Dinner at Marina Walk',
    date: '2024-01-13T19:20:00Z',
    status: 'completed',
    merchant: 'Marina Restaurant',
    reference: 'TXN-2024-004',
    tags: ['dining', 'evening']
  },
  {
    id: '5',
    type: 'transfer',
    category: 'Send Money',
    categoryIcon: '📤',
    amount: 1200.00,
    currency: 'AED',
    description: 'Money Transfer to India',
    date: '2024-01-12T11:15:00Z',
    status: 'completed',
    merchant: 'Al Ghurair Exchange',
    reference: 'REM-2024-005',
    tags: ['remittance', 'family']
  }
];

const filterOptions = [
  { id: 'all', labelKey: 'All Transactions', icon: '📊' },
  { id: 'income', labelKey: 'Income', icon: '💰' },
  { id: 'expense', labelKey: 'Expenses', icon: '💸' },
  { id: 'transfer', labelKey: 'Transfers', icon: '🔄' }
];

const timeFilters = [
  { id: 'today', labelKey: 'Today' },
  { id: 'week', labelKey: 'This Week' },
  { id: 'month', labelKey: 'This Month' },
  { id: 'year', labelKey: 'This Year' },
  { id: 'custom', labelKey: 'Custom Range' }
];

export const TransactionTrackerScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("tracker");
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedFilter);
    }

    // Apply time filter
    const now = new Date();
    if (selectedTimeFilter !== 'custom') {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        switch (selectedTimeFilter) {
          case 'today':
            return transactionDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'month':
            return transactionDate.getMonth() === now.getMonth() && 
                   transactionDate.getFullYear() === now.getFullYear();
          case 'year':
            return transactionDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, selectedFilter, selectedTimeFilter, transactions]);

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'expense':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-lime-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number, type: Transaction['type']) => {
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    const colorClass = type === 'income' ? 'text-green-600 dark:text-green-400' : 
                      type === 'expense' ? 'text-red-600 dark:text-red-400' : 
                      'text-lime-600 dark:text-lime-400';
    
    return (
      <span className={`font-bold ${colorClass}`}>
        {prefix}AED {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    );
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    navigateTo('transaction-details', { transaction });
  };

  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, net: income - expenses };
  };

  const totals = calculateTotals();

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="transaction-tracker" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.section 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {t('transactionTracker.title')}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {t('transactionTracker.subtitle')}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigateTo('add-transaction')}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 shadow-lg"
                  aria-label={t('transactionTracker.addTransaction')}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.section>

            {/* Summary Cards */}
            <motion.section 
              variants={itemVariants}
              className="grid grid-cols-3 gap-3"
            >
              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">Income</p>
                    <p className="text-lg font-bold text-green-800 dark:text-green-200">
                      AED {totals.income.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium">Expenses</p>
                    <p className="text-lg font-bold text-red-800 dark:text-red-200">
                      AED {totals.expenses.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20 border-lime-200 dark:border-lime-800">
                  <CardContent className="p-4 text-center">
                                          <DollarSign className="w-6 h-6 text-lime-600 dark:text-lime-400 mx-auto mb-2" />
                                          <p className="text-xs text-lime-700 dark:text-lime-300 font-medium">Net</p>
                    <p className={`text-lg font-bold ${totals.net >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      AED {totals.net.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>

            {/* Search and Filters */}
            <motion.section 
              variants={itemVariants}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-400`} />
                <input
                  type="text"
                  placeholder={t('common.searchTransactions')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {filterOptions.map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedFilter === filter.id
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{t(filter.labelKey)}</span>
                  </motion.button>
                ))}
              </div>

              {/* Time Filter and Advanced Filters */}
              <div className="flex items-center justify-between">
                <select
                  value={selectedTimeFilter}
                  onChange={(e) => setSelectedTimeFilter(e.target.value)}
                  className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  {timeFilters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {t(filter.labelKey)}
                    </option>
                  ))}
                </select>

                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>{t('common.filters')}</span>
                </motion.button>
              </div>
            </motion.section>

            {/* Transaction List */}
            <motion.section 
              variants={itemVariants}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {t('transactionTracker.recentTransactions')}
                </h3>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {filteredTransactions.length} {t('common.results')}
                </span>
              </div>

              <AnimatePresence>
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-8 h-8 border-2 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">{t('common.loading')}</p>
                  </motion.div>
                ) : filteredTransactions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                      {t('transactionTracker.noTransactions')}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                      {t('transactionTracker.noTransactionsDesc')}
                    </p>
                    <Button
                      onClick={() => navigateTo('add-transaction')}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('transactionTracker.addTransaction')}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                        whileTap="tap"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Card 
                          className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 cursor-pointer"
                          onClick={() => handleTransactionClick(transaction)}
                        >
                          <CardContent className="p-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-600 rounded-xl flex items-center justify-center">
                                  <span className="text-xl">{transaction.categoryIcon}</span>
                                </div>
                                <div className="flex-1">
                                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white">
                                      {transaction.description}
                                    </h4>
                                    {getStatusIcon(transaction.status)}
                                  </div>
                                  <div className={`flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <span>{transaction.category}</span>
                                    <span>•</span>
                                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                                <div className="flex items-center space-x-1">
                                  {getTransactionIcon(transaction.type)}
                                  {formatAmount(transaction.amount, transaction.type)}
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                  {transaction.reference}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Quick Actions */}
            <motion.section 
              variants={itemVariants}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => navigateTo('transaction-analytics')}
                  className="w-full p-4 bg-lime-50 dark:bg-lime-900/20 hover:bg-lime-100 dark:hover:bg-lime-900/30 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('transactionTracker.analytics')}</span>
                  </div>
                </Button>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => {/* Export functionality */}}
                  className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Download className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('common.export')}</span>
                  </div>
                </Button>
              </motion.div>
            </motion.section>
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