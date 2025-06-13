import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { QuickActions } from "../components/QuickActions";
import { CurrencyOverlay } from "../components/CurrencyOverlay";
// import { BalanceOverlay } from "../components/BalanceOverlay";
import { PromotionsSection } from "../components/PromotionsSection";
import { RecentActivity } from "../components/RecentActivity";
import { BottomNavigation } from "../components/BottomNavigation";

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  // const [showBalance, setShowBalance] = useState(false);
  const [activeTab, setActiveTab] = useState("exchange");

  return (
    <div id="root" className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto relative">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main>
        <div id="home" className="screen pt-20 pb-24 px-4">
          {/* Welcome Section */}
          <motion.section 
            className="welcome text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-title">
              <motion.h2
                className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {user?.name?.split(" ")[0]}!
              </motion.h2>
              <motion.p
                className="text-zinc-600 dark:text-zinc-400 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ready to send money worldwide?
              </motion.p>
            </div>
          </motion.section>

          {/* Quick Actions Section */}
          <motion.section 
            className="quick-actions relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="section-content">
              <QuickActions />
              <CurrencyOverlay />
              {/* <BalanceOverlay 
                showBalance={showBalance} 
                onToggle={() => setShowBalance(!showBalance)} 
              /> */}
            </div>
          </motion.section>

          {/* Promotions Section */}
          <motion.section 
            className="promotions mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="section-content">
              <PromotionsSection />
            </div>
          </motion.section>

          {/* Recent Activity Section */}
          <motion.section 
            className="recent-activity mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="section-content">
              <RecentActivity />
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer - Bottom Navigation */}
      <footer className="bottom-nav">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </footer>
    </div>
  );
};