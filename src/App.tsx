import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Splash } from "./screens/Splash";
import { LoginScreen } from "./screens/LoginScreen";
import { ScreenManager } from "./screens/ScreenManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { LanguageProvider } from "./contexts/LanguageContext";

export const App = (): JSX.Element => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationProvider>
          <div className="min-h-screen bg-background relative overflow-hidden">
            <AnimatePresence mode="wait">
              {showSplash ? (
                <Splash key="splash" />
              ) : (
                <motion.div
                  key="app"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/home" element={<ScreenManager />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NavigationProvider>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};