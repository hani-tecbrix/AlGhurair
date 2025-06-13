import React from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { useNavigation } from "../contexts/NavigationContext";
import { Button } from "../components/ui/button";
import { Sparkles } from "lucide-react";

export const ComingSoonScreen: React.FC = () => {
  const { goBack } = useNavigation();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative max-w-md mx-auto">
      {/* Re-use global header for back button */}
      <Header />

      <main className="pt-24 pb-24 flex flex-col items-center justify-center text-center px-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center shadow-lg mb-8"
        >
          <Sparkles className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
        >
          Coming Soon
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-600 dark:text-zinc-400 mb-8"
        >
          We're working hard on this feature. Stay tuned!
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button onClick={goBack} className="px-6 py-3">
            Go Back
          </Button>
        </motion.div>
      </main>
    </div>
  );
}; 