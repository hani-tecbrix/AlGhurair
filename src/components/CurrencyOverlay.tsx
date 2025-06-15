import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";

export const CurrencyOverlay: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <>
      {/* Center-positioned converter trigger */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="relative w-28 h-28 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center pointer-events-auto"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateTo('currency-converter')}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg text-white flex items-center justify-center"
            aria-label="Open Currency Converter"
          >
            <ArrowLeftRight className="w-8 h-8" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}; 