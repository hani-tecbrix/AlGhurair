import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  Edit3, 
  Share2, 
  Download, 
  Trash2,
  Star,
  StarOff,
  Copy,
  MapPin,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Receipt,
  Camera
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
  location?: string;
  notes?: string;
  attachments?: string[];
}

export const TransactionDetailsScreen: React.FC = () => {
  const { navigateTo, screenParams, goBack } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const transaction = screenParams?.transaction as Transaction;
  const [activeTab, setActiveTab] = useState("tracker");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showActions, setShowActions] = useState(false);

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">{t('transactionTracker.notFound')}</p>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <ArrowDownLeft className="w-8 h-8 text-green-500" />;
      case 'expense':
        return <ArrowUpRight className="w-8 h-8 text-red-500" />;
      case 'transfer':
        return <ArrowUpRight className="w-8 h-8 text-blue-500" />;
      default:
        return <DollarSign className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatAmount = () => {
    const prefix = transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '';
    const colorClass = transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                      transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 
                      'text-blue-600 dark:text-blue-400';
    
    return (
      <span className={`text-3xl font-bold ${colorClass}`}>
        {prefix}AED {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    );
  };

  const handleEdit = () => {
    navigateTo('edit-transaction', { transaction });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Transaction Details',
        text: `${transaction.description} - ${formatAmount()}`,
        url: window.location.href
      });
    }
  };

  const handleCopyReference = async () => {
    if (transaction.reference) {
      await navigator.clipboard.writeText(transaction.reference);
      // Show toast notification
    }
  };

  const handleDelete = () => {
    // Show confirmation dialog
    // Delete transaction
    goBack();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="transaction-details" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Transaction Header */}
            <motion.section 
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-zinc-200 dark:border-zinc-600">
                  <span className="text-4xl">{transaction.categoryIcon}</span>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  {getTransactionIcon()}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {transaction.description}
                  </h1>
                  {getStatusIcon()}
                </div>
                
                <div className="mb-4">
                  {formatAmount()}
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(transaction.date).toLocaleString()}</span>
                </div>
              </div>
            </motion.section>

            {/* Quick Actions */}
            <motion.section 
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              <motion.button
                onClick={() => setIsFavorite(!isFavorite)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-xl transition-all duration-200"
                aria-label={isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
              >
                {isFavorite ? 
                  <Star className="w-5 h-5 text-yellow-500 fill-current" /> : 
                  <StarOff className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                }
              </motion.button>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200"
                aria-label={t('common.share')}
              >
                <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </motion.button>

              <motion.button
                onClick={handleEdit}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200"
                aria-label={t('common.edit')}
              >
                <Edit3 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </motion.button>

              <motion.button
                onClick={() => setShowActions(!showActions)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-xl transition-all duration-200"
                aria-label={t('common.moreActions')}
              >
                <MoreVertical className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </motion.button>
            </motion.section>

            {/* Transaction Details */}
            <motion.section 
              variants={itemVariants}
              className="space-y-4"
            >
              <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>{t('transactionTracker.details')}</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">{t('common.category')}</span>
                      <div className="flex items-center space-x-2">
                        <span>{transaction.categoryIcon}</span>
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {transaction.category}
                        </span>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">{t('common.type')}</span>
                      <span className="font-medium text-zinc-900 dark:text-white capitalize">
                        {transaction.type}
                      </span>
                    </div>

                    {transaction.merchant && (
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">{t('common.merchant')}</span>
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {transaction.merchant}
                        </span>
                      </div>
                    )}

                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">{t('common.reference')}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-zinc-900 dark:text-white font-mono text-sm">
                          {transaction.reference}
                        </span>
                        <motion.button
                          onClick={handleCopyReference}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded"
                          aria-label={t('common.copy')}
                        >
                          <Copy className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        </motion.button>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-zinc-600 dark:text-zinc-400">{t('common.status')}</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <span className={`font-medium capitalize ${
                          transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>

                    {transaction.location && (
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-zinc-600 dark:text-zinc-400">{t('common.location')}</span>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {transaction.location}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Tags */}
            {transaction.tags.length > 0 && (
              <motion.section 
                variants={itemVariants}
                className="space-y-3"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2 mb-3">
                      <Tag className="w-5 h-5 text-green-500" />
                      <span>{t('common.tags')}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {transaction.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Notes */}
            {transaction.notes && (
              <motion.section 
                variants={itemVariants}
                className="space-y-3"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>{t('common.notes')}</span>
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {transaction.notes}
                    </p>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Action Buttons */}
            <motion.section 
              variants={itemVariants}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {/* Download receipt */}}
                  className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Receipt className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('common.receipt')}</span>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleDelete}
                  className="w-full p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Trash2 className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('common.delete')}</span>
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