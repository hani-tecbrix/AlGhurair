import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  CreditCard, 
  Camera, 
  ScanLine, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Shield,
  Info,
  Loader2,
  Sparkles,
  Lock,
  Star,
  Zap,
  Nfc,
  Smartphone,
  Wallet,
  Activity
} from 'lucide-react';

interface CardForm {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardName: string;
  cardType: 'credit' | 'debit' | 'prepaid';
  setAsDefault: boolean;
  features: string[];
}

interface ValidationError {
  field: string;
  message: string;
}

export const AddCardScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("exchange");
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');
  
  const [formData, setFormData] = useState<CardForm>({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
    cardType: 'debit',
    setAsDefault: false,
    features: []
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Card number validation and formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const detectCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    return 'unknown';
  };

  useEffect(() => {
    const brand = detectCardBrand(formData.cardNumber);
    setCardBrand(brand);
  }, [formData.cardNumber]);

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'cardNumber':
        const cleanNumber = value.replace(/\s/g, '');
        if (!cleanNumber) return t('validation.required');
        if (cleanNumber.length < 13 || cleanNumber.length > 19) return 'Invalid card number length';
        if (!/^\d+$/.test(cleanNumber)) return 'Card number must contain only digits';
        
        // Luhn algorithm validation
        let sum = 0;
        let isEven = false;
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cleanNumber.charAt(i));
          if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          isEven = !isEven;
        }
        if (sum % 10 !== 0) return 'Invalid card number';
        return null;

      case 'cardholderName':
        if (!value.trim()) return t('validation.required');
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain only letters';
        return null;

      case 'expiryMonth':
        if (!value) return t('validation.required');
        const month = parseInt(value);
        if (month < 1 || month > 12) return 'Invalid month';
        return null;

      case 'expiryYear':
        if (!value) return t('validation.required');
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < currentYear || year > currentYear + 20) return 'Invalid year';
        
        // Check if card is expired
        if (formData.expiryMonth) {
          const expiryDate = new Date(year, parseInt(formData.expiryMonth) - 1);
          const currentDate = new Date();
          currentDate.setDate(1); // Set to first day of current month
          if (expiryDate < currentDate) return 'Card is expired';
        }
        return null;

      case 'cvv':
        if (!value) return t('validation.required');
        const cvvLength = cardBrand === 'amex' ? 4 : 3;
        if (value.length !== cvvLength) return `CVV must be ${cvvLength} digits`;
        if (!/^\d+$/.test(value)) return 'CVV must contain only digits';
        return null;

      case 'cardName':
        if (!value.trim()) return t('validation.required');
        if (value.length < 2) return 'Card name must be at least 2 characters';
        return null;

      default:
        return null;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cardholderName') {
      processedValue = value.toUpperCase();
    } else if (field === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, cardBrand === 'amex' ? 4 : 3);
    } else if (field === 'expiryMonth' || field === 'expiryYear') {
      processedValue = value.replace(/\D/g, '');
      if (field === 'expiryMonth') {
        processedValue = processedValue.slice(0, 2);
      } else {
        processedValue = processedValue.slice(0, 4);
      }
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear error when user starts typing
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field as keyof CardForm] as string);
    if (error) {
      setErrors(prev => [...prev.filter(e => e.field !== field), { field, message: error }]);
    }
  };

  const validateForm = (): boolean => {
    const fieldsToValidate = ['cardNumber', 'cardholderName', 'expiryMonth', 'expiryYear', 'cvv', 'cardName'];
    const newErrors: ValidationError[] = [];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof CardForm] as string);
      if (error) {
        newErrors.push({ field, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const step1Fields = ['cardNumber', 'cardholderName'];
      const hasErrors = step1Fields.some(field => {
        const error = validateField(field, formData[field as keyof CardForm] as string);
        if (error) {
          setErrors(prev => [...prev.filter(e => e.field !== field), { field, message: error }]);
          return true;
        }
        return false;
      });

      if (!hasErrors) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const step2Fields = ['expiryMonth', 'expiryYear', 'cvv'];
      const hasErrors = step2Fields.some(field => {
        const error = validateField(field, formData[field as keyof CardForm] as string);
        if (error) {
          setErrors(prev => [...prev.filter(e => e.field !== field), { field, message: error }]);
          return true;
        }
        return false;
      });

      if (!hasErrors) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    navigateTo('manage-cards', { 
      message: 'Card added successfully!',
      newCard: formData 
    });
  };

  const startCardScan = () => {
    setIsScanning(true);
    // Simulate card scanning
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        cardNumber: '4532 1234 5678 9012',
        cardholderName: 'AHMED AL MANSOURI',
        expiryMonth: '12',
        expiryYear: '2026'
      }));
      setIsScanning(false);
      setCurrentStep(2);
    }, 3000);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const isFieldTouched = (field: string) => {
    return touchedFields.has(field);
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

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const cardColors = {
    visa: 'from-blue-500 to-blue-700',
    mastercard: 'from-red-500 to-orange-600',
    amex: 'from-green-500 to-teal-600',
    unknown: 'from-zinc-400 to-zinc-600'
  };

  if (isSubmitting) {
    return (
      <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
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
              <CreditCard className="absolute inset-0 m-auto w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Adding Your Card
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Please wait while we securely add your payment card...
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
            </div>
          </motion.div>
        </main>
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
        <div id="add-card" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {t('addCard.title')}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t('addCard.subtitle')}
              </p>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                <span>Step {currentStep} of 3</span>
                <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: '33%' }}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </motion.div>

            {/* Card Preview */}
            <motion.div variants={itemVariants} className="perspective-1000">
              <motion.div
                className={`relative p-6 bg-gradient-to-br ${cardColors[cardBrand]} rounded-2xl shadow-xl text-white overflow-hidden`}
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

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      {cardBrand !== 'unknown' && (
                        <span className="text-sm font-medium capitalize">{cardBrand}</span>
                      )}
                    </div>
                    <Nfc className="w-6 h-6 opacity-80" />
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-lg tracking-wider">
                      {formData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm opacity-80">Card Holder</p>
                      <p className="font-medium">
                        {formData.cardholderName || 'YOUR NAME'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Expires</p>
                      <p className="font-mono">
                        {formData.expiryMonth && formData.expiryYear 
                          ? `${formData.expiryMonth.padStart(2, '0')}/${formData.expiryYear.slice(-2)}`
                          : 'MM/YY'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Card Scanning Option */}
            <AnimatePresence>
              {currentStep === 1 && !isScanning && (
                <motion.div
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <Button
                    onClick={startCardScan}
                    variant="outline"
                    className="w-full py-3 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                  >
                    <ScanLine className="w-5 h-5 mr-2" />
                    Scan Card with Camera
                  </Button>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    Or enter card details manually below
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Animation */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-4 py-8"
                >
                  <div className="relative">
                    <Camera className="w-16 h-16 text-green-500 mx-auto" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-transparent border-t-green-400 rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Scanning Your Card
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Position your card within the frame
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {!isScanning && (
                <motion.div
                  key={currentStep}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Step 1: Card Number & Name */}
                  {currentStep === 1 && (
                    <Card className="border-zinc-200 dark:border-zinc-700">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Card Information</h3>
                        
                        {/* Card Number */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Card Number *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              onBlur={() => handleBlur('cardNumber')}
                              placeholder="1234 5678 9012 3456"
                              className={`w-full px-4 py-3 border rounded-xl font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                getFieldError('cardNumber') && isFieldTouched('cardNumber')
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                              }`}
                              maxLength={19}
                            />
                            {cardBrand !== 'unknown' && (
                              <div className="absolute right-3 top-3">
                                <span className="text-2xl">
                                  {cardBrand === 'visa' && '💳'}
                                  {cardBrand === 'mastercard' && '💳'}
                                  {cardBrand === 'amex' && '💳'}
                                </span>
                              </div>
                            )}
                          </div>
                          {getFieldError('cardNumber') && isFieldTouched('cardNumber') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>{getFieldError('cardNumber')}</span>
                            </motion.p>
                          )}
                        </div>

                        {/* Cardholder Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Cardholder Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                            <input
                              type="text"
                              value={formData.cardholderName}
                              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                              onBlur={() => handleBlur('cardholderName')}
                              placeholder="AHMED AL MANSOURI"
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                getFieldError('cardholderName') && isFieldTouched('cardholderName')
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                              }`}
                            />
                          </div>
                          {getFieldError('cardholderName') && isFieldTouched('cardholderName') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>{getFieldError('cardholderName')}</span>
                            </motion.p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Expiry & CVV */}
                  {currentStep === 2 && (
                    <Card className="border-zinc-200 dark:border-zinc-700">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Security Details</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                          {/* Expiry Month */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Month *
                            </label>
                            <select
                              value={formData.expiryMonth}
                              onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                              onBlur={() => handleBlur('expiryMonth')}
                              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                getFieldError('expiryMonth') && isFieldTouched('expiryMonth')
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                              }`}
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                  {String(i + 1).padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Expiry Year */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Year *
                            </label>
                            <select
                              value={formData.expiryYear}
                              onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                              onBlur={() => handleBlur('expiryYear')}
                              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                getFieldError('expiryYear') && isFieldTouched('expiryYear')
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                              }`}
                            >
                              <option value="">YYYY</option>
                              {Array.from({ length: 21 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* CVV */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center space-x-1">
                              <span>CVV *</span>
                              <Info className="w-3 h-3 text-zinc-400" />
                            </label>
                            <div className="relative">
                              <input
                                type={showCvv ? 'text' : 'password'}
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                onBlur={() => handleBlur('cvv')}
                                placeholder={cardBrand === 'amex' ? '1234' : '123'}
                                className={`w-full px-3 py-3 border rounded-xl font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                  getFieldError('cvv') && isFieldTouched('cvv')
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                                }`}
                                maxLength={cardBrand === 'amex' ? 4 : 3}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCvv(!showCvv)}
                                className="absolute right-2 top-3 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                              >
                                {showCvv ? (
                                  <EyeOff className="w-4 h-4 text-zinc-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-zinc-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {(getFieldError('expiryMonth') || getFieldError('expiryYear') || getFieldError('cvv')) && 
                         (isFieldTouched('expiryMonth') || isFieldTouched('expiryYear') || isFieldTouched('cvv')) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              {getFieldError('expiryMonth') || getFieldError('expiryYear') || getFieldError('cvv')}
                            </span>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Card Settings */}
                  {currentStep === 3 && (
                    <Card className="border-zinc-200 dark:border-zinc-700">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Card Settings</h3>
                        
                        {/* Card Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Card Name *
                          </label>
                          <input
                            type="text"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            onBlur={() => handleBlur('cardName')}
                            placeholder="My Primary Card"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              getFieldError('cardName') && isFieldTouched('cardName')
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                            }`}
                          />
                        </div>

                        {/* Card Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Card Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'debit', label: 'Debit', icon: CreditCard },
                              { value: 'credit', label: 'Credit', icon: Star },
                              { value: 'prepaid', label: 'Prepaid', icon: Wallet }
                            ].map((type) => {
                              const Icon = type.icon;
                              return (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, cardType: type.value as any }))}
                                  className={`p-3 border rounded-xl transition-all duration-200 ${
                                    formData.cardType === type.value
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                                      : 'border-zinc-300 dark:border-zinc-600 hover:border-green-300'
                                  }`}
                                >
                                  <Icon className="w-5 h-5 mx-auto mb-1" />
                                  <span className="text-sm font-medium">{type.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Card Features
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'contactless', label: 'Contactless', icon: Nfc },
                              { value: 'virtual', label: 'Virtual Card', icon: Smartphone },
                              { value: 'rewards', label: 'Rewards', icon: Zap },
                              { value: 'premium', label: 'Premium', icon: Star }
                            ].map((feature) => {
                              const Icon = feature.icon;
                              const isSelected = formData.features.includes(feature.value);
                              return (
                                <button
                                  key={feature.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      features: isSelected
                                        ? prev.features.filter(f => f !== feature.value)
                                        : [...prev.features, feature.value]
                                    }));
                                  }}
                                  className={`p-3 border rounded-xl transition-all duration-200 ${
                                    isSelected
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                                      : 'border-zinc-300 dark:border-zinc-600 hover:border-green-300'
                                  }`}
                                >
                                  <Icon className="w-4 h-4 mr-2" />
                                  <span className="text-sm">{feature.label}</span>
                                  {isSelected && <CheckCircle className="w-4 h-4 ml-auto text-green-500" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Set as Default */}
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white">Set as Default Card</p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Use this card as your primary payment method
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, setAsDefault: !prev.setAsDefault }))}
                            className={`w-12 h-6 rounded-full transition-all duration-200 ${
                              formData.setAsDefault ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
                            }`}
                          >
                            <motion.div
                              className="w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{ x: formData.setAsDefault ? 24 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div variants={itemVariants} className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1 py-3 border-zinc-300 dark:border-zinc-600 rounded-xl"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Add Card Securely
                </Button>
              )}
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Shield className="w-4 h-4" />
                <span>Your card information is encrypted and secure</span>
              </div>
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