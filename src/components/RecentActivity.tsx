import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigation } from "../contexts/NavigationContext";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Receipt, 
  Gift, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'bill' | 'card' | 'promotion';
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  recipient?: string;
  reference?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "send",
    title: "Money Transfer",
    description: "To John Smith",
    amount: -250.00,
    currency: "USD",
    status: "completed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    recipient: "John Smith",
    reference: "REF123456"
  },
  {
    id: "txn_002",
    type: "receive",
    title: "Money Received",
    description: "From Sarah Johnson",
    amount: 150.00,
    currency: "USD",
    status: "completed",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    recipient: "Sarah Johnson",
    reference: "REF789012"
  },
  {
    id: "txn_003",
    type: "bill",
    title: "Electricity Bill",
    description: "DEWA Payment",
    amount: -89.50,
    currency: "AED",
    status: "completed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    reference: "BILL345678"
  },
  {
    id: "txn_004",
    type: "card",
    title: "Card Top-up",
    description: "Visa ending 4532",
    amount: -500.00,
    currency: "USD",
    status: "pending",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    reference: "CARD901234"
  },
  {
    id: "txn_005",
    type: "promotion",
    title: "Cashback Reward",
    description: "Monthly bonus",
    amount: 25.00,
    currency: "USD",
    status: "completed",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    reference: "PROMO567890"
  }
];

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'send':
      return ArrowUpRight;
    case 'receive':
      return ArrowDownLeft;
    case 'bill':
      return Receipt;
    case 'card':
      return CreditCard;
    case 'promotion':
      return Gift;
    default:
      return ArrowUpRight;
  }
};

const getStatusIcon = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'pending':
      return Clock;
    case 'failed':
      return XCircle;
    default:
      return AlertCircle;
  }
};

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return "text-green-600 dark:text-green-400";
    case 'pending':
      return "text-yellow-600 dark:text-yellow-400";
    case 'failed':
      return "text-red-600 dark:text-red-400";
    default:
      return "text-zinc-600 dark:text-zinc-400";
  }
};

const getAmountColor = (amount: number) => {
  return amount >= 0 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400";
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const formatAmount = (amount: number, currency: string, hideAmount: boolean) => {
  if (hideAmount) {
    return '***.**';
  }
  
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${Math.abs(amount).toFixed(2)} ${currency}`;
};

export const RecentActivity: React.FC = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const { navigateTo } = useNavigation();
  
  const displayedTransactions = showAllTransactions 
    ? mockTransactions 
    : mockTransactions.slice(0, 3);

  const handleTransactionClick = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction);
    // TODO: Navigate to transaction details
  };

  const handleShowAllClick = () => {
    navigateTo('transaction-history');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
              Recent Activity
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHideAmounts(!hideAmounts)}
                className="w-8 h-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {hideAmounts ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <div className="space-y-0">
              {displayedTransactions.map((transaction, index) => {
                const IconComponent = getTransactionIcon(transaction.type);
                const StatusIcon = getStatusIcon(transaction.status);
                
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-600/50 border-b border-zinc-100 dark:border-zinc-600 last:border-b-0"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Transaction Icon */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                          ${transaction.type === 'send' ? 'bg-red-100 dark:bg-red-900/30' : ''}
                          ${transaction.type === 'receive' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                          ${transaction.type === 'bill' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                          ${transaction.type === 'card' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                          ${transaction.type === 'promotion' ? 'bg-pink-100 dark:bg-pink-900/30' : ''}
                        `}>
                          <IconComponent className={`
                            w-5 h-5
                            ${transaction.type === 'send' ? 'text-red-600 dark:text-red-400' : ''}
                            ${transaction.type === 'receive' ? 'text-green-600 dark:text-green-400' : ''}
                            ${transaction.type === 'bill' ? 'text-orange-600 dark:text-orange-400' : ''}
                            ${transaction.type === 'card' ? 'text-green-600 dark:text-green-400' : ''}
                            ${transaction.type === 'promotion' ? 'text-pink-600 dark:text-pink-400' : ''}
                          `} />
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                {transaction.title}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {transaction.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <StatusIcon className={`w-3 h-3 ${getStatusColor(transaction.status)}`} />
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                  {formatTimeAgo(transaction.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Arrow */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${getAmountColor(transaction.amount)}`}>
                            {formatAmount(transaction.amount, transaction.currency, hideAmounts)}
                          </p>
                          {transaction.reference && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              {transaction.reference}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Show More/Less Button */}
          {mockTransactions.length > 3 && (
            <motion.div
              className="p-4 border-t border-zinc-100 dark:border-zinc-600"
              whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
            >
              <Button
                variant="ghost"
                onClick={handleShowAllClick}
                className="w-full text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Show All Transactions ({mockTransactions.length})
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 