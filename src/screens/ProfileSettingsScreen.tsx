import React, { useState } from "react";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Separator } from "../components/ui/separator";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileSettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { goBack } = useNavigation();
  const { updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("Ahmed Al Mansouri");
  const [phone, setPhone] = useState("+971501234567");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 max-w-md mx-auto relative">
      <Header />

      <main className="pt-24 pb-32 px-4 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Full Name</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Phone</label>
              <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
            </div>
            <Button
              className="mt-2 w-full"
              onClick={() => {
                // Basic validation
                if (!/^\+?\d{10,15}$/.test(phone) || name.trim().length < 3) {
                  setStatus("error");
                  return;
                }
                updateProfile({ name: name.trim(), phone });
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
              }}
            >
              Save Changes
            </Button>
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-2 text-sm mt-2 ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {status === "success"
                    ? "Profile updated successfully"
                    : "Please enter a valid name and phone number"}
                </span>
              </motion.div>
            )}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Preferences</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Theme</span>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Switch to {theme === "light" ? "Dark" : "Light"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="border rounded-md px-3 py-1 bg-white dark:bg-zinc-800"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          
          <Button
            variant="destructive"
            className="w-full opacity-90 hover:opacity-100"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </section>

        <div className="pt-8 text-center">
          <Button variant="ghost" onClick={goBack}>Go Back</Button>
        </div>
      </main>
    </div>
  );
}; 