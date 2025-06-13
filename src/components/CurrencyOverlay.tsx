import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { ArrowLeftRight } from "lucide-react";

interface CurrencyData {
  code: string;
  country: string;
  flag: string;
  rate: number; // 1 AED -> rate
}

// Static demo rates – in real life fetch from an API
const currencies: CurrencyData[] = [
  { code: "USD", country: "United States", flag: "🇺🇸", rate: 0.27 },
  { code: "EUR", country: "Eurozone", flag: "🇪🇺", rate: 0.25 },
  { code: "INR", country: "India", flag: "🇮🇳", rate: 22.47 },
  { code: "PHP", country: "Philippines", flag: "🇵🇭", rate: 15.27 },
  { code: "GBP", country: "United Kingdom", flag: "🇬🇧", rate: 0.21 },
  { code: "PKR", country: "Pakistan", flag: "🇵🇰", rate: 74.35 },
];

export const CurrencyOverlay: React.FC = () => {
  // Amount entered by user (currency depends on `isReversed`)
  const [amount, setAmount] = useState<string>("100");
  // Currency other than AED involved in conversion
  const [selectedCode, setSelectedCode] = useState<string>("USD");
  // When false → AED ➜ selected currency; when true → selected currency ➜ AED
  const [isReversed, setIsReversed] = useState<boolean>(false);

  // Helper references
  const selectedCurrency = currencies.find((c) => c.code === selectedCode)!;
  const AED_FLAG = "🇦🇪";

  // Compute converted amount (formatted)
  const converted = useMemo(() => {
    const parsed = parseFloat(amount) || 0;
    const value = isReversed
      ? parsed / selectedCurrency.rate // selected ➜ AED
      : parsed * selectedCurrency.rate; // AED ➜ selected
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [amount, selectedCurrency, isReversed]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: "19%", top: "19%", width: "264px", height: "264px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className="relative rounded-full border-2 border-zinc-200/60 dark:border-zinc-600/40 bg-white dark:bg-zinc-800 backdrop-blur-sm flex items-center justify-center shadow-xl pointer-events-auto"
        style={{ width: "264px", height: "264px" }}
      >
        {/* Inner content circle */}
        <div
          className="relative rounded-full border border-zinc-200/40 dark:border-zinc-600/40 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center space-y-4 shadow-lg p-4"
          style={{ width: "240px", height: "240px" }}
        >
          {/* Amount input */}
          <div className="w-full space-y-1 text-center">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {isReversed ? `${selectedCurrency.code} Amount` : "AED Amount"}
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              className="text-center font-semibold text-lg bg-white dark:bg-zinc-900 rounded-full"
            />
          </div>

          {/* Swap button */}
          <button
            onClick={() => setIsReversed((prev) => !prev)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeftRight
              className={`w-5 h-5 transition-transform duration-300 ${
                isReversed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Country selector */}
          <div className="w-full space-y-1 text-center">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Convert To
            </label>
            <Select value={selectedCode} onValueChange={setSelectedCode}>
              <SelectTrigger className="w-full h-10 justify-center bg-white dark:bg-zinc-900 rounded-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </div>
                      <span className="text-xs ml-12 text-right font-medium opacity-70">
                        {(
                          isReversed
                            ? (parseFloat(amount || "0") / c.rate)
                            : (parseFloat(amount || "0") * c.rate)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCode + amount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-1"
            >
              <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                {isReversed ? AED_FLAG : selectedCurrency.flag} {converted} {isReversed ? "AED" : selectedCurrency.code}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium flex items-center justify-center space-x-1">
                <ArrowLeftRight className="w-3 h-3" />
                <span>
                  {amount} {isReversed ? selectedCurrency.code : "AED"} → {isReversed ? "AED" : selectedCurrency.code}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}; 