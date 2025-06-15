import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ExchangeRatesScreen } from "./ExchangeRatesScreen";
import { useNavigation } from "../contexts/NavigationContext";
import { Button } from "../components/ui/button";

interface CurrencyData {
  code: string;
  country: string;
  flag: string;
  rate: number;
}

const currencies: CurrencyData[] = [
  { code: "USD", country: "United States", flag: "🇺🇸", rate: 0.27 },
  { code: "EUR", country: "Eurozone", flag: "🇪🇺", rate: 0.25 },
  { code: "INR", country: "India", flag: "🇮🇳", rate: 22.47 },
  { code: "PHP", country: "Philippines", flag: "🇵🇭", rate: 15.27 },
  { code: "GBP", country: "United Kingdom", flag: "🇬🇧", rate: 0.21 },
  { code: "PKR", country: "Pakistan", flag: "🇵🇰", rate: 74.35 },
];

export const CurrencyConverterScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const [amount, setAmount] = useState<string>("100");
  const [selectedCode, setSelectedCode] = useState<string>("USD");
  const [isReversed, setIsReversed] = useState<boolean>(false);

  const selectedCurrency = currencies.find((c) => c.code === selectedCode)!;
  const AED_FLAG = "🇦🇪";

  const converted = useMemo(() => {
    const parsed = parseFloat(amount) || 0;
    const value = isReversed
      ? parsed / selectedCurrency.rate
      : parsed * selectedCurrency.rate;
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [amount, selectedCurrency, isReversed]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 min-h-screen pb-32">
        {/* Header */}
        <motion.div
          className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Currency Converter
            </h1>
          </div>
        </motion.div>

        {/* Converter Section */}
        <section className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-green-600" /> Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount */}
              <div className="w-full space-y-1">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {isReversed ? `${selectedCurrency.code} Amount` : "AED Amount"}
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={0}
                  className="text-center font-semibold text-lg bg-white dark:bg-zinc-900 rounded-md"
                />
              </div>

              {/* Swap button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsReversed((prev) => !prev)}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md"
                  aria-label="Swap"
                >
                  <ArrowLeftRight
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isReversed ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Currency selector */}
              <div className="w-full space-y-1">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Convert To
                </label>
                <Select value={selectedCode} onValueChange={setSelectedCode}>
                  <SelectTrigger className="w-full h-10 bg-white dark:bg-zinc-900 rounded-md justify-between">
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
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Result */}
              <div className="text-center space-y-1">
                <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                  {isReversed ? AED_FLAG : selectedCurrency.flag} {converted} {isReversed ? "AED" : selectedCurrency.code}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium flex items-center justify-center space-x-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>
                    {amount} {isReversed ? selectedCurrency.code : "AED"} → {isReversed ? "AED" : selectedCurrency.code}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exchange Rates Section */}
        <section className="border-t border-zinc-200 dark:border-zinc-700 mt-6 pt-4">
          <ExchangeRatesScreen />
        </section>
      </div>
    </div>
  );
}; 