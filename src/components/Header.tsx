import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "../contexts/NavigationContext";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bell, Sun, Moon, Globe, ArrowLeft } from "lucide-react";
import headerLogo from "../assets/AGEX_Header.png";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { currentScreen, canGoBack, goBack } = useNavigation();

  const isSubScreen = currentScreen !== 'home';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 w-full bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700 z-50 safe-area-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-md mx-auto">
        <div className={`flex items-center justify-between px-4 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Back Button / Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubScreen && canGoBack ? (
              <motion.button
                onClick={goBack}
                className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors ${isRTL ? 'rotate-180' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={t('common.back')}
              >
                <ArrowLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </motion.button>
            ) : (
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={headerLogo} alt="AGEX" className="object-contain w-full h-full" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {t('header.alGhurairExchange')}
                  </h1>
                </div>
              </div>
            )}
          </motion.div>

          {/* Page Title for Sub Screens */}
          {isSubScreen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 text-center"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {getScreenTitle(currentScreen, t)}
              </h2>
            </motion.div>
          )}

          {/* Actions */}
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-16 h-8 border-0 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">{language}</span>
                </motion.div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center space-x-2">
                    <span>🇺🇸</span>
                    <span>English</span>
                  </div>
                </SelectItem>
                <SelectItem value="ar">
                  <div className="flex items-center space-x-2">
                    <span>🇦🇪</span>
                    <span>العربية</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.div>
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 relative hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Helper function to get screen titles
const getScreenTitle = (screen: string, t: (key: string) => string): string => {
  const titleMap: { [key: string]: string } = {
    'bill-payment': t('billPayment.title'),
    'bill-payment-biller-selection': t('billPayment.selectBiller'),
    'bill-payment-details': t('billPayment.enterDetails'),
    'bill-payment-confirmation': t('billPayment.confirm'),
    'bill-payment-success': t('billPayment.success'),
    'send-money-beneficiary': t('quickActions.sendMoney'),
    'manage-cards': t('quickActions.manageCards'),
    'transaction-tracker': t('quickActions.transactionTracker'),
  };

  return titleMap[screen] || '';
};