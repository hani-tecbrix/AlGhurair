import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../contexts/NavigationContext";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  ArrowLeftRight, CreditCard, User, X,
  Banknote, Receipt, Smartphone, QrCode, Building2,
  History, Gift, Settings, ChevronUp, Sparkles,
  TrendingUp, Plus, BarChart3
} from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface BottomSheetAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  route?: string;
}

const getNavItems = (t: (key: string) => string) => [
  {
    id: "exchange",
    label: t('nav.exchange'),
    icon: ArrowLeftRight,
    hasSheet: false
  },
  {
    id: "payments",
    label: t('nav.payments'),
    icon: CreditCard,
    hasSheet: true
  },
  {
    id: "accounts",
    label: t('nav.accounts'), 
    icon: User,
    hasSheet: true
  },
];

const paymentActions: BottomSheetAction[] = [
  {
    id: "pay-anyone",
    label: "Pay Anyone",
    description: "Send money to anyone instantly",
    icon: Banknote,
    route: "send-money-new-beneficiary"
  },
  {
    id: "pay-bills",
    label: "Pay Bills",
    description: "Utilities, telecom, and more",
    icon: Receipt,
    route: "bill-payment"
  },
  {
    id: "top-up",
    label: "Top Up",
    description: "Mobile, gaming, and prepaid",
    icon: Smartphone,
    route: "top-up"
  },
  {
    id: "qr-pay",
    label: "QR Pay",
    description: "Scan and pay instantly",
    icon: QrCode,
    route: "qr-pay"
  }
];

const accountActions: BottomSheetAction[] = [
  {
    id: "transaction-tracker",
    label: "Transaction Tracker",
    description: "Track and manage all transactions",
    icon: BarChart3,
    route: "transaction-tracker"
  },
  {
    id: "accounts-list",
    label: "List of Accounts",
    description: "View all your accounts",
    icon: Building2,
    route: "accounts"
  },
  {
    id: "manage-cards",
    label: "Manage Cards",
    description: "Add, remove, or edit cards",
    icon: CreditCard,
    route: "manage-cards"
  },
  {
    id: "transaction-history",
    label: "Transaction History",
    description: "View your past transactions",
    icon: History,
    route: "transaction-history"
  },
  {
    id: "promotions",
    label: "Promotions",
    description: "Exclusive offers and rewards",
    icon: Gift,
    route: "promotions"
  },
  {
    id: "profile-settings",
    label: "Profile Settings",
    description: "Manage personal information & preferences",
    icon: Settings,
    route: "profile-settings"
  }
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  const navItems = getNavItems(t);
  const [sheetType, setSheetType] = useState<'payments' | 'accounts' | null>(null);

  // Handle tab clicks
  const handleTabClick = (item: { id: string; label: string; icon: React.ElementType; hasSheet: boolean }) => {
    if (item.hasSheet) {
      setSheetType(item.id as 'payments' | 'accounts');
      setShowBottomSheet(true);
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100]);
      }
    } else {
      onTabChange(item.id);
      if (item.id === 'home') {
        navigateTo('home');
      } else if (item.id === 'tracker') {
        navigateTo('transaction-tracker');
      } else if (item.id === 'exchange') {
        navigateTo('home');
      }
    }
  };

  // Handle action clicks
  const handleActionClick = (action: BottomSheetAction) => {
    closeSheet();
    if (action.route) {
      // Add a small delay for smooth animation
      setTimeout(() => {
        navigateTo(action.route!);
      }, 200);
    }
  };

  // Close sheet with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBottomSheet) {
        setShowBottomSheet(false);
        setSheetType(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showBottomSheet]);

  // Close sheet function
  const closeSheet = () => {
    setShowBottomSheet(false);
    setSheetType(null);
  };

  const currentActions = sheetType === 'payments' ? paymentActions : accountActions;
  const sheetTitle = sheetType === 'payments' ? 'Payment Services' : 'Account Management';

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-t border-zinc-200/50 dark:border-zinc-700/50 safe-area-bottom z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-md mx-auto">
          <div className={`flex items-center justify-around py-2 px-4 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex flex-col items-center justify-center py-3 px-2 relative min-w-0 flex-1 transition-all duration-300 group ${
                  activeTab === item.id
                    ? "text-green-600"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                aria-label={`${item.label} ${item.hasSheet ? 'menu' : 'tab'}`}
                role="tab"
                aria-selected={activeTab === item.id}
                aria-expanded={item.hasSheet ? showBottomSheet && sheetType === item.id : undefined}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-lime-400 to-green-600 rounded-full"
                      layoutId="activeTab"
                      initial={{ width: 0 }}
                      animate={{ width: 48 }}
                      exit={{ width: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 30 
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Glow effect for active tab */}
                <AnimatePresence>
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with enhanced animations */}
                <motion.div
                  animate={{
                    scale: activeTab === item.id ? 1.2 : 1,
                    rotateY: activeTab === item.id ? [0, 15, 0] : 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    duration: 0.6
                  }}
                  className="mb-1 relative"
                >
                  <item.icon className="w-5 h-5" />
                  
                  {/* Sheet indicator */}
                  {item.hasSheet && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Label with slide animation */}
                <motion.span 
                  className="text-xs font-medium leading-tight"
                  animate={{
                    y: activeTab === item.id ? -2 : 0,
                    fontWeight: activeTab === item.id ? 600 : 500
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.label}
                </motion.span>

                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-current opacity-0"
                  whileTap={{ 
                    opacity: [0, 0.1, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeSheet}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 rounded-t-3xl shadow-xl z-50 max-w-md mx-auto max-h-[85vh] flex flex-col"
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <motion.div 
                className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full cursor-grab active:cursor-grabbing"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            </div>

            {/* Sheet Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: 5 }}
                  >
                    <Sparkles className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {sheetTitle}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Choose a service to continue
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={closeSheet}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Sheet Content */}
            <div className="px-6 py-6 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {currentActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className="group p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-transparent transition-all duration-300 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -4,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
                    
                    <div className="relative">
                      {/* Icon */}
                      <motion.div
                        className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <action.icon className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                      </motion.div>
                      
                      {/* Content */}
                      <div className="text-left">
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                          {action.label}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Arrow Indicator */}
                      <motion.div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 2 }}
                      >
                        <ChevronUp className="w-4 h-4 text-zinc-400 rotate-45" />
                      </motion.div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-700 safe-area-bottom">
              <motion.button
                onClick={closeSheet}
                className="w-full py-3 text-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Swipe down or tap to close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};