import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Header } from "../../components/Header";
import { BottomNavigation } from "../../components/BottomNavigation";
import { 
  Search, 
  Plus, 
  User, 
  Star,
  Clock,
  ChevronRight,
  Building2,
  CreditCard,
  Globe,
  Check,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Heart,
  History
} from "lucide-react";

interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  bankCode: string;
  accountNumber: string;
  iban?: string;
  isStarred: boolean;
  lastUsed: Date;
  avatar?: string;
  country: string;
  currency: string;
  accountType: 'savings' | 'current' | 'business';
  isVerified: boolean;
  frequency: number;
}

interface BankDetails {
  bankName: string;
  bankCode: string;
  country: string;
  currency: string;
  isValid: boolean;
}

interface AccountValidation {
  isValid: boolean;
  accountTitle?: string;
  bankDetails?: BankDetails;
  error?: string;
  isLoading: boolean;
}

const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben_001",
    name: "Ahmed Al Mansouri",
    bank: "Emirates NBD",
    bankCode: "EBILAEAD",
    accountNumber: "1234567890",
    iban: "AE070331234567890123456",
    isStarred: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    country: "UAE",
    currency: "AED",
    accountType: 'current',
    isVerified: true,
    frequency: 15
  },
  {
    id: "ben_002", 
    name: "Sarah Johnson",
    bank: "ADCB Bank",
    bankCode: "ADCBAEAA",
    accountNumber: "9876543210",
    iban: "AE120123456789012345678",
    isStarred: false,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    country: "UAE",
    currency: "AED",
    accountType: 'savings',
    isVerified: true,
    frequency: 8
  },
  {
    id: "ben_003",
    name: "Mohammed Ali",
    bank: "FAB Bank", 
    bankCode: "NBADAEAA",
    accountNumber: "5555666677",
    iban: "AE450987654321098765432",
    isStarred: true,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    country: "UAE",
    currency: "AED",
    accountType: 'business',
    isVerified: true,
    frequency: 12
  },
];

const uaeBanks = [
  { name: "Emirates NBD", code: "EBILAEAD", swift: "EBILAEAD" },
  { name: "ADCB Bank", code: "ADCBAEAA", swift: "ADCBAEAA" },
  { name: "FAB Bank", code: "NBADAEAA", swift: "NBADAEAA" },
  { name: "RAKBANK", code: "NRAKAEAK", swift: "NRAKAEAK" },
  { name: "Mashreq Bank", code: "BOMLAEAD", swift: "BOMLAEAD" },
  { name: "CBD Bank", code: "CBDAAEAA", swift: "CBDAAEAA" },
];

// IBAN validation for UAE
const validateIBAN = (iban: string): boolean => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!cleanIban.match(/^AE\d{21}$/)) return false;
  
  // Move first 4 characters to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  
  // Replace letters with numbers (A=10, B=11, etc.)
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  // Calculate mod 97
  let remainder = '';
  for (let i = 0; i < numericString.length; i += 7) {
    remainder = ((parseInt(remainder + numericString.slice(i, i + 7)) % 97)).toString();
  }
  
  return parseInt(remainder) === 1;
};

// Extract bank code from IBAN
const getBankFromIBAN = (iban: string): BankDetails | null => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!validateIBAN(cleanIban)) return null;
  
  const bankCode = cleanIban.slice(4, 7);
  const bank = uaeBanks.find(b => b.code.includes(bankCode));
  
  if (bank) {
    return {
      bankName: bank.name,
      bankCode: bank.swift,
      country: "UAE",
      currency: "AED",
      isValid: true
    };
  }
  
  return null;
};

// Mock API call to validate account
const validateAccount = async (input: string, bankCode?: string): Promise<AccountValidation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cleanInput = input.replace(/\s/g, '').toUpperCase();
      
      // Check if it's an IBAN
      if (cleanInput.startsWith('AE') && cleanInput.length === 23) {
        if (validateIBAN(cleanInput)) {
          const bankDetails = getBankFromIBAN(cleanInput);
          if (bankDetails) {
            resolve({
              isValid: true,
              accountTitle: "Ahmed Al Mansouri",
              bankDetails,
              isLoading: false
            });
          } else {
            resolve({
              isValid: false,
              error: "Invalid bank code in IBAN",
              isLoading: false
            });
          }
        } else {
          resolve({
            isValid: false,
            error: "Invalid IBAN format",
            isLoading: false
          });
        }
      } 
      // Check if it's an account number
      else if (cleanInput.match(/^\d{10,12}$/)) {
        if (bankCode) {
          const bank = uaeBanks.find(b => b.code === bankCode || b.swift === bankCode);
          if (bank) {
            resolve({
              isValid: true,
              accountTitle: "Sarah Johnson",
              bankDetails: {
                bankName: bank.name,
                bankCode: bank.swift,
                country: "UAE",
                currency: "AED",
                isValid: true
              },
              isLoading: false
            });
          } else {
            resolve({
              isValid: false,
              error: "Invalid bank selected",
              isLoading: false
            });
          }
        } else {
          resolve({
            isValid: false,
            error: "Bank details required for account number",
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
    }, 1500);
  });
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
};

const formatIBAN = (iban: string) => {
  return iban.replace(/(.{4})/g, '$1 ').trim();
};

export const EnhancedBeneficiaryScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("exchange");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(mockBeneficiaries);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddInput, setQuickAddInput] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [validation, setValidation] = useState<AccountValidation>({ isValid: false, isLoading: false });
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [showAccountMask, setShowAccountMask] = useState(true);
  
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

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBeneficiaries(mockBeneficiaries);
    } else {
      const filtered = mockBeneficiaries.filter(
        ben => 
          ben.name.toLowerCase().includes(query.toLowerCase()) ||
          ben.bank.toLowerCase().includes(query.toLowerCase()) ||
          ben.accountNumber.includes(query) ||
          ben.iban?.includes(query.toUpperCase())
      );
      setFilteredBeneficiaries(filtered);
    }
  }, []);

  // Quick add validation
  useEffect(() => {
    if (quickAddInput.length > 5) {
      setValidation({ isValid: false, isLoading: true });
      
      const timeoutId = setTimeout(() => {
        validateAccount(quickAddInput, selectedBank).then(setValidation);
      }, 800);

      return () => clearTimeout(timeoutId);
    } else {
      setValidation({ isValid: false, isLoading: false });
      setShowBankSelection(false);
    }
  }, [quickAddInput, selectedBank]);

  // Handle quick add input change
  const handleQuickAddInput = (value: string) => {
    setQuickAddInput(value);
    
    // Check if it looks like an account number (needs bank selection)
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue.match(/^\d{8,}$/) && !cleanValue.startsWith('AE')) {
      setShowBankSelection(true);
    } else {
      setShowBankSelection(false);
      setSelectedBank("");
    }
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    navigateTo('send-money-amount', { beneficiary });
  };

  const handleQuickAddComplete = () => {
    if (validation.isValid && validation.accountTitle && validation.bankDetails) {
      const newBeneficiary: Beneficiary = {
        id: `ben_${Date.now()}`,
        name: validation.accountTitle,
        bank: validation.bankDetails.bankName,
        bankCode: validation.bankDetails.bankCode,
        accountNumber: quickAddInput.match(/^\d+$/) ? quickAddInput : '',
        iban: quickAddInput.startsWith('AE') ? quickAddInput : undefined,
        isStarred: false,
        lastUsed: new Date(),
        country: validation.bankDetails.country,
        currency: validation.bankDetails.currency,
        accountType: 'current',
        isVerified: true,
        frequency: 0
      };
      
      navigateTo('send-money-amount', { beneficiary: newBeneficiary });
    }
  };

  // Sort beneficiaries intelligently
  const sortedBeneficiaries = [...filteredBeneficiaries].sort((a, b) => {
    // Starred first
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    
    // Then by frequency
    if (a.frequency !== b.frequency) return b.frequency - a.frequency;
    
    // Then by last used
    return b.lastUsed.getTime() - a.lastUsed.getTime();
  });

  const getFrequencyBadge = (frequency: number) => {
    if (frequency >= 10) return { text: 'Frequent', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
    if (frequency >= 5) return { text: 'Regular', color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300' };
    if (frequency >= 1) return { text: 'Occasional', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' };
    return null;
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="send-money-beneficiary" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.section 
              variants={itemVariants}
              className="text-center space-y-2"
            >
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {t('sendMoney.selectRecipient')}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t('sendMoney.selectRecipientDesc')}
              </p>
            </motion.section>

            {/* Search */}
            <motion.section 
              variants={itemVariants}
              className="relative"
            >
              <Search className={`absolute top-3 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-400`} />
              <input
                placeholder={t('sendMoney.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </motion.section>

            {/* Quick Add Toggle */}
            <motion.section 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {t('sendMoney.quickSend')}
              </h2>
              <motion.button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  showQuickAdd 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{showQuickAdd ? t('common.hide') : t('common.show')}</span>
              </motion.button>
            </motion.section>

            {/* Quick Add Section */}
            <AnimatePresence>
              {showQuickAdd && (
                <motion.section
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Card className="bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {t('sendMoney.smartDetection')}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {t('sendMoney.smartDetectionDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Smart Input Field */}
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={t('sendMoney.ibanOrAccountPlaceholder')}
                            value={quickAddInput}
                            onChange={(e) => handleQuickAddInput(e.target.value)}
                            className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              validation.isValid 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                : validation.error 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'border-zinc-200 dark:border-zinc-600'
                            } ${isRTL ? 'text-right' : 'text-left'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          
                          {/* Loading/Status Indicator */}
                          <div className={`absolute top-3 ${isRTL ? 'left-4' : 'right-4'}`}>
                            {validation.isLoading ? (
                              <Loader className="w-5 h-5 text-lime-500 animate-spin" />
                            ) : validation.isValid ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : validation.error ? (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            ) : null}
                          </div>
                        </div>

                        {/* Format Helper */}
                        {quickAddInput && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-zinc-500 dark:text-zinc-400"
                          >
                            {quickAddInput.startsWith('AE') || quickAddInput.toUpperCase().startsWith('AE') 
                              ? `IBAN Format: ${formatIBAN(quickAddInput.toUpperCase())}`
                              : `Account Number: ${quickAddInput}`
                            }
                          </motion.div>
                        )}

                        {/* Bank Selection (for account numbers) */}
                        <AnimatePresence>
                          {showBankSelection && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {t('sendMoney.selectBank')}
                                </label>
                                <select
                                  value={selectedBank}
                                  onChange={(e) => setSelectedBank(e.target.value)}
                                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="">{t('sendMoney.chooseBankPlaceholder')}</option>
                                  {uaeBanks.map((bank) => (
                                    <option key={bank.code} value={bank.swift}>
                                      {bank.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Validation Results */}
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

                          {validation.isValid && validation.accountTitle && validation.bankDetails && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-2"
                            >
                              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                                <Check className="w-5 h-5" />
                                <span className="font-medium">{t('sendMoney.accountVerified')}</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">{t('common.accountTitle')}:</span> {validation.accountTitle}</p>
                                <p><span className="font-medium">{t('common.bank')}:</span> {validation.bankDetails.bankName}</p>
                                <p><span className="font-medium">{t('common.currency')}:</span> {validation.bankDetails.currency}</p>
                              </div>
                              
                              <motion.button
                                onClick={handleQuickAddComplete}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
                              >
                                {t('sendMoney.continueWithRecipient')}
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Add New Beneficiary Card */}
            <motion.section 
              variants={itemVariants}
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 cursor-pointer"
                  onClick={() => navigateTo('send-money-new-beneficiary')}
                >
                  <CardContent className="p-4">
                    <div className={`flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t('sendMoney.addNewBeneficiary')}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {t('sendMoney.addNewBeneficiaryDesc')}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>

            {/* Beneficiaries List */}
            <motion.section 
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {t('sendMoney.savedRecipients')}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {filteredBeneficiaries.length} {t('common.found')}
                  </span>
                  <motion.button
                    onClick={() => setShowAccountMask(!showAccountMask)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200"
                    aria-label={showAccountMask ? t('common.showAccounts') : t('common.hideAccounts')}
                  >
                    {showAccountMask ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {sortedBeneficiaries.length === 0 ? (
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
                      {t('sendMoney.noRecipientsFound')}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t('sendMoney.noRecipientsFoundDesc')}
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {sortedBeneficiaries.map((beneficiary, index) => (
                      <motion.div
                        key={beneficiary.id}
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
                          onClick={() => handleBeneficiarySelect(beneficiary)}
                        >
                          <CardContent className="p-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-lime-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                      {beneficiary.name.charAt(0)}
                                    </span>
                                  </div>
                                  {beneficiary.isStarred && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                      <Star className="w-3 h-3 text-white fill-current" />
                                    </div>
                                  )}
                                  {beneficiary.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-700">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                                      {beneficiary.name}
                                    </h3>
                                    {getFrequencyBadge(beneficiary.frequency) && (
                                      <span className={`px-2 py-1 text-xs rounded-full ${getFrequencyBadge(beneficiary.frequency)?.color}`}>
                                        {getFrequencyBadge(beneficiary.frequency)?.text}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <Building2 className="w-4 h-4" />
                                    <span>{beneficiary.bank}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    {beneficiary.iban ? (
                                      <>
                                        <Globe className="w-4 h-4" />
                                        <span>
                                          {showAccountMask 
                                            ? `IBAN: ${beneficiary.iban.slice(0, 8)}****${beneficiary.iban.slice(-4)}`
                                            : `IBAN: ${formatIBAN(beneficiary.iban)}`
                                          }
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <CreditCard className="w-4 h-4" />
                                        <span>
                                          {showAccountMask 
                                            ? `****${beneficiary.accountNumber.slice(-4)}`
                                            : beneficiary.accountNumber
                                          }
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className="text-right">
                                  <div className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTimeAgo(beneficiary.lastUsed)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    <History className="w-3 h-3" />
                                    <span>{beneficiary.frequency} {t('sendMoney.transfers')}</span>
                                  </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-zinc-400 ${isRTL ? 'rotate-180' : ''}`} />
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