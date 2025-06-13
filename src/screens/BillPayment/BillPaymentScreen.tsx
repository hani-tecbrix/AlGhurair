import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  Zap, 
  Smartphone, 
  GraduationCap, 
  Building2, 
  Shield, 
  MoreHorizontal,
  Search,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

interface BillerCategory {
  id: string;
  titleKey: string;
  icon: React.ElementType;
  gradient: string;
  billers: string[];
}

interface RecentBill {
  id: string;
  biller: string;
  category: string;
  amount: string;
  currency: string;
  dueDate: string;
  accountNumber: string;
  status: 'pending' | 'paid' | 'overdue';
}

const billerCategories: BillerCategory[] = [
  {
    id: 'utilities',
    titleKey: 'billers.utilities',
    icon: Zap,
    gradient: 'from-yellow-400 to-orange-500',
    billers: ['DEWA', 'ADDC', 'SEWA', 'FEWA', 'Dubai Gas']
  },
  {
    id: 'telecom',
    titleKey: 'billers.telecom',
    icon: Smartphone,
    gradient: 'from-lime-400 to-green-500',
    billers: ['Etisalat', 'du', 'Virgin Mobile']
  },
  {
    id: 'education',
    titleKey: 'billers.education',
    icon: GraduationCap,
    gradient: 'from-green-400 to-lime-500',
    billers: ['ADEC', 'KHDA', 'Higher Colleges']
  },
  {
    id: 'government',
    titleKey: 'billers.government',
    icon: Building2,
    gradient: 'from-red-400 to-pink-500',
    billers: ['Dubai Municipality', 'RTA', 'MOHRE']
  },
  {
    id: 'insurance',
    titleKey: 'billers.insurance',
    icon: Shield,
    gradient: 'from-indigo-400 to-cyan-500',
    billers: ['ADNIC', 'AXA', 'Oman Insurance']
  },
  {
    id: 'other',
    titleKey: 'billers.other',
    icon: MoreHorizontal,
    gradient: 'from-gray-400 to-gray-600',
    billers: ['Others']
  }
];

const recentBills: RecentBill[] = [
  {
    id: '1',
    biller: 'DEWA',
    category: 'Utilities',
    amount: '450.00',
    currency: 'AED',
    dueDate: '2024-01-15',
    accountNumber: '****1234',
    status: 'pending'
  },
  {
    id: '2',
    biller: 'Etisalat',
    category: 'Telecom',
    amount: '299.50',
    currency: 'AED',
    dueDate: '2024-01-20',
    accountNumber: '****5678',
    status: 'pending'
  },
  {
    id: '3',
    biller: 'RTA',
    category: 'Government',
    amount: '120.00',
    currency: 'AED',
    dueDate: '2024-01-12',
    accountNumber: '****9012',
    status: 'overdue'
  }
];

export const BillPaymentScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'recent' | 'favorites'>('categories');
  const [bottomNavTab, setBottomNavTab] = useState("exchange");

  const handleCategorySelect = (category: BillerCategory) => {
    navigateTo('bill-payment-biller-selection', { category: category.id });
  };

  const handleRecentBillSelect = (bill: RecentBill) => {
    navigateTo('bill-payment-details', { 
      billerId: bill.biller.toLowerCase(),
      accountNumber: bill.accountNumber,
      prefillAmount: bill.amount
    });
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

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="bill-payment" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-2"
            >
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {t('billPayment.title')}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t('billPayment.subtitle')}
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-zinc-400`} />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              variants={itemVariants}
              className="flex bg-white dark:bg-zinc-800 p-1 rounded-xl shadow-sm"
            >
              {[
                { id: 'categories', icon: Building2, labelKey: 'billers.utilities' },
                { id: 'recent', icon: Clock, labelKey: 'common.recent' },
                { id: 'favorites', icon: Star, labelKey: 'common.favorites' }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t(tab.labelKey)}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Content based on active tab */}
            {activeTab === 'categories' && (
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-4"
              >
                {billerCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="h-32 cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <CardContent className="h-full p-4 flex flex-col items-center justify-center space-y-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {t(category.titleKey)}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                              {category.billers.length} billers
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                variants={containerVariants}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {t('common.recent')} Bills
                </h3>
                {recentBills.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => handleRecentBillSelect(bill)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {bill.biller.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-zinc-900 dark:text-white">
                                {bill.biller}
                              </h4>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {bill.accountNumber}
                              </p>
                              <p className="text-xs text-zinc-400">
                                Due: {new Date(bill.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-zinc-900 dark:text-white">
                              {bill.currency} {bill.amount}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bill.status === 'overdue' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <Star className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  No Favorite Billers
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Add billers to favorites for quick access
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer - Bottom Navigation */}
      <footer className="bottom-nav">
        <BottomNavigation activeTab={bottomNavTab} onTabChange={setBottomNavTab} />
      </footer>
    </div>
  );
}; 