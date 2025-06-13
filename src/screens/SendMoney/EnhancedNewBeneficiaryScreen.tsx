import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Header } from "../../components/Header";
import { BottomNavigation } from "../../components/BottomNavigation";
import { 
  User, 
  Building2, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  Zap
} from "lucide-react";

// Types
interface BankDetails {
  bankName: string;
  bankCode: string;
  swiftCode: string;
  address: string;
  country: string;
  currency: string;
  branchName?: string;
}

interface ValidationResult {
  isValid: boolean;
  accountTitle?: string;
  bankDetails?: BankDetails;
  error?: string;
  isLoading: boolean;
  confidence?: number;
}

interface BeneficiaryData {
  accountInput: string;
  accountType: 'iban' | 'account' | 'unknown';
  fullName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  purpose?: string;
  isSaved: boolean;
}

// Mock UAE Banks
const uaeBanks = [
  { name: "Emirates NBD", code: "033", swift: "EBILAEAD", branches: ["Main Branch", "Dubai Mall", "DIFC"] },
  { name: "ADCB Bank", code: "054", swift: "ADCBAEAA", branches: ["Head Office", "Abu Dhabi Mall", "Al Wahda"] },
  { name: "FAB Bank", code: "044", swift: "NBADAEAA", branches: ["Corporate Center", "Marina Walk", "JBR"] },
  { name: "RAKBANK", code: "175", swift: "NRAKAEAK", branches: ["RAK Center", "Al Nakheel", "Corniche"] },
  { name: "Mashreq Bank", code: "046", swift: "BOMLAEAD", branches: ["Headquarters", "Business Bay", "ADGM"] },
  { name: "CBD Bank", code: "076", swift: "CBDAAEAA", branches: ["Downtown", "Jumeirah", "Silicon Oasis"] },
];

const relationships = ["Family", "Friend", "Business Partner", "Employee", "Supplier", "Customer", "Other"];
const purposes = ["Personal", "Business", "Education", "Medical", "Investment", "Gift", "Salary", "Rent", "Other"];

// Enhanced IBAN Validation
const validateIBAN = (iban: string): boolean => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!cleanIban.match(/^AE\d{21}$/)) return false;
  
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  let remainder = '';
  for (let i = 0; i < numericString.length; i += 7) {
    remainder = ((parseInt(remainder + numericString.slice(i, i + 7)) % 97)).toString();
  }
  
  return parseInt(remainder) === 1;
};

// Get bank from IBAN
const getBankFromIBAN = (iban: string): BankDetails | null => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!validateIBAN(cleanIban)) return null;
  
  const bankCode = cleanIban.slice(4, 7);
  const bank = uaeBanks.find(b => b.code === bankCode);
  
  if (bank) {
    return {
      bankName: bank.name,
      bankCode: bank.code,
      swiftCode: bank.swift,
      country: "UAE",
      currency: "AED",
      address: "Dubai, United Arab Emirates",
      branchName: bank.branches[0]
    };
  }
  
  return null;
};

// Mock API validation
const validateAccountDetails = async (input: string, selectedBank?: string): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cleanInput = input.replace(/\s/g, '').toUpperCase();
      
      if (cleanInput.startsWith('AE') && cleanInput.length === 23) {
        if (validateIBAN(cleanInput)) {
          const bankDetails = getBankFromIBAN(cleanInput);
          if (bankDetails) {
            resolve({
              isValid: true,
              accountTitle: "Ahmed Mohammed Al Mansouri",
              bankDetails,
              isLoading: false,
              confidence: 95
            });
          } else {
            resolve({
              isValid: false,
              error: "Bank not found in IBAN",
              isLoading: false
            });
          }
        } else {
          resolve({
            isValid: false,
            error: "Invalid IBAN checksum",
            isLoading: false
          });
        }
      } else if (cleanInput.match(/^\d{8,16}$/)) {
        if (selectedBank) {
          const bank = uaeBanks.find(b => b.swift === selectedBank);
          if (bank) {
            resolve({
              isValid: true,
              accountTitle: "Sarah Ahmed Johnson",
              bankDetails: {
                bankName: bank.name,
                bankCode: bank.code,
                swiftCode: bank.swift,
                country: "UAE",
                currency: "AED",
                address: "Dubai, United Arab Emirates",
                branchName: bank.branches[0]
              },
              isLoading: false,
              confidence: 88
            });
          } else {
            resolve({
              isValid: false,
              error: "Selected bank not found",
              isLoading: false
            });
          }
        } else {
          resolve({
            isValid: false,
            error: "Bank selection required for account number",
            isLoading: false
          });
        }
      } else {
        resolve({
          isValid: false,
          error: "Invalid account format",
          isLoading: false
        });
      }
    }, 1200);
  });
};

export const EnhancedNewBeneficiaryScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("exchange");
  const [step, setStep] = useState<'account' | 'bank' | 'details' | 'review'>('account');
  const [selectedBank, setSelectedBank] = useState("");
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, isLoading: false });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAccountMask, setShowAccountMask] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryData>({
    accountInput: '',
    accountType: 'unknown',
    fullName: '',
    nickname: '',
    email: '',
    phone: '',
    relationship: '',
    purpose: '',
    isSaved: true
  });

  // Animation variants
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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  // Auto-detect account type
  const detectAccountType = useCallback((input: string) => {
    const clean = input.replace(/\s/g, '').toUpperCase();
    if (clean.startsWith('AE') && clean.length >= 20) {
      return 'iban';
    } else if (clean.match(/^\d{6,}$/)) {
      return 'account';
    }
    return 'unknown';
  }, []);

  // Handle account input change
  const handleAccountInputChange = (value: string) => {
    setBeneficiaryData(prev => ({
      ...prev,
      accountInput: value,
      accountType: detectAccountType(value)
    }));
  };

  // Validate account when input changes
  useEffect(() => {
    if (beneficiaryData.accountInput.length > 5) {
      setValidation({ isValid: false, isLoading: true });
      
      const timeoutId = setTimeout(() => {
        validateAccountDetails(beneficiaryData.accountInput, selectedBank).then(setValidation);
      }, 800);

      return () => clearTimeout(timeoutId);
    } else {
      setValidation({ isValid: false, isLoading: false });
    }
  }, [beneficiaryData.accountInput, selectedBank]);

  // Format IBAN for display
  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Navigation handlers
  const handleNext = () => {
    if (step === 'account') {
      if (beneficiaryData.accountType === 'account' && !selectedBank) {
        setStep('bank');
      } else if (validation.isValid) {
        setStep('details');
      }
    } else if (step === 'bank') {
      if (selectedBank) {
        setStep('details');
      }
    } else if (step === 'details') {
      setStep('review');
    }
  };

  const handleFinish = (action: 'save' | 'pay') => {
    const completeData = {
      id: `ben_${Date.now()}`,
      name: validation.accountTitle || beneficiaryData.fullName,
      bank: validation.bankDetails?.bankName || 'Unknown Bank',
      bankCode: validation.bankDetails?.swiftCode || '',
      accountNumber: beneficiaryData.accountType === 'account' ? beneficiaryData.accountInput : '',
      iban: beneficiaryData.accountType === 'iban' ? beneficiaryData.accountInput : undefined,
      isStarred: false,
      lastUsed: new Date(),
      country: validation.bankDetails?.country || 'UAE',
      currency: validation.bankDetails?.currency || 'AED',
      accountType: 'current' as const,
      isVerified: true,
      frequency: 0,
      nickname: beneficiaryData.nickname,
      email: beneficiaryData.email,
      phone: beneficiaryData.phone,
      relationship: beneficiaryData.relationship,
      purpose: beneficiaryData.purpose
    };
    
    if (action === 'save') {
      navigateTo('send-money-beneficiary');
    } else {
      navigateTo('send-money-amount', { beneficiary: completeData });
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'account': return t('sendMoney.enterAccountDetails');
      case 'bank': return t('sendMoney.selectBank');
      case 'details': return t('sendMoney.beneficiaryDetails');
      case 'review': return t('sendMoney.reviewDetails');
      default: return '';
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'account': return 25;
      case 'bank': return 50;
      case 'details': return 75;
      case 'review': return 100;
      default: return 0;
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
        <div id="add-beneficiary" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header with Progress */}
            <motion.section 
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {t('sendMoney.addNewRecipient')}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {getStepTitle()}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-lime-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getStepProgress()}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{t('sendMoney.step')} {['account', 'bank', 'details', 'review'].indexOf(step) + 1}/4</span>
                  <span>{getStepProgress()}% {t('common.complete')}</span>
                </div>
              </div>
            </motion.section>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {/* Step 1: Account Details */}
              {step === 'account' && (
                <motion.section
                  key="account"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {t('sendMoney.smartValidation')}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {t('sendMoney.smartValidationDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Account Input */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t('sendMoney.accountOrIban')} *
                        </label>
                        
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={t('sendMoney.enterAccountOrIban')}
                            value={beneficiaryData.accountInput}
                            onChange={(e) => handleAccountInputChange(e.target.value)}
                            className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              validation.isValid 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                : validation.error 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'border-zinc-200 dark:border-zinc-600'
                            } ${isRTL ? 'text-right' : 'text-left'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          
                          {/* Status Indicator */}
                          <div className={`absolute top-3 ${isRTL ? 'left-4' : 'right-4'}`}>
                            {validation.isLoading ? (
                              <Loader2 className="w-5 h-5 text-lime-500 animate-spin" />
                            ) : validation.isValid ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : validation.error ? (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            ) : null}
                          </div>
                        </div>

                        {/* Input Type Indicator */}
                        {beneficiaryData.accountInput && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-2 text-sm"
                          >
                            {beneficiaryData.accountType === 'iban' ? (
                              <>
                                                            <Globe className="w-4 h-4 text-lime-500" />
                            <span className="text-lime-600 dark:text-lime-400">
                                  {t('sendMoney.ibanDetected')}: {formatIBAN(beneficiaryData.accountInput.toUpperCase())}
                                </span>
                              </>
                            ) : beneficiaryData.accountType === 'account' ? (
                              <>
                                <CreditCard className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">
                                  {t('sendMoney.accountNumberDetected')}: {beneficiaryData.accountInput}
                                </span>
                              </>
                            ) : (
                              <>
                                <Info className="w-4 h-4 text-amber-500" />
                                <span className="text-amber-600 dark:text-amber-400">
                                  {t('sendMoney.enterValidFormat')}
                                </span>
                              </>
                            )}
                          </motion.div>
                        )}

                        {/* Error Display */}
                        <AnimatePresence>
                          {validation.error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>{validation.error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Validation Success */}
                        <AnimatePresence>
                          {validation.isValid && validation.accountTitle && validation.bankDetails && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-3"
                            >
                              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">{t('sendMoney.accountVerified')}</span>
                                {validation.confidence && (
                                  <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded-full">
                                    {validation.confidence}% {t('common.confidence')}
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">{t('common.accountTitle')}:</span>
                                  <span>{validation.accountTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">{t('common.bank')}:</span>
                                  <span>{validation.bankDetails.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">{t('common.currency')}:</span>
                                  <span>{validation.bankDetails.currency}</span>
                                </div>
                                {validation.bankDetails.branchName && (
                                  <div className="flex justify-between">
                                    <span className="font-medium">{t('common.branch')}:</span>
                                    <span>{validation.bankDetails.branchName}</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Continue Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleNext}
                      disabled={!validation.isValid && beneficiaryData.accountType !== 'account'}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{t('common.continue')}</span>
                      <ArrowRight className={`w-5 h-5 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                    </Button>
                  </motion.div>
                </motion.section>
              )}

              {/* Step 2: Bank Selection */}
              {step === 'bank' && (
                <motion.section
                  key="bank"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-6 h-6 text-lime-500" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {t('sendMoney.selectRecipientBank')}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t('sendMoney.selectBankForAccount')}: {beneficiaryData.accountInput}
                      </p>

                      <div className="space-y-3">
                        {uaeBanks.map((bank) => (
                          <motion.div
                            key={bank.swift}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              onClick={() => setSelectedBank(bank.swift)}
                              className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                                selectedBank === bank.swift
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-zinc-200 dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-500 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-zinc-900 dark:text-white">
                                      {bank.name}
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                      {t('common.swiftCode')}: {bank.swift}
                                    </p>
                                  </div>
                                </div>
                                {selectedBank === bank.swift && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                                        <Button
                        onClick={handleNext}
                        disabled={!selectedBank}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    <span>{t('common.continue')}</span>
                    <ArrowRight className={`w-5 h-5 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </motion.section>
              )}

              {/* Step 3: Beneficiary Details */}
              {step === 'details' && (
                <motion.section
                  key="details"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-green-500" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {t('sendMoney.personalDetails')}
                        </h3>
                      </div>

                      {/* Auto-detected name */}
                      {validation.accountTitle && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            {t('sendMoney.detectedAccountHolder')}: {validation.accountTitle}
                          </p>
                        </div>
                      )}

                      {/* Name Input */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t('common.fullName')} *
                        </label>
                        <input
                          type="text"
                          placeholder={validation.accountTitle || t('sendMoney.enterFullName')}
                          value={beneficiaryData.fullName}
                          onChange={(e) => setBeneficiaryData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Nickname */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t('common.nickname')} ({t('common.optional')})
                        </label>
                        <input
                          type="text"
                          placeholder={t('sendMoney.enterNickname')}
                          value={beneficiaryData.nickname}
                          onChange={(e) => setBeneficiaryData(prev => ({ ...prev, nickname: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Advanced Details Toggle */}
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{showAdvanced ? t('common.hideAdvanced') : t('common.showAdvanced')}</span>
                      </button>

                      {/* Advanced Details */}
                      <AnimatePresence>
                        {showAdvanced && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-4"
                          >
                            {/* Relationship */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {t('common.relationship')}
                              </label>
                              <select
                                value={beneficiaryData.relationship}
                                onChange={(e) => setBeneficiaryData(prev => ({ ...prev, relationship: e.target.value }))}
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="">{t('common.selectRelationship')}</option>
                                {relationships.map(rel => (
                                  <option key={rel} value={rel}>{rel}</option>
                                ))}
                              </select>
                            </div>

                            {/* Purpose */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {t('common.purpose')}
                              </label>
                              <select
                                value={beneficiaryData.purpose}
                                onChange={(e) => setBeneficiaryData(prev => ({ ...prev, purpose: e.target.value }))}
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="">{t('common.selectPurpose')}</option>
                                {purposes.map(purpose => (
                                  <option key={purpose} value={purpose}>{purpose}</option>
                                ))}
                              </select>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {t('common.email')}
                                </label>
                                <input
                                  type="email"
                                  placeholder={t('sendMoney.enterEmail')}
                                  value={beneficiaryData.email}
                                  onChange={(e) => setBeneficiaryData(prev => ({ ...prev, email: e.target.value }))}
                                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {t('common.phoneNumber')}
                                </label>
                                <input
                                  type="tel"
                                  placeholder={t('sendMoney.enterPhone')}
                                  value={beneficiaryData.phone}
                                  onChange={(e) => setBeneficiaryData(prev => ({ ...prev, phone: e.target.value }))}
                                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleNext}
                    disabled={!beneficiaryData.fullName.trim() && !validation.accountTitle}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    <span>{t('common.reviewDetails')}</span>
                    <ArrowRight className={`w-5 h-5 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </motion.section>
              )}

              {/* Step 4: Review */}
              {step === 'review' && (
                <motion.section
                  key="review"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {t('sendMoney.reviewRecipient')}
                        </h3>
                      </div>

                      {/* Beneficiary Summary */}
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-lime-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {(validation.accountTitle || beneficiaryData.fullName).charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-white">
                              {validation.accountTitle || beneficiaryData.fullName}
                            </h4>
                            {beneficiaryData.nickname && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                "{beneficiaryData.nickname}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Account Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-zinc-900 dark:text-white">
                          {t('sendMoney.accountInformation')}
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">{t('common.bank')}:</span>
                            <span className="font-medium">{validation.bankDetails?.bankName}</span>
                          </div>
                          
                          {beneficiaryData.accountType === 'iban' ? (
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-600 dark:text-zinc-400">IBAN:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs">
                                  {showAccountMask 
                                    ? `${beneficiaryData.accountInput.slice(0, 8)}****${beneficiaryData.accountInput.slice(-4)}`
                                    : formatIBAN(beneficiaryData.accountInput)
                                  }
                                </span>
                                <button
                                  onClick={() => setShowAccountMask(!showAccountMask)}
                                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded"
                                >
                                  {showAccountMask ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(beneficiaryData.accountInput)}
                                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded"
                                >
                                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between">
                              <span className="text-zinc-600 dark:text-zinc-400">{t('common.accountNumber')}:</span>
                              <span className="font-mono text-xs">
                                {showAccountMask 
                                  ? `****${beneficiaryData.accountInput.slice(-4)}`
                                  : beneficiaryData.accountInput
                                }
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">{t('common.currency')}:</span>
                            <span className="font-medium">{validation.bankDetails?.currency}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">{t('common.swiftCode')}:</span>
                            <span className="font-mono text-xs">{validation.bankDetails?.swiftCode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      {(beneficiaryData.relationship || beneficiaryData.purpose || beneficiaryData.email || beneficiaryData.phone) && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-zinc-900 dark:text-white">
                            {t('sendMoney.additionalDetails')}
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            {beneficiaryData.relationship && (
                              <div className="flex justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('common.relationship')}:</span>
                                <span>{beneficiaryData.relationship}</span>
                              </div>
                            )}
                            
                            {beneficiaryData.purpose && (
                              <div className="flex justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('common.purpose')}:</span>
                                <span>{beneficiaryData.purpose}</span>
                              </div>
                            )}
                            
                            {beneficiaryData.email && (
                              <div className="flex justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('common.email')}:</span>
                                <span className="text-xs">{beneficiaryData.email}</span>
                              </div>
                            )}
                            
                            {beneficiaryData.phone && (
                              <div className="flex justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('common.phoneNumber')}:</span>
                                <span>{beneficiaryData.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleFinish('save')}
                        variant="outline"
                        className="w-full py-3 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl font-medium transition-all duration-200"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {t('common.saveOnly')}
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleFinish('pay')}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {t('sendMoney.saveAndPay')}
                      </Button>
                    </motion.div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
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