import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  EyeOff,
  Search,
  Filter,
  Calendar,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

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
  category?: string;
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
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    recipient: "John Smith",
    reference: "REF123456",
    category: "Transfer"
  },
  {
    id: "txn_002",
    type: "receive",
    title: "Money Received",
    description: "From Sarah Johnson",
    amount: 150.00,
    currency: "USD",
    status: "completed",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    recipient: "Sarah Johnson",
    reference: "REF789012",
    category: "Transfer"
  },
  {
    id: "txn_003",
    type: "bill",
    title: "Electricity Bill",
    description: "DEWA Payment",
    amount: -89.50,
    currency: "AED",
    status: "completed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reference: "BILL345678",
    category: "Utilities"
  },
  {
    id: "txn_004",
    type: "card",
    title: "Card Top-up",
    description: "Visa ending 4532",
    amount: -500.00,
    currency: "USD",
    status: "pending",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reference: "CARD901234",
    category: "Card"
  },
  {
    id: "txn_005",
    type: "promotion",
    title: "Cashback Reward",
    description: "Monthly bonus",
    amount: 25.00,
    currency: "USD",
    status: "completed",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reference: "PROMO567890",
    category: "Rewards"
  },
  {
    id: "txn_006",
    type: "bill",
    title: "Internet Bill",
    description: "Etisalat Payment",
    amount: -199.00,
    currency: "AED",
    status: "completed",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reference: "BILL123890",
    category: "Utilities"
  },
  {
    id: "txn_007",
    type: "send",
    title: "Money Transfer",
    description: "To Ahmed Ali",
    amount: -75.00,
    currency: "AED",
    status: "failed",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    recipient: "Ahmed Ali",
    reference: "REF456789",
    category: "Transfer"
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
      return "text-orange-500 dark:text-orange-400";
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const TransactionHistoryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const handleTransactionClick = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction);
    // TODO: Navigate to transaction details
  };

  const handleExport = () => {
    console.log('Export transactions');
    // TODO: Implement export functionality
  };

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    
    filteredTransactions.forEach(transaction => {
      const dateKey = formatDate(transaction.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header 
        title="Transaction History" 
        showProfile={false}
        rightContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="w-8 h-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            aria-label={hideAmounts ? "Show amounts" : "Hide amounts"}
          >
            {hideAmounts ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        }
      />

      <div className="flex-1 overflow-hidden">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-4 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filters
              </Button>
              {(statusFilter !== "all" || typeFilter !== "all") && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Filters applied
                </span>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>

          {/* Filter Controls */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex-1 min-w-32">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 min-w-32">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="send">Send Money</SelectItem>
                      <SelectItem value="receive">Receive Money</SelectItem>
                      <SelectItem value="bill">Bill Payment</SelectItem>
                      <SelectItem value="card">Card Transaction</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupedTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Receipt className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                No transactions found
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Your transaction history will appear here"}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {groupedTransactions.map(([date, transactions], groupIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 px-2">
                      {date}
                    </h3>
                  </div>
                  
                  <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <CardContent className="p-0">
                      {transactions.map((transaction, index) => {
                        const IconComponent = getTransactionIcon(transaction.type);
                        const StatusIcon = getStatusIcon(transaction.status);
                        
                        return (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="px-4 py-4 cursor-pointer transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 border-b border-zinc-100 dark:border-zinc-600 last:border-b-0"
                            onClick={() => handleTransactionClick(transaction)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                {/* Transaction Icon */}
                                <div className={`
                                  w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                                  ${transaction.type === 'send' ? 'bg-red-100 dark:bg-red-900/30' : ''}
                                  ${transaction.type === 'receive' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                                  ${transaction.type === 'bill' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                                  ${transaction.type === 'card' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                                  ${transaction.type === 'promotion' ? 'bg-pink-100 dark:bg-pink-900/30' : ''}
                                `}>
                                  <IconComponent className={`
                                    w-5 h-5
                                    ${transaction.type === 'send' ? 'text-red-600 dark:text-red-400' : ''}
                                    ${transaction.type === 'receive' ? 'text-green-600 dark:text-green-400' : ''}
                                    ${transaction.type === 'bill' ? 'text-orange-600 dark:text-orange-400' : ''}
                                    ${transaction.type === 'card' ? 'text-blue-600 dark:text-blue-400' : ''}
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
                                      <div className="flex items-center space-x-2 mt-1.5">
                                        <StatusIcon className={`w-3 h-3 ${getStatusColor(transaction.status)}`} />
                                        <span className={`text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                                          {transaction.status}
                                        </span>
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                          • {formatTimeAgo(transaction.timestamp)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Amount and Arrow */}
                              <div className="flex items-center space-x-3 flex-shrink-0">
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}; 