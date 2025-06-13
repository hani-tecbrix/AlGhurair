import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigation } from "../../contexts/NavigationContext";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  User, 
  Star,
  Clock,
  ChevronRight
} from "lucide-react";

interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  iban?: string;
  isStarred: boolean;
  lastUsed: Date;
  avatar?: string;
}

const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben_001",
    name: "John Smith",
    bank: "Emirates NBD",
    accountNumber: "****1234",
    iban: "AE07 0331 2345 6789 0123 456",
    isStarred: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ben_002",
    name: "Sarah Johnson",
    bank: "ADCB Bank",
    accountNumber: "****5678",
    iban: "AE12 0123 4567 8901 2345 678",
    isStarred: false,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ben_003",
    name: "Mohammed Ali",
    bank: "FAB Bank",
    accountNumber: "****9012",
    iban: "AE45 0987 6543 2109 8765 432",
    isStarred: true,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  }
};

export const BeneficiaryScreen: React.FC = () => {
  const { goBack, navigateTo } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(mockBeneficiaries);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBeneficiaries(mockBeneficiaries);
    } else {
      const filtered = mockBeneficiaries.filter(
        ben => 
          ben.name.toLowerCase().includes(query.toLowerCase()) ||
          ben.bank.toLowerCase().includes(query.toLowerCase()) ||
          ben.accountNumber.includes(query)
      );
      setFilteredBeneficiaries(filtered);
    }
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    navigateTo('send-money-amount', { beneficiary });
  };

  const handleAddNewBeneficiary = () => {
    navigateTo('send-money-new-beneficiary');
  };

  // Sort beneficiaries: starred first, then by last used
  const sortedBeneficiaries = [...filteredBeneficiaries].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return b.lastUsed.getTime() - a.lastUsed.getTime();
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 min-h-screen">
        {/* Header */}
        <motion.div
          className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Send Money
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Select beneficiary
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search by name, bank, or account"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </motion.div>

          {/* Add New Beneficiary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer"
              onClick={handleAddNewBeneficiary}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Add New Beneficiary</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Send money to someone new
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Beneficiaries List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Recent Recipients
              </h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {filteredBeneficiaries.length} found
              </span>
            </div>

            <AnimatePresence mode="wait">
              {sortedBeneficiaries.length > 0 ? (
                <div className="space-y-2">
                  {sortedBeneficiaries.map((beneficiary, index) => (
                    <motion.div
                      key={beneficiary.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-md transition-all duration-200 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500"
                        onClick={() => handleBeneficiarySelect(beneficiary)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              {beneficiary.isStarred && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Star className="w-3 h-3 text-white fill-current" />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                                  {beneficiary.name}
                                </h3>
                                <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                                {beneficiary.bank} • {beneficiary.accountNumber}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {formatTimeAgo(beneficiary.lastUsed)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-2">No recipients found</p>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    Try adjusting your search or add a new beneficiary
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 