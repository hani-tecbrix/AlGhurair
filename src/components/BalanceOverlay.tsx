import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface BalanceOverlayProps {
  showBalance: boolean;
  onToggle: () => void;
}

export const BalanceOverlay: React.FC<BalanceOverlayProps> = ({
  showBalance,
  onToggle,
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: '19%', 
        top: '19%', 
        width: '264px', 
        height: '264px'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Outer circle with defined dimensions */}
              <div 
          className="relative rounded-full border-2 border-zinc-200/60 dark:border-zinc-600/40 bg-white dark:bg-zinc-800 backdrop-blur-sm flex items-center justify-center shadow-xl pointer-events-auto"
          style={{ width: '264px', height: '264px' }}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-100/20 via-transparent to-zinc-200/20 dark:from-zinc-700/20 dark:via-transparent dark:to-zinc-600/20" />
          
          {/* Inner circle with content */}
          <div 
            className="relative rounded-full border border-zinc-200/40 dark:border-zinc-600/40 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center space-y-2 shadow-lg"
            style={{ width: '240px', height: '240px' }}
          >
          <AnimatePresence mode="wait">
            {showBalance ? (
              <motion.div
                key="balance"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-3 w-full px-3"
              >
                {/* Main Balance */}
                <div className="space-y-1">
                  <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                    AED 12,450
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Available Balance
                  </div>
                </div>

                {/* In/Out Amounts */}
                <div className="flex justify-between items-center w-full space-x-2">
                  {/* Last In */}
                  <motion.div 
                    className="flex flex-col items-center space-y-1 bg-green-50/80 dark:bg-green-900/20 rounded-lg p-1.5 border border-green-200/50 dark:border-green-800/30 flex-1"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex items-center space-x-1">
                      <ArrowDownLeft className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">In</span>
                    </div>
                    <div className="text-xs font-semibold text-green-800 dark:text-green-200">
                      +2,500
                    </div>
                  </motion.div>

                  {/* Last Out */}
                  <motion.div 
                    className="flex flex-col items-center space-y-1 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg p-1.5 border border-orange-200/50 dark:border-orange-800/30 flex-1"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs text-orange-700 dark:text-orange-300 font-medium">Out</span>
                    </div>
                    <div className="text-xs font-semibold text-orange-800 dark:text-orange-200">
                      -850
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-3"
              >
                <div className="space-y-1">
                  <div className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
                    ••••••
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Balance Hidden
                  </div>
                </div>
                
                {/* Hidden in/out amounts */}
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex flex-col items-center space-y-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-1.5 border border-zinc-200/50 dark:border-zinc-700/30 flex-1">
                    <div className="flex items-center space-x-1">
                      <ArrowDownLeft className="w-2.5 h-2.5 text-zinc-400" />
                      <span className="text-xs text-zinc-500 font-medium">In</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-400">••••</div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-1.5 border border-zinc-200/50 dark:border-zinc-700/30 flex-1">
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
                      <span className="text-xs text-zinc-500 font-medium">Out</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-400">••••</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 backdrop-blur-sm border-green-200/60 dark:border-green-700/40 text-green-700 dark:text-green-300 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/50 dark:hover:to-green-700/50 transition-all duration-200 shadow-sm text-xs px-3 py-1"
            >
              {showBalance ? (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Show
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};