import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  MapPin,
  Camera,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  X,
  Upload
} from 'lucide-react';

interface FormData {
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: string;
  description: string;
  date: string;
  time: string;
  merchant: string;
  location: string;
  notes: string;
  tags: string[];
  attachments: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

const categories = {
  income: [
    { id: 'salary', name: 'Salary', icon: '💰' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investment', name: 'Investment', icon: '📈' },
    { id: 'rental', name: 'Rental Income', icon: '🏠' },
    { id: 'gift', name: 'Gift', icon: '🎁' },
    { id: 'refund', name: 'Refund', icon: '↩️' },
    { id: 'other-income', name: 'Other', icon: '💸' }
  ],
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'health', name: 'Health & Medical', icon: '⚕️' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'utilities', name: 'Utilities', icon: '⚡' },
    { id: 'rent', name: 'Rent', icon: '🏠' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️' },
    { id: 'other-expense', name: 'Other', icon: '💸' }
  ],
  transfer: [
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'remittance', name: 'Remittance', icon: '📤' },
    { id: 'bill-payment', name: 'Bill Payment', icon: '💳' },
    { id: 'investment-transfer', name: 'Investment', icon: '📊' },
    { id: 'savings', name: 'Savings', icon: '💰' },
    { id: 'other-transfer', name: 'Other', icon: '🔄' }
  ]
};

const quickAmounts = ['50', '100', '200', '500', '1000'];

export const AddTransactionScreen: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("tracker");
  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    merchant: '',
    location: '',
    notes: '',
    tags: [],
    attachments: []
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof FormData, value: string | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.type) {
      newErrors.type = t('validation.required');
    }

    if (!formData.category) {
      newErrors.category = t('validation.required');
    }

    if (!formData.amount) {
      newErrors.amount = t('validation.required');
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = t('validation.invalidAmount');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.date) {
      newErrors.date = t('validation.required');
    }

    if (!formData.time) {
      newErrors.time = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      goBack();
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate back to tracker
      navigateTo('transaction-tracker');
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'expense':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'transfer':
        return <ArrowUpDown className="w-5 h-5 text-blue-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="add-transaction" className="screen pt-20 pb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePrevStep}
                variant="ghost"
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg"
                aria-label={t('common.back')}
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        stepNumber <= step
                          ? 'bg-green-500'
                          : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {t('addTransaction.step')} {step} {t('common.of')} 3
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      {t('addTransaction.basicInfo')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t('addTransaction.basicInfoDesc')}
                    </p>
                  </div>

                  {/* Transaction Type */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {t('addTransaction.transactionType')}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {['income', 'expense', 'transfer'].map((type) => (
                          <motion.button
                            key={type}
                            onClick={() => handleInputChange('type', type as any)}
                            whileHover="hover"
                            whileTap="tap"
                            variants={cardVariants}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              formData.type === type
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              {getTypeIcon(type)}
                              <span className="text-sm font-medium capitalize">
                                {t(`addTransaction.${type}`)}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      {errors.type && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.type}</span>
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Category Selection */}
                  {formData.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                        <CardContent className="p-6 space-y-4">
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {t('addTransaction.selectCategory')}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                            {categories[formData.type].map((category) => (
                              <motion.button
                                key={category.id}
                                onClick={() => handleInputChange('category', category.id)}
                                whileHover="hover"
                                whileTap="tap"
                                variants={cardVariants}
                                className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                                  formData.category === category.id
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{category.icon}</span>
                                  <span className="text-sm font-medium">
                                    {category.name}
                                  </span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                          {errors.category && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm flex items-center space-x-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.category}</span>
                            </motion.p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Amount */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span>{t('common.amount')}</span>
                      </h3>
                      
                      <div className="relative">
                        <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} text-zinc-500 dark:text-zinc-400 font-medium`}>
                          AED
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className={`w-full ${isRTL ? 'pr-16 pl-4' : 'pl-16 pr-4'} py-4 text-2xl font-bold bg-zinc-50 dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                            errors.amount 
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                              : 'border-zinc-200 dark:border-zinc-600'
                          } ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      {/* Quick Amount Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {quickAmounts.map((amount) => (
                          <motion.button
                            key={amount}
                            onClick={() => handleInputChange('amount', amount)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-green-100 dark:hover:bg-green-900/30 border border-zinc-200 dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-600 rounded-lg text-sm font-medium transition-all duration-200"
                          >
                            AED {amount}
                          </motion.button>
                        ))}
                      </div>

                      {errors.amount && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.amount}</span>
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span>{t('common.description')}</span>
                      </h3>
                      
                      <input
                        type="text"
                        placeholder={t('addTransaction.descriptionPlaceholder')}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.description 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : 'border-zinc-200 dark:border-zinc-600'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />

                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.description}</span>
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      {t('addTransaction.dateTime')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t('addTransaction.dateTimeDesc')}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span>{t('addTransaction.whenDidThisHappen')}</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            {t('common.date')}
                          </label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              errors.date 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'border-zinc-200 dark:border-zinc-600'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            {t('common.time')}
                          </label>
                          <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              errors.time 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'border-zinc-200 dark:border-zinc-600'
                            }`}
                          />
                        </div>
                      </div>

                      {(errors.date || errors.time) && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.date || errors.time}</span>
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Merchant */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {t('common.merchant')} ({t('common.optional')})
                      </h3>
                      
                      <input
                        type="text"
                        placeholder={t('addTransaction.merchantPlaceholder')}
                        value={formData.merchant}
                        onChange={(e) => handleInputChange('merchant', e.target.value)}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span>{t('common.location')} ({t('common.optional')})</span>
                      </h3>
                      
                      <input
                        type="text"
                        placeholder={t('addTransaction.locationPlaceholder')}
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      {t('addTransaction.additionalDetails')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t('addTransaction.additionalDetailsDesc')}
                    </p>
                  </div>

                  {/* Notes */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span>{t('common.notes')} ({t('common.optional')})</span>
                      </h3>
                      
                      <textarea
                        placeholder={t('addTransaction.notesPlaceholder')}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-green-500" />
                        <span>{t('common.tags')} ({t('common.optional')})</span>
                      </h3>
                      
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder={t('addTransaction.addTag')}
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className={`flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                        <motion.button
                          onClick={addTag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                            >
                              <span>#{tag}</span>
                              <motion.button
                                onClick={() => removeTag(tag)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Transaction Summary */}
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{t('addTransaction.summary')}</span>
                      </h3>
                      
                      <div className="space-y-3">
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-zinc-600 dark:text-zinc-400">{t('common.type')}</span>
                          <span className="font-medium text-zinc-900 dark:text-white capitalize">
                            {formData.type}
                          </span>
                        </div>
                        
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-zinc-600 dark:text-zinc-400">{t('common.amount')}</span>
                          <span className="font-bold text-lg text-green-600 dark:text-green-400">
                            AED {Number(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-zinc-600 dark:text-zinc-400">{t('common.description')}</span>
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {formData.description}
                          </span>
                        </div>
                        
                        <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-zinc-600 dark:text-zinc-400">{t('common.date')}</span>
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {new Date(`${formData.date}T${formData.time}`).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="px-6 py-3 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    {t('common.previous')}
                  </Button>
                </motion.div>
              )}

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className={step === 1 ? 'w-full' : 'ml-auto'}
              >
                <Button
                  onClick={step === 3 ? handleSubmit : handleNextStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('common.saving')}</span>
                    </div>
                  ) : step === 3 ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('addTransaction.saveTransaction')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t('common.next')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
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