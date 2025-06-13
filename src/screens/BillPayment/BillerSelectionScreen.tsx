import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Search, Building2, Star, StarOff, Zap, Phone, CheckCircle } from 'lucide-react';

interface Biller {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  logo?: string;
  isPopular: boolean;
  isFavorite: boolean;
  supportedFields: string[];
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

const billersByCategory: { [key: string]: Biller[] } = {
  utilities: [
    {
      id: 'dewa',
      name: 'DEWA',
      fullName: 'Dubai Electricity and Water Authority',
      category: 'utilities',
      description: 'Electricity and water bills',
      isPopular: true,
      isFavorite: false,
      supportedFields: ['billNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: 'Instant'
    },
    {
      id: 'addc',
      name: 'ADDC',
      fullName: 'Abu Dhabi Distribution Company',
      category: 'utilities',
      description: 'Electricity distribution services',
      isPopular: true,
      isFavorite: false,
      supportedFields: ['billNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: 'Instant'
    },
    {
      id: 'sewa',
      name: 'SEWA',
      fullName: 'Sharjah Electricity and Water Authority',
      category: 'utilities',
      description: 'Sharjah electricity and water services',
      isPopular: false,
      isFavorite: false,
      supportedFields: ['billNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: 'Instant'
    },
    {
      id: 'fewa',
      name: 'FEWA',
      fullName: 'Federal Electricity and Water Authority',
      category: 'utilities',
      description: 'Federal electricity and water services',
      isPopular: false,
      isFavorite: false,
      supportedFields: ['billNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: 'Instant'
    }
  ],
  telecom: [
    {
      id: 'etisalat',
      name: 'Etisalat',
      fullName: 'Emirates Telecommunications Corporation',
      category: 'telecom',
      description: 'Mobile and internet services',
      isPopular: true,
      isFavorite: false,
      supportedFields: ['mobileNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 5000,
      processingTime: 'Instant'
    },
    {
      id: 'du',
      name: 'du',
      fullName: 'Emirates Integrated Telecommunications Company',
      category: 'telecom',
      description: 'Mobile and internet services',
      isPopular: true,
      isFavorite: false,
      supportedFields: ['mobileNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 5000,
      processingTime: 'Instant'
    },
    {
      id: 'virgin',
      name: 'Virgin Mobile',
      fullName: 'Virgin Mobile UAE',
      category: 'telecom',
      description: 'Mobile services',
      isPopular: false,
      isFavorite: false,
      supportedFields: ['mobileNumber'],
      minAmount: 1,
      maxAmount: 2000,
      processingTime: 'Instant'
    }
  ],
  government: [
    {
      id: 'rta',
      name: 'RTA',
      fullName: 'Roads and Transport Authority',
      category: 'government',
      description: 'Traffic fines and vehicle services',
      isPopular: true,
      isFavorite: false,
      supportedFields: ['plateNumber', 'trafficFileNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: '1-2 hours'
    },
    {
      id: 'dubai-municipality',
      name: 'Dubai Municipality',
      fullName: 'Dubai Municipality',
      category: 'government',
      description: 'Municipal services and permits',
      isPopular: false,
      isFavorite: false,
      supportedFields: ['permitNumber', 'accountNumber'],
      minAmount: 1,
      maxAmount: 50000,
      processingTime: '2-4 hours'
    }
  ]
};

export const BillerSelectionScreen: React.FC = () => {
  const { navigateTo, screenParams } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("exchange");

  const category = screenParams?.category || 'utilities';
  const billers = billersByCategory[category] || [];

  const filteredBillers = useMemo(() => {
    if (!searchQuery) return billers;
    return billers.filter(
      biller =>
        biller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biller.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biller.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [billers, searchQuery]);

  const popularBillers = filteredBillers.filter(biller => biller.isPopular);
  const otherBillers = filteredBillers.filter(biller => !biller.isPopular);

  const handleBillerSelect = (biller: Biller) => {
    navigateTo('bill-payment-details', { biller });
  };

  const toggleFavorite = (billerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev =>
      prev.includes(billerId)
        ? prev.filter(id => id !== billerId)
        : [...prev, billerId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'utilities': return Zap;
      case 'telecom': return Phone;
      case 'government': return Building2;
      default: return Building2;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'utilities': return t('billers.utilities');
      case 'telecom': return t('billers.telecom');
      case 'government': return t('billers.government');
      case 'education': return t('billers.education');
      case 'insurance': return t('billers.insurance');
      default: return t('billers.other');
    }
  };

  const renderBillerCard = (biller: Biller, index: number) => {
    const isFavorite = favorites.includes(biller.id);
    
    return (
      <motion.div
        key={biller.id}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        custom={index}
      >
        <Card 
          className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
          onClick={() => handleBillerSelect(biller)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-lime-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {biller.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {biller.name}
                    </h3>
                    {biller.isPopular && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                    {biller.fullName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {biller.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {biller.processingTime}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => toggleFavorite(biller.id, e)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                {isFavorite ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-5 h-5 text-zinc-400" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="biller-selection" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-3"
            >
                                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-lime-500 rounded-xl flex items-center justify-center">
                {React.createElement(getCategoryIcon(category), { className: "w-6 h-6 text-white" })}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {getCategoryTitle(category)}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t('billPayment.selectBiller')}
                </p>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-zinc-400`} />
              <input
                type="text"
                placeholder={`${t('common.search')} ${getCategoryTitle(category).toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </motion.div>

            {/* Popular Billers */}
            {popularBillers.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Popular Billers
                </h2>
                <div className="space-y-3">
                  {popularBillers.map((biller, index) => renderBillerCard(biller, index))}
                </div>
              </motion.div>
            )}

            {/* Other Billers */}
            {otherBillers.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  All Billers
                </h2>
                <div className="space-y-3">
                  {otherBillers.map((biller, index) => renderBillerCard(biller, popularBillers.length + index))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {filteredBillers.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <Search className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  No Billers Found
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Try adjusting your search terms
                </p>
              </motion.div>
            )}
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