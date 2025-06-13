import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Award,
  AlertTriangle,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyGrowth: number;
  topCategories: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
  }[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
  }[];
  goals: {
    id: string;
    title: string;
    target: number;
    current: number;
    category: string;
    deadline: string;
  }[];
  insights: {
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    actionText?: string;
  }[];
}

const mockAnalyticsData: AnalyticsData = {
  totalIncome: 25500,
  totalExpenses: 18250,
  netIncome: 7250,
  monthlyGrowth: 12.5,
  topCategories: [
    { category: 'Food & Dining', amount: 3200, percentage: 35, color: 'bg-red-500', icon: '🍽️' },
    { category: 'Shopping', amount: 2800, percentage: 30, color: 'bg-blue-500', icon: '🛍️' },
    { category: 'Transportation', amount: 1500, percentage: 16, color: 'bg-green-500', icon: '🚗' },
    { category: 'Entertainment', amount: 900, percentage: 10, color: 'bg-green-500', icon: '🎬' },
    { category: 'Other', amount: 850, percentage: 9, color: 'bg-gray-500', icon: '📊' }
  ],
  monthlyTrends: [
    { month: 'Oct', income: 8500, expenses: 6200 },
    { month: 'Nov', income: 8500, expenses: 5800 },
    { month: 'Dec', income: 8500, expenses: 6250 },
    { month: 'Jan', income: 8500, expenses: 5950 }
  ],
  goals: [
    {
      id: '1',
      title: 'Emergency Fund',
      target: 50000,
      current: 32000,
      category: 'savings',
      deadline: '2024-12-31'
    },
    {
      id: '2',
      title: 'Vacation Budget',
      target: 15000,
      current: 8500,
      category: 'travel',
      deadline: '2024-06-30'
    }
  ],
  insights: [
    {
      type: 'success',
      title: 'Great Progress!',
      description: 'You saved 15% more this month compared to last month.',
      actionText: 'View Details'
    },
    {
      type: 'warning',
      title: 'High Dining Expenses',
      description: 'Your food expenses increased by 23% this month.',
      actionText: 'Set Budget'
    },
    {
      type: 'info',
      title: 'Monthly Goal',
      description: 'You are 64% towards your Emergency Fund goal.',
      actionText: 'Add Funds'
    }
  ]
};

export const TransactionAnalyticsScreen: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("tracker");
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAmounts, setShowAmounts] = useState(true);
  const [activeChart, setActiveChart] = useState('overview');

  const data = mockAnalyticsData;

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const chartTypes = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'categories', label: 'Categories', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Award className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (!showAmounts) return '****';
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto bg-white dark:bg-zinc-800 relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="transaction-analytics" className="screen pt-20 pb-24 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Page Header */}
            <motion.section 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {t('analytics.title')}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {t('analytics.subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setShowAmounts(!showAmounts)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200"
                  aria-label={showAmounts ? t('common.hideAmounts') : t('common.showAmounts')}
                >
                  {showAmounts ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200"
                  aria-label={t('common.share')}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.section>

            {/* Period Selector */}
            <motion.section 
              variants={itemVariants}
              className="flex space-x-2 overflow-x-auto pb-2"
            >
              {periods.map((period) => (
                <motion.button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedPeriod === period.id
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                  }`}
                >
                  {t(period.label)}
                </motion.button>
              ))}
            </motion.section>

            {/* Overview Cards */}
            <motion.section 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        data.monthlyGrowth > 0 
                          ? 'bg-green-200 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth}%
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">
                      {t('analytics.totalIncome')}
                    </p>
                    <p className="text-lg font-bold text-green-800 dark:text-green-200">
                      {formatCurrency(data.totalIncome)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <span className="text-xs text-red-700 dark:text-red-300">
                        {((data.totalExpenses / data.totalIncome) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-1">
                      {t('analytics.totalExpenses')}
                    </p>
                    <p className="text-lg font-bold text-red-800 dark:text-red-200">
                      {formatCurrency(data.totalExpenses)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="col-span-2">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            {t('analytics.netIncome')}
                          </p>
                          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
                            {formatCurrency(data.netIncome)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {t('analytics.savingsRate')}
                        </p>
                        <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                          {((data.netIncome / data.totalIncome) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>

            {/* Chart Type Selector */}
            <motion.section 
              variants={itemVariants}
              className="flex space-x-2 overflow-x-auto pb-2"
            >
              {chartTypes.map((chart) => {
                const IconComponent = chart.icon;
                return (
                  <motion.button
                    key={chart.id}
                    onClick={() => setActiveChart(chart.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                      activeChart === chart.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{t(chart.label)}</span>
                  </motion.button>
                );
              })}
            </motion.section>

            {/* Top Categories */}
            {activeChart === 'categories' && (
              <motion.section 
                variants={itemVariants}
                className="space-y-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2 mb-4">
                      <PieChart className="w-5 h-5 text-green-500" />
                      <span>{t('analytics.topCategories')}</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {data.topCategories.map((category, index) => (
                        <motion.div
                          key={category.category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-2xl">{category.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-zinc-900 dark:text-white text-sm">
                                  {category.category}
                                </span>
                                <div className="text-right">
                                  <span className="font-bold text-zinc-900 dark:text-white text-sm">
                                    {formatCurrency(category.amount)}
                                  </span>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                                    {category.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${category.percentage}%` }}
                                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                  className={`${category.color} h-2 rounded-full`}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Monthly Trends */}
            {activeChart === 'trends' && (
              <motion.section 
                variants={itemVariants}
                className="space-y-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <span>{t('analytics.monthlyTrends')}</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {data.monthlyTrends.map((month, index) => (
                        <motion.div
                          key={month.month}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {month.month}
                            </span>
                            <div className="text-right">
                              <div className="text-sm">
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {formatCurrency(month.income)}
                                </span>
                                <span className="text-zinc-400 mx-2">|</span>
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  {formatCurrency(month.expenses)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            {/* Income Bar */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-600 dark:text-green-400 w-12">
                                Income
                              </span>
                              <div className="flex-1 bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(month.income / 10000) * 100}%` }}
                                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                  className="bg-green-500 h-2 rounded-full"
                                />
                              </div>
                            </div>
                            
                            {/* Expenses Bar */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-red-600 dark:text-red-400 w-12">
                                Expenses
                              </span>
                              <div className="flex-1 bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(month.expenses / 10000) * 100}%` }}
                                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                  className="bg-red-500 h-2 rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Goals */}
            {activeChart === 'goals' && (
              <motion.section 
                variants={itemVariants}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {t('analytics.financialGoals')}
                  </h3>
                  <Button
                    onClick={() => navigateTo('add-goal')}
                    className="text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('analytics.addGoal')}
                  </Button>
                </div>

                {data.goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              {goal.title}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {((goal.current / goal.target) * 100).toFixed(0)}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                              transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                              className="bg-blue-500 h-2 rounded-full"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                            <span className="capitalize">{goal.category}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.section>
            )}

            {/* Insights */}
            <motion.section 
              variants={itemVariants}
              className="space-y-4"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {t('analytics.insights')}
              </h3>
              
              {data.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className={`border-l-4 ${
                    insight.type === 'success' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' :
                    insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  } cursor-pointer hover:shadow-lg transition-all duration-200`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {insight.description}
                          </p>
                          {insight.actionText && (
                            <Button
                              className="text-xs bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-400 p-0 h-auto font-medium"
                            >
                              {insight.actionText} →
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.section>

            {/* Export Options */}
            <motion.section 
              variants={itemVariants}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => {/* Export PDF report */}}
                  className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Download className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('analytics.exportReport')}</span>
                  </div>
                </Button>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => navigateTo('budget-planner')}
                  className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Target className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('analytics.budgetPlanner')}</span>
                  </div>
                </Button>
              </motion.div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      {/* Footer - Bottom Navigation */}
      <footer className="bottom-nav">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </footer>
    </div>
  );
}; 