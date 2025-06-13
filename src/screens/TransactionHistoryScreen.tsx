import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const mock = [
  { id: 1, desc: "Dinner - Marina Walk", amount: -125.75, cur: "AED" },
  { id: 2, desc: "Salary", amount: 8500, cur: "AED" },
  { id: 3, desc: "Electricity Bill", amount: -450, cur: "AED" },
];

export const TransactionHistoryScreen: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="px-4 py-6 space-y-4"
  >
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <Clock className="w-5 h-5" /> History
    </h2>

    <ul className="space-y-2">
      {mock.map((t) => (
        <li
          key={t.id}
          className="flex justify-between items-center bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 shadow"
        >
          <span>{t.desc}</span>
          <span
            className={`font-medium tabular-nums ${
              t.amount < 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            {t.amount < 0 ? "-" : "+"}
            {Math.abs(t.amount).toFixed(2)} {t.cur}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
); 