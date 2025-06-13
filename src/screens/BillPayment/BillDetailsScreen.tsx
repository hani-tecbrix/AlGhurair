import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Info,
  Star,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'tel' | 'email';
  labelKey: string;
  placeholder: string;
  required: boolean;
  validation?: (value: string) => string | null;
  mask?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const getFieldsForBiller = (billerId: string): FormField[] => {
  const commonFields: { [key: string]: FormField[] } = {
    dewa: [
      {
        id: 'billNumber',
        type: 'text',
        labelKey: 'common.billNumber',
        placeholder: 'Enter 13-digit bill number',
        required: true,
        validation: (value) => {
          if (!/^\d{13}$/.test(value)) {
            return 'Bill number must be 13 digits';
          }
          return null;
        }
      },
      {
        id: 'accountNumber',
        type: 'text',
        labelKey: 'common.accountNumber',
        placeholder: 'Enter account number (optional)',
        required: false
      }
    ],
    etisalat: [
      {
        id: 'mobileNumber',
        type: 'tel',
        labelKey: 'Mobile Number',
        placeholder: '05X XXX XXXX',
        required: true,
        validation: (value) => {
          if (!/^05\d{8}$/.test(value.replace(/\s/g, ''))) {
            return 'Please enter a valid UAE mobile number';
          }
          return null;
        },
        mask: '05X XXX XXXX'
      }
    ],
    rta: [
      {
        id: 'plateNumber',
        type: 'text',
        labelKey: 'Plate Number',
        placeholder: 'A 12345',
        required: true,
        validation: (value) => {
          if (!/^[A-Z]\s?\d{4,5}$/.test(value)) {
            return 'Please enter a valid plate number (e.g., A 12345)';
          }
          return null;
        }
      },
      {
        id: 'trafficFileNumber',
        type: 'text',
        labelKey: 'Traffic File Number',
        placeholder: 'Enter traffic file number (optional)',
        required: false
      }
    ]
  };

  return commonFields[billerId] || [
    {
      id: 'accountNumber',
      type: 'text',
      labelKey: 'common.accountNumber',
      placeholder: 'Enter account number',
      required: true
    }
  ];
};

export const BillDetailsScreen: React.FC = () => {
  const { navigateTo, screenParams } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const biller = screenParams?.biller;
  const prefillAmount = screenParams?.prefillAmount;
  
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    amount: prefillAmount || ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [billInfo, setBillInfo] = useState<any>(null);
  const [showAmount, setShowAmount] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("bills");

  const fields = getFieldsForBiller(biller?.id || '');

  useEffect(() => {
    // Simulate fetching bill info after entering required fields
    const hasRequiredFields = fields.filter(f => f.required).every(field => 
      formData[field.id] && formData[field.id].length > 0
    );

    if (hasRequiredFields && !billInfo) {
      setIsLoading(true);
      setTimeout(() => {
        setBillInfo({
          customerName: 'Ahmed Al Mansouri',
          outstandingAmount: '450.00',
          dueDate: '2024-01-15',
          lastBillDate: '2023-12-15',
          status: 'pending'
        });
        setFormData(prev => ({ ...prev, amount: '450.00' }));
        setIsLoading(false);
      }, 1500);
    }
  }, [formData, fields, billInfo]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate required fields
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = t('validation.required');
      } else if (field.validation && formData[field.id]) {
        const error = field.validation(formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = t('validation.required');
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = t('validation.invalidAmount');
    } else if (Number(formData.amount) < (biller?.minAmount || 1)) {
      newErrors.amount = `${t('validation.minAmount')} AED ${biller?.minAmount || 1}`;
    } else if (Number(formData.amount) > (biller?.maxAmount || 50000)) {
      newErrors.amount = `${t('validation.maxAmount')} AED ${biller?.maxAmount?.toLocaleString() || '50,000'}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigateTo('bill-payment-confirmation', { 
        biller, 
        formData, 
        billInfo 
      });
    }
  };

  const toggleSaveBiller = () => {
    setIsSaved(!isSaved);
    // Here you would typically save to favorites
  };

  const formatMask = (value: string, mask: string): string => {
    if (!mask) return value;
    
    let result = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === 'X') {
        result += value[valueIndex];
        valueIndex++;
      } else {
        result += mask[i];
      }
    }
    
    return result;
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="bill-details" className="screen pt-20 pb-24 px-4">
          <div className="space-y-6">
            {/* Biller Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600">
                <span className="text-green-500 font-bold text-2xl">
                  {biller?.name?.charAt(0) || 'B'}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {biller?.name || 'Biller'}
                  </h1>
                  <motion.button
                    onClick={toggleSaveBiller}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-6 h-6 text-green-500" />
                    ) : (
                      <Bookmark className="w-6 h-6 text-zinc-400" />
                    )}
                  </motion.button>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {biller?.fullName || 'Enter your bill details'}
                </p>
              </div>
            </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                                      <Info className="w-5 h-5 text-lime-500" />
                <span>{t('billPayment.enterDetails')}</span>
              </h3>
              
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t(field.labelKey)}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.mask ? formatMask(formData[field.id] || '', field.mask) : (formData[field.id] || '')}
                    onChange={(e) => handleInputChange(field.id, e.target.value.replace(/\s/g, ''))}
                    className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors[field.id] 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-zinc-200 dark:border-zinc-600'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors[field.id] && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors[field.id]}</span>
                    </motion.p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">Fetching bill details...</p>
          </motion.div>
        )}

        {/* Bill Information */}
        {billInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="font-semibold text-green-800 dark:text-green-400">
                    Bill Details Found
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-zinc-600 dark:text-zinc-400">Customer Name</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {billInfo.customerName}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-zinc-600 dark:text-zinc-400">Outstanding Amount</span>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      AED {billInfo.outstandingAmount}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-zinc-600 dark:text-zinc-400">Due Date</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {new Date(billInfo.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Input */}
            <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span>{t('common.amount')}</span>
                  </h3>
                  <motion.button
                    onClick={() => setShowAmount(!showAmount)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                  >
                    {showAmount ? (
                      <Eye className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-zinc-400" />
                    )}
                  </motion.button>
                </div>
                
                <div className="relative">
                  <span className={`absolute top-3 ${isRTL ? 'right-4' : 'left-4'} text-zinc-500 dark:text-zinc-400 font-medium`}>
                    AED
                  </span>
                  <input
                    type={showAmount ? 'number' : 'password'}
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`w-full ${isRTL ? 'pr-16 pl-4' : 'pl-16 pr-4'} py-4 text-2xl font-bold bg-zinc-50 dark:bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors.amount 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-zinc-200 dark:border-zinc-600'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  />
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

                <div className="flex flex-wrap gap-2">
                  {['100', '200', '500', billInfo.outstandingAmount].map((amount) => (
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
              </CardContent>
            </Card>
          </motion.div>
        )}

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleContinue}
                disabled={!billInfo || isLoading}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{t('common.continue')}</span>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer - Bottom Navigation */}
      <footer className="bottom-nav">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </footer>
    </div>
  );
};