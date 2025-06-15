import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Star, Gift, ArrowRight } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";

export const PromotionsSection: React.FC = () => {
  const { navigateTo } = useNavigation();

  const openPromotions = () => {
    navigateTo('promotions');
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Promotions
        </h3>
        <Button variant="ghost" size="sm" className="text-lime-600" onClick={openPromotions}>
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Reward Points Card */}
      <Card className="bg-gradient-to-r from-lime-600 to-lime-500 border-0 text-white overflow-hidden relative cursor-pointer" onClick={openPromotions}>
        <CardContent className="p-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-300" />
                <h4 className="text-lg font-bold">Reward Points</h4>
              </div>
              <motion.div
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Gift className="w-6 h-6" />
              </motion.div>
            </div>

            <p className="text-white/90 text-sm mb-4">
              Earn more with every transaction
            </p>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">2,450</div>
                <div className="text-white/80 text-sm">Available Points</div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Redeem
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};