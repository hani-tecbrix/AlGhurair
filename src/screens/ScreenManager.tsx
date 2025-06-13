import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';
import { HomeScreen } from './HomeScreen';
import { BeneficiaryScreen } from './SendMoney/BeneficiaryScreen';
import { EnhancedBeneficiaryScreen } from './SendMoney/EnhancedBeneficiaryScreen';
import { NewBeneficiaryScreen } from './SendMoney/NewBeneficiaryScreen';
import { EnhancedNewBeneficiaryScreen } from './SendMoney/EnhancedNewBeneficiaryScreen';
import { AmountScreen } from './SendMoney/AmountScreen';
import { ConfirmationScreen } from './SendMoney/ConfirmationScreen';
import { BillPaymentScreen } from './BillPayment/BillPaymentScreen';
import { BillerSelectionScreen } from './BillPayment/BillerSelectionScreen';
import { BillDetailsScreen } from './BillPayment/BillDetailsScreen';
import { ConfirmationScreen as BillConfirmationScreen } from './BillPayment/ConfirmationScreen';
import { SuccessScreen } from './BillPayment/SuccessScreen';
import { TransactionTrackerScreen } from './TransactionTracker/TransactionTrackerScreen';
import { TransactionDetailsScreen } from './TransactionTracker/TransactionDetailsScreen';
import { AddTransactionScreen } from './TransactionTracker/AddTransactionScreen';
import { TransactionAnalyticsScreen } from './TransactionTracker/TransactionAnalyticsScreen';
import { ManageCardsScreen } from './ManageCards/ManageCardsScreen';
import { AddCardScreen } from './ManageCards/AddCardScreen';
import { CardDetailsScreen } from './ManageCards/CardDetailsScreen';
import { TransactionTrackScreen } from './TransactionTracker/TransactionTrackScreen';
import { ComingSoonScreen } from './ComingSoonScreen';
import { ProfileSettingsScreen } from './ProfileSettingsScreen';

const screenVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const screenTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export const ScreenManager: React.FC = () => {
  const { currentScreen, screenHistory } = useNavigation();
  
  console.log('ScreenManager: currentScreen =', currentScreen);
  console.log('ScreenManager: screenHistory =', screenHistory);
  
  // Determine animation direction based on navigation history
  const direction = screenHistory.length > 1 ? 1 : -1;

  const renderScreen = (screen: string) => {
    console.log('ScreenManager: rendering screen:', screen);
    switch (screen) {
      case 'home':
        console.log('ScreenManager: rendering HomeScreen');
        return <HomeScreen />;
      case 'send-money-beneficiary':
        console.log('ScreenManager: rendering EnhancedBeneficiaryScreen');
        return <EnhancedBeneficiaryScreen />;
      case 'send-money-new-beneficiary':
        console.log('ScreenManager: rendering EnhancedNewBeneficiaryScreen');
        return <EnhancedNewBeneficiaryScreen />;
      case 'send-money-amount':
        console.log('ScreenManager: rendering AmountScreen');
        return <AmountScreen />;
      case 'send-money-confirmation':
        console.log('ScreenManager: rendering ConfirmationScreen');
        return <ConfirmationScreen />;
      case 'bill-payment':
        console.log('ScreenManager: rendering BillPaymentScreen');
        return <BillPaymentScreen />;
      case 'bill-payment-biller-selection':
        console.log('ScreenManager: rendering BillerSelectionScreen');
        return <BillerSelectionScreen />;
      case 'bill-payment-details':
        console.log('ScreenManager: rendering BillDetailsScreen');
        return <BillDetailsScreen />;
      case 'bill-payment-confirmation':
        console.log('ScreenManager: rendering BillConfirmationScreen');
        return <BillConfirmationScreen />;
      case 'bill-payment-success':
        console.log('ScreenManager: rendering SuccessScreen');
        return <SuccessScreen />;
      case 'transaction-tracker':
        console.log('ScreenManager: rendering TransactionTrackScreen');
        return <TransactionTrackScreen />;
      case 'transaction-details':
        console.log('ScreenManager: rendering TransactionDetailsScreen');
        return <TransactionDetailsScreen />;
      case 'add-transaction':
        console.log('ScreenManager: rendering AddTransactionScreen');
        return <AddTransactionScreen />;
      case 'edit-transaction':
        console.log('ScreenManager: rendering AddTransactionScreen for editing');
        return <AddTransactionScreen />;
      case 'transaction-analytics':
        console.log('ScreenManager: rendering TransactionAnalyticsScreen');
        return <TransactionAnalyticsScreen />;
      case 'manage-cards':
        return <ManageCardsScreen />;
      case 'add-card':
        return <AddCardScreen />;
      case 'card-details':
        return <CardDetailsScreen />;
      case 'edit-card':
        return <CardDetailsScreen />;
      case 'card-settings':
        return <CardDetailsScreen />;
      case 'profile-settings':
        return <ProfileSettingsScreen />;
      case 'top-up':
      case 'qr-pay':
      case 'accounts':
      case 'transaction-history':
      case 'promotions':
        return <ComingSoonScreen />;
      default:
        console.log('ScreenManager: rendering ComingSoonScreen for unknown screen:', screen);
        return <ComingSoonScreen />;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentScreen}
        custom={direction}
        variants={screenVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={screenTransition}
        className="inset-0"
      >
        {renderScreen(currentScreen)}
      </motion.div>
    </AnimatePresence>
  );
}; 