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
  Plus, 
  Eye, 
  EyeOff, 
  Settings, 
  Lock, 
  Unlock,
  MoreVertical,
  Star,
  Wallet,
  Shield,
  Smartphone,
  Nfc,
  Activity,
  TrendingUp,
  Calendar,
  DollarSign,
  Filter,
  Search,
  ScanLine,
  ChevronRight,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface PaymentCard {
  id: string;
  type: 'credit' | 'debit' | 'prepaid';
  brand: 'visa' | 'mastercard' | 'amex';
  name: string;
  number: string;
  maskedNumber: string;
  expiryDate: string;
  balance?: string;
  currency: string;
  isDefault: boolean;
  isBlocked: boolean;
  isFavorite: boolean;
  lastUsed: string;
  monthlySpend: string;
  cardholderName: string;
  status: 'active' | 'blocked' | 'expired' | 'pending';
  features: ('contactless' | 'virtual' | 'premium' | 'rewards')[];
  color: 'gradient-blue' | 'gradient-purple' | 'gradient-green' | 'gradient-gold' | 'gradient-black';
}

const mockCards: PaymentCard[] = [
  {
    id: '1',
    type: 'credit',
    brand: 'visa',
    name: 'Al Ghurair Platinum',
    number: '4532123456789012',
    maskedNumber: '**** **** **** 9012',
    expiryDate: '12/26',
    balance: '15,750.00',
    currency: 'AED',
    isDefault: true,
    isBlocked: false,
    isFavorite: true,
    lastUsed: '2024-01-10',
    monthlySpend: '2,450.00',
    cardholderName: 'Ahmed Al Mansouri',
    status: 'active',
    features: ['contactless', 'premium', 'rewards'],
    color: 'gradient-gold'
  },
  {
    id: '2',
    type: 'debit',
    brand: 'mastercard',
    name: 'Savings Account',
    number: '5412123456789012',
    maskedNumber: '**** **** **** 9012',
    expiryDate: '09/25',
    balance: '8,250.00',
    currency: 'AED',
    isDefault: false,
    isBlocked: false,
    isFavorite: false,
    lastUsed: '2024-01-08',
    monthlySpend: '1,200.00',
    cardholderName: 'Ahmed Al Mansouri',
    status: 'active',
    features: ['contactless', 'virtual'],
    color: 'gradient-blue'
  },
  {
    id: '3',
    type: 'prepaid',
    brand: 'visa',
    name: 'Travel Card',
    number: '4111123456789012',
    maskedNumber: '**** **** **** 9012',
    expiryDate: '06/25',
    balance: '500.00',
    currency: 'USD',
    isDefault: false,
    isBlocked: true,
    isFavorite: false,
    lastUsed: '2023-12-15',
    monthlySpend: '0.00',
    cardholderName: 'Ahmed Al Mansouri',
    status: 'blocked',
    features: ['contactless'],
    color: 'gradient-purple'
  }
];

const cardGradients = {
  'gradient-blue': 'from-blue-500 via-blue-600 to-indigo-700',
  'gradient-purple': 'from-green-500 via-green-600 to-pink-600',
  'gradient-green': 'from-green-500 via-emerald-600 to-teal-700',
  'gradient-gold': 'from-yellow-400 via-orange-500 to-red-500',
  'gradient-black': 'from-gray-800 via-gray-900 to-black'
};

export const ManageCardsScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [cards, setCards] = useState<PaymentCard[]>(mockCards);
  const [showBalance, setShowBalance] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("cards");
  const [bottomNavTab, setBottomNavTab] = useState("exchange");
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'prepaid'>('all');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize balance visibility for all cards as hidden
    const initialVisibility = cards.reduce((acc, card) => {
      acc[card.id] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    setShowBalance(initialVisibility);
  }, [cards]);

  const toggleBalanceVisibility = (cardId: string) => {
    setShowBalance(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleCardMenu = (cardId: string) => {
    setShowMenu(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleCardAction = (cardId: string, action: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    switch (action) {
      case 'view':
        navigateTo('card-details', { cardId });
        break;
      case 'edit':
        navigateTo('edit-card', { cardId });
        break;
      case 'settings':
        navigateTo('card-settings', { cardId });
        break;
      case 'block':
        setCards(prev => prev.map(c => 
          c.id === cardId ? { ...c, isBlocked: !c.isBlocked, status: c.isBlocked ? 'active' : 'blocked' } : c
        ));
        break;
      case 'favorite':
        setCards(prev => prev.map(c => 
          c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c
        ));
        break;
      case 'default':
        setCards(prev => prev.map(c => ({
          ...c,
          isDefault: c.id === cardId ? true : false
        })));
        break;
    }
    setShowMenu({});
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.maskedNumber.includes(searchQuery);
    const matchesFilter = filterType === 'all' || card.type === filterType;
    return matchesSearch && matchesFilter;
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
    },
    hover: {
      scale: 1.02,
      y: -8,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'blocked': return 'text-red-400';
      case 'expired': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'blocked': return Lock;
      case 'expired': return AlertTriangle;
      case 'pending': return Clock;
      default: return Activity;
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
        <div id="manage-cards" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {t('manageCards.title')}
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {t('manageCards.subtitle')}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigateTo('add-card')}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('manageCards.addCard')}
                  </Button>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Cards</p>
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{cards.length}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Active</p>
                      <p className="text-lg font-bold text-green-800 dark:text-green-300">
                        {cards.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">This Month</p>
                      <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                        {cards.reduce((sum, card) => sum + parseFloat(card.monthlySpend.replace(',', '')), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-zinc-400`} />
                  <input
                    type="text"
                    placeholder={t('manageCards.searchCards')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200"
                >
                  <Filter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </motion.button>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-white dark:bg-zinc-800 p-1 rounded-xl shadow-sm">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'credit', label: 'Credit' },
                  { id: 'debit', label: 'Debit' },
                  { id: 'prepaid', label: 'Prepaid' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id as any)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                      filterType === filter.id
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Cards Grid */}
            <motion.div variants={containerVariants} className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredCards.map((card, index) => {
                  const StatusIcon = getStatusIcon(card.status);
                  return (
                    <motion.div
                      key={card.id}
                      variants={cardVariants}
                      whileHover="hover"
                      layout
                      className="relative"
                    >
                      {/* Card */}
                      <div 
                        className={`relative p-6 bg-gradient-to-br ${cardGradients[card.color]} rounded-2xl shadow-xl text-white overflow-hidden cursor-pointer`}
                        onClick={() => handleCardAction(card.id, 'view')}
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
                              <span className="text-2xl">{getCardIcon(card.brand)}</span>
                              <div>
                                <h3 className="font-bold text-lg">{card.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <StatusIcon className={`w-4 h-4 ${getStatusColor(card.status)}`} />
                                  <span className="text-sm opacity-90 capitalize">{card.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="flex items-center space-x-2">
                            {card.isFavorite && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Heart className="w-5 h-5 text-red-300 fill-current" />
                              </motion.div>
                            )}
                            {card.isDefault && (
                              <div className="px-2 py-1 bg-white/20 rounded-full">
                                <span className="text-xs font-medium">Default</span>
                              </div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardMenu(card.id);
                              }}
                              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Card Number */}
                        <div className="relative mb-6">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg tracking-wider">
                              {card.maskedNumber}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBalanceVisibility(card.id);
                              }}
                              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                            >
                              {showBalance[card.id] ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </motion.button>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="relative flex items-end justify-between">
                          <div>
                            <p className="text-sm opacity-80">Balance</p>
                            <p className="text-xl font-bold">
                              {showBalance[card.id] ? (
                                `${card.currency} ${card.balance}`
                              ) : (
                                '••••••'
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm opacity-80">Expires</p>
                            <p className="font-mono">{card.expiryDate}</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="relative mt-4 flex items-center space-x-2">
                          {card.features.map((feature) => (
                            <div key={feature} className="flex items-center space-x-1">
                              {feature === 'contactless' && <Nfc className="w-4 h-4" />}
                              {feature === 'virtual' && <Smartphone className="w-4 h-4" />}
                              {feature === 'premium' && <Star className="w-4 h-4" />}
                              {feature === 'rewards' && <Zap className="w-4 h-4" />}
                            </div>
                          ))}
                        </div>

                        {/* Card Menu */}
                        <AnimatePresence>
                          {showMenu[card.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute top-16 right-4 bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-2 z-10 min-w-[200px]"
                            >
                              <div className="space-y-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardAction(card.id, 'view');
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200"
                                >
                                  <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                  <span className="text-zinc-900 dark:text-white">View Details</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardAction(card.id, 'edit');
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200"
                                >
                                  <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                  <span className="text-zinc-900 dark:text-white">Edit Card</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardAction(card.id, 'favorite');
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200"
                                >
                                  <Heart className={`w-4 h-4 ${card.isFavorite ? 'text-red-500 fill-current' : 'text-zinc-600 dark:text-zinc-400'}`} />
                                  <span className="text-zinc-900 dark:text-white">
                                    {card.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                  </span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardAction(card.id, 'default');
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200"
                                  disabled={card.isDefault}
                                >
                                  <Star className={`w-4 h-4 ${card.isDefault ? 'text-yellow-500 fill-current' : 'text-zinc-600 dark:text-zinc-400'}`} />
                                  <span className="text-zinc-900 dark:text-white">
                                    {card.isDefault ? 'Default Card' : 'Set as Default'}
                                  </span>
                                </button>
                                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardAction(card.id, 'block');
                                  }}
                                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200 ${
                                    card.isBlocked ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {card.isBlocked ? (
                                    <Unlock className="w-4 h-4" />
                                  ) : (
                                    <Lock className="w-4 h-4" />
                                  )}
                                  <span>
                                    {card.isBlocked ? 'Unblock Card' : 'Block Card'}
                                  </span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Usage Stats */}
                      <motion.div
                        variants={itemVariants}
                        className="mt-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Activity className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-white">Monthly Spending</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Last used: {new Date(card.lastUsed).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-zinc-900 dark:text-white">
                              {card.currency} {card.monthlySpend}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCardAction(card.id, 'view')}
                              className="text-xs text-green-600 dark:text-green-400 hover:underline"
                            >
                              View Details
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty State */}
              {filteredCards.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <CreditCard className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    No Cards Found
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Add your first payment card to get started'}
                  </p>
                  <Button
                    onClick={() => navigateTo('add-card')}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Card
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('add-card')}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-300">Add New Card</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <ScanLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-800 dark:text-blue-300">Scan Card</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
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