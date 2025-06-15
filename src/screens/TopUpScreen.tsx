import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Zap, 
  Plus, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Receipt,
  ArrowRight,
  Phone,
  Wifi,
  Star,
  User,
  Search,
  Filter
} from "lucide-react";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import etisalatLogo from "../assets/logo_Etisalat_solid.png";
import duLogo from "../assets/logo_Du_white.png";

interface MobileOperator {
  id: string;
  name: string;
  logo: string;
  color: string;
  plans: TopUpPlan[];
  supportedServices: string[];
}

interface TopUpPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  validity: string;
  benefits: string[];
  popular?: boolean;
  type: 'prepaid' | 'postpaid' | 'data' | 'international';
}

interface RecentTopUp {
  id: string;
  operatorId: string;
  operatorName: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  reference: string;
}

const mobileOperators: MobileOperator[] = [
  {
    id: 'etisalat',
    name: 'Etisalat',
    logo: etisalatLogo,
    color: 'bg-lime-600',
    supportedServices: ['Prepaid', 'Postpaid', 'Data'],
    plans: [
      {
        id: 'eti_001',
        name: 'Weekly Flexi',
        amount: 20,
        currency: 'AED',
        validity: '7 Days',
        benefits: ['Unlimited local calls', '1GB Data'],
        type: 'prepaid'
      },
      {
        id: 'eti_002',
        name: 'Monthly Flexi',
        amount: 65,
        currency: 'AED',
        validity: '30 Days',
        benefits: ['Unlimited local calls', '5GB Data'],
        popular: true,
        type: 'prepaid'
      }
    ]
  },
  {
    id: 'du',
    name: 'du',
    logo: duLogo,
    color: 'bg-cyan-600',
    supportedServices: ['Prepaid', 'Postpaid', 'Data'],
    plans: [
      {
        id: 'du_001',
        name: 'Freedom Weekly',
        amount: 25,
        currency: 'AED',
        validity: '7 Days',
        benefits: ['100 mins', '2GB Data'],
        type: 'prepaid'
      },
      {
        id: 'du_002',
        name: 'Freedom Monthly',
        amount: 75,
        currency: 'AED',
        validity: '30 Days',
        benefits: ['Unlimited calls', '8GB Data'],
        popular: true,
        type: 'prepaid'
      }
    ]
  }
];

const recentTopUps: RecentTopUp[] = [
  {
    id: 'topup_001',
    operatorId: 'etisalat',
    operatorName: 'Etisalat',
    phoneNumber: '+971501234567',
    amount: 65,
    currency: 'AED',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
    reference: 'TOP123456'
  },
  {
    id: 'topup_002',
    operatorId: 'du',
    operatorName: 'du',
    phoneNumber: '+971521234567',
    amount: 75,
    currency: 'AED',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'success',
    reference: 'TOP789012'
  }
];

export const TopUpScreen: React.FC = () => {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'operators' | 'recent' | 'favorites'>('operators');
  const [searchQuery, setSearchQuery] = useState("");
  const [planType, setPlanType] = useState<string>("all");

  const selectedOperatorData = useMemo(() => {
    return mobileOperators.find(op => op.id === selectedOperator);
  }, [selectedOperator]);

  const filteredPlans = useMemo(() => {
    if (!selectedOperatorData) return [];
    
    return selectedOperatorData.plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plan.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = planType === "all" || plan.type === planType;

      return matchesSearch && matchesType;
    });
  }, [selectedOperatorData, searchQuery, planType]);

  const handleOperatorSelect = (operatorId: string) => {
    setSelectedOperator(operatorId);
    setSelectedPlan(null);
    setCustomAmount("");
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setCustomAmount("");
  };

  const handleTopUp = () => {
    if (!phoneNumber || (!selectedPlan && !customAmount)) return;
    
    console.log('Processing top-up:', {
      operator: selectedOperator,
      phone: phoneNumber,
      plan: selectedPlan,
      customAmount
    });
    // TODO: Navigate to confirmation screen
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

  const getStatusColor = (status: RecentTopUp['status']) => {
    switch (status) {
      case 'success':
        return "text-green-600 dark:text-green-400";
      case 'pending':
        return "text-orange-500 dark:text-orange-400";
      case 'failed':
        return "text-red-600 dark:text-red-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  };

  const getStatusIcon = (status: RecentTopUp['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const resetSelection = () => {
    setSelectedOperator(null);
    setSelectedPlan(null);
    setCustomAmount("");
    setPhoneNumber("");
  };

  return (
    <div className="max-w-md mx-auto flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900" style={{ paddingTop: '64px' }}>
      <Header />

      <div className="flex-1 overflow-hidden">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2">
          <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg p-1">
            {[
              { id: 'operators', label: 'Top Up', icon: Smartphone },
              { id: 'recent', label: 'Recent', icon: Clock },
              { id: 'favorites', label: 'Favorites', icon: Star }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-xs ${
                  activeTab === tab.id 
                    ? "bg-white dark:bg-zinc-600 shadow-sm" 
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-600"
                }`}
              >
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'operators' && (
              <motion.div
                key="operators"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 space-y-4"
              >
                {!selectedOperator ? (
                  <>
                    {/* Operator Selection */}
                    <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                          <Smartphone className="w-5 h-5 mr-2 text-lime-600" />
                          Select Mobile Operator
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-3">
                        {mobileOperators.map((operator, index) => (
                          <motion.div
                            key={operator.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleOperatorSelect(operator.id)}
                            className="cursor-pointer group"
                          >
                            <div className="flex items-center space-x-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-600">
                              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-700">
                                <img src={operator.logo} alt={operator.name} className="object-contain w-10 h-10" />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                  {operator.name}
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {operator.supportedServices.slice(0, 2).map(service => (
                                    <Badge key={service} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {operator.supportedServices.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{operator.supportedServices.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    {/* Back to Operators */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSelection}
                        className="text-xs"
                      >
                        ← Back to Operators
                      </Button>
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 ${selectedOperatorData?.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                          {selectedOperatorData?.logo}
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {selectedOperatorData?.name}
                        </span>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-green-600" />
                          Enter Phone Number
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Input
                            placeholder="+971 50 123 4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="text-lg font-mono"
                            type="tel"
                          />
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Enter the mobile number you want to top up
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Search and Filter */}
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          placeholder="Search plans..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 text-sm"
                        />
                      </div>
                      <Select value={planType} onValueChange={setPlanType}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="prepaid">Prepaid</SelectItem>
                          <SelectItem value="data">Data Only</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Plans */}
                    <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                          Select Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {filteredPlans.map((plan, index) => (
                          <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`cursor-pointer p-4 border rounded-xl transition-all ${
                              selectedPlan === plan.id
                                ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    {plan.name}
                                  </h3>
                                  {plan.popular && (
                                    <Badge className="bg-orange-500 text-white text-xs">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                                  <div>
                                    <span className="font-medium">Amount:</span> {plan.amount} {plan.currency}
                                  </div>
                                  <div>
                                    <span className="font-medium">Validity:</span> {plan.validity}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  {plan.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                                      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Custom Amount */}
                        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                          <h4 className="font-medium text-zinc-900 dark:text-white mb-3">
                            Or enter custom amount
                          </h4>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter amount"
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedPlan(null);
                              }}
                              type="number"
                              className="flex-1"
                            />
                            <span className="flex items-center px-3 bg-zinc-100 dark:bg-zinc-700 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400">
                              AED
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Proceed Button */}
                    {phoneNumber && (selectedPlan || customAmount) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          onClick={handleTopUp}
                          className="w-full bg-lime-600 hover:bg-lime-700 text-white py-3"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-purple-600" />
                      Recent Top Ups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentTopUps.length === 0 ? (
                      <div className="p-8 text-center">
                        <Receipt className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                        <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                          No Recent Top Ups
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Your top up history will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {recentTopUps.map((topup, index) => {
                          const StatusIcon = getStatusIcon(topup.status);
                          const operator = mobileOperators.find(op => op.id === topup.operatorId);
                          
                          return (
                            <motion.div
                              key={topup.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${operator?.color || 'bg-zinc-500'} rounded-full flex items-center justify-center text-white`}>
                                  {operator?.logo || '📱'}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-zinc-900 dark:text-white">
                                    {topup.operatorName}
                                  </h3>
                                  <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                    {topup.phoneNumber}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <StatusIcon className={`w-3 h-3 ${getStatusColor(topup.status)}`} />
                                    <span className={`text-xs font-medium capitalize ${getStatusColor(topup.status)}`}>
                                      {topup.status}
                                    </span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                      • {formatTimeAgo(topup.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-right flex-shrink-0">
                                  <p className="font-semibold text-zinc-900 dark:text-white">
                                    {topup.amount} {topup.currency}
                                  </p>
                                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {topup.reference}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                      No Favorites Yet
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Save frequently used numbers for quick access
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}; 