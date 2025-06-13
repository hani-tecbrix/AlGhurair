import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Banknote, CreditCard, Receipt, LocateFixed } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";
import { useLanguage } from "../contexts/LanguageContext";

interface ActionItem {
  id: string;
  titleKey: string;
  icon: React.ElementType;
  iconPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay: number;
  route?: string;
}

const getActions = (t: (key: string) => string): ActionItem[] => [
  {
    id: "send",
    titleKey: "quickActions.sendMoney",
    icon: Banknote,
    iconPosition: "top-left",
    delay: 0.1,
    route: "/send-money",
  },
  {
    id: "cards",
    titleKey: "quickActions.manageCards",
    icon: CreditCard,
    iconPosition: "top-right",
    delay: 0.2,
    route: "/manage-cards",
  },
  {
    id: "bills",
    titleKey: "quickActions.billPayment",
    icon: Receipt,
    iconPosition: "bottom-left",
    delay: 0.3,
    route: "/bill-payment",
  },
  {
    id: "transaction-tracker",
    titleKey: "quickActions.transactionTracker",
    icon: LocateFixed,
    iconPosition: "bottom-right",
    delay: 0.4,
    route: "/transaction-tracker",
  },
];

const getIconPositionClasses = (position: ActionItem['iconPosition']) => {
  const baseClasses = "absolute w-16 h-16 flex items-center justify-center ";
  
  switch (position) {
    case 'top-left':
      return `${baseClasses} top-0 left-0`;
    case 'top-right':
      return `${baseClasses} top-0 right-0`;
    case 'bottom-left':
      return `${baseClasses} bottom-0 left-0`;
    case 'bottom-right':
      return `${baseClasses} bottom-0 right-0`;
    default:
      return `${baseClasses} top-0 left-0`;
  }
};

const getTextPositionClasses = (position: ActionItem['iconPosition']) => {
  const baseClasses = "absolute font-semibold text-zinc-900 dark:text-white text-sm leading-tight";
  
  switch (position) {
    case 'top-left':
      return `${baseClasses} top-6 left-16 right-6`;
    case 'top-right':
      return `${baseClasses} top-6 left-6 right-16 text-right`;
    case 'bottom-left':
      return `${baseClasses} bottom-6 left-16 right-3`;
    case 'bottom-right':
      return `${baseClasses} bottom-4 left-1 right-16 text-right`;
    default:
      return `${baseClasses} bottom-6 left-6 right-6`;
  }
};

export const QuickActions: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const actions = getActions(t);

  const handleActionClick = (action: ActionItem) => {
    console.log(`Navigating to ${t(action.titleKey)} - ${action.route}`);
    console.log('Action clicked:', action);
    
    try {
      switch (action.id) {
        case 'send':
          console.log('Navigating to send-money-beneficiary...');
          navigateTo('send-money-beneficiary');
          break;
        case 'cards':
          navigateTo('manage-cards');
          break;
        case 'bills':
          navigateTo('bill-payment');
          break;
        case 'transaction-tracker':
          navigateTo('transaction-tracker');
          break;
        default:
          console.log('Unknown action:', action.id);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'direction-rtl' : ''}`}>
      {actions.map((action) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: action.delay, 
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.03,
            y: -4,
            transition: { duration: 0.2, type: "spring", stiffness: 400 }
          }}
          whileTap={{ 
            scale: 0.97,
            transition: { duration: 0.1 }
          }}
          className="aspect-square cursor-pointer transform-gpu"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('QuickActions: Card clicked for action:', action.id, t(action.titleKey));
            handleActionClick(action);
          }}
        >
          <Card 
            className="w-full h-full bg-[#FFFFFC] dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 hover:shadow-xl hover:border-green-300 dark:hover:border-zinc-500 transition-all duration-300 group overflow-hidden pointer-events-none shadow-sm"
          >
            <CardContent className="p-0 w-full h-full relative">
              {/* Background overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-green-50 dark:bg-zinc-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
              />
              
              {/* Subtle gradient border effect */}
              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <motion.div
                className={`${getIconPositionClasses(action.iconPosition)} `}
                whileHover={{ 
                  rotate: 5,
                  scale: 1.1,
                  backgroundColor: "rgba(34, 197, 94, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <action.icon className="w-8 h-8 text-green-600 dark:text-green-400 drop-shadow-sm" />
              </motion.div>

              {/* Text */}
              <div className={getTextPositionClasses(action.iconPosition)}>
                <motion.span
                  className="block text-zinc-800 dark:text-zinc-100 font-semibold text-sm leading-tight drop-shadow-sm"
                  initial={{ opacity: 0.85 }}
                  whileHover={{ opacity: 1, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {t(action.titleKey)}
                </motion.span>
              </div>

              {/* Hover effect indicator */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent group-hover:border-green-300/60 dark:group-hover:border-green-600/40 rounded-lg transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};