import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const flag = (code: string) =>
  ({ AED: "🇦🇪", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳" } as any)[code] ?? "🏳️";

export const ExchangeRatesScreen: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    const res = await fetch("https://api.exchangerate.host/latest?base=AED");
    const data = await res.json();
    setRates(data.rates ?? {});
    setLoading(false);
  };
  useEffect(() => void fetchRates(), []);

  const shown = Object.entries(rates)
    .filter(([c]) => c.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-6 space-y-4"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Live Exchange Rates
          </CardTitle>
          <button onClick={fetchRates} aria-label="refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search currency…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-1">Currency</th>
                  <th className="text-right py-1">1 AED =</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(([code, rate]) => (
                  <tr key={code} className="border-t last:border-b">
                    <td className="py-1">
                      <span className="mr-1">{flag(code)}</span>
                      {code}
                    </td>
                    <td className="py-1 text-right font-medium tabular-nums">
                      {rate.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 