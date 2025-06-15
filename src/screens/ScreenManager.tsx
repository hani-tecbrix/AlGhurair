import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
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
import { CurrencyConverterScreen } from './CurrencyConverterScreen';
import { PayWithQRScreen } from './PayWithQRScreen';
import { TopUpScreen } from './TopUpScreen';
import { TransactionHistoryScreen } from './TransactionHistoryScreen';

const screenTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
};

export const ScreenManager: React.FC = () => {
  const { currentScreen, screenHistory } = useNavigation();
  
  console.log('ScreenManager: currentScreen =', currentScreen);
  console.log('ScreenManager: screenHistory =', screenHistory);
  
  // Track previous length to know if we pushed or popped
  const prevLen = useRef(screenHistory.length);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setDirection(screenHistory.length >= prevLen.current ? 1 : -1);
    prevLen.current = screenHistory.length;
  }, [screenHistory]);

  // Determine if current screen should behave like a bottom sheet
  const bottomSheetScreens = [
    'add-card',
    'edit-card',
    'card-settings',
    'add-transaction',
    'edit-transaction',
  ];

  const isSheet = bottomSheetScreens.includes(currentScreen);

  useEffect(() => {
    if (isSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSheet]);

  const screenVariants = {
    enter: (dir: number) =>
      isSheet
        ? { y: 600, opacity: 0 }
        : { x: dir > 0 ? 300 : -300, opacity: 0 },
    center: { x: 0, y: 0, opacity: 1, zIndex: 1 },
    exit: (dir: number) =>
      isSheet
        ? { y: 600, opacity: 0, zIndex: 0 }
        : { x: dir < 0 ? 300 : -300, opacity: 0, zIndex: 0 },
  };

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
      case 'currency-converter':
        return <CurrencyConverterScreen />;
      case 'top-up':
        return <TopUpScreen />;
      case 'qr-pay':
        return <PayWithQRScreen />;
      case 'transaction-history':
        return <TransactionHistoryScreen />;
      case 'accounts':
      case 'promotions':
        return <ComingSoonScreen />;
      default:
        console.log('ScreenManager: rendering ComingSoonScreen for unknown screen:', screen);
        return <ComingSoonScreen />;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      {isSheet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
      <motion.div
        key={currentScreen}
        custom={direction}
        variants={screenVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={screenTransition}
        className={`${
          isSheet
            ? 'z-50 flex flex-col justify-end'
            : ''
        }`}
      >
        <div
          className={
            isSheet
              ? 'bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto'
              : ''
          }
        >
          {['splash', 'login'].includes(currentScreen) ? (
            renderScreen(currentScreen)
          ) : (
            <MotionConfig reducedMotion="always">
              {renderScreen(currentScreen)}
            </MotionConfig>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 