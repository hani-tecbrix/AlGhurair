import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import splashLogo from "../assets/AGEX_Splash.png";

export const SplashScreen: React.FC = () => {
  const bgControls = useAnimation();

  // Subtle pulsing gradient animation
  useEffect(() => {
    bgControls.start({
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      transition: { duration: 6, repeat: Infinity, ease: "linear" },
    });
  }, [bgControls]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background gradient */}
      <motion.div
        animate={bgControls}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-green-600 via-lime-500 to-emerald-500"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute block w-1.5 h-1.5 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            y: ["0%", "-120%"],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Logo + text */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute w-36 h-36 border-4 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Logo box with image */}
        <motion.div
          className="w-32 h-32 rounded-3xl shadow-2xl flex items-center justify-center mb-8 overflow-hidden bg-white"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <img src={splashLogo} alt="AGEX" className="object-contain w-24 h-24" />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          className="text-white text-2xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Al Ghurair Exchange
        </motion.h1>
        <motion.p
          className="text-white/80 text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          Your trusted money exchange partner
        </motion.p>

        {/* Dots loader */}
        <motion.div
          className="mt-12 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};