import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import agexLogo from "../assets/AGEX.svg";
import layerEn from "../assets/Layer_En.svg";
import layerAr from "../assets/Layer_Ar.svg";

export const Splash: React.FC = () => {
  const sparkControls = useAnimation();
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  // Generate random sparkles
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 4 + 2,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Continuous spark animation
  useEffect(() => {
    sparkControls.start({
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [sparkControls]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#003C30" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-20, -40, -60],
            }}
            transition={{
              duration: 3,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute border border-white/20 rounded-full"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${20 + i * 10}%`,
            top: `${15 + i * 8}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-emerald-400/30 to-green-400/30 blur-xl"
          style={{
            width: `${40 + i * 15}px`,
            height: `${40 + i * 15}px`,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 w-[210px] max-w-[210px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "backOut", delay: 0.3 }}
      >
        {/* Layer En (Before logo) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src={layerEn} alt="Layer En" className="h-12" />
        </motion.div>

        {/* AGEX Logo (Center) */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            rotateY: [0, 10, -10, 0],
          }}
          transition={{ duration: 4, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translate(-14%, -14%)" }}
          />

          <img src={agexLogo} alt="AGEX" className="h-20 relative z-10" />
        </motion.div>

        {/* Layer Ar (After logo) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{
            opacity: 1,
            y: [0, 6, 0],
          }}
          transition={{
            duration: 3,
            delay: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src={layerAr} alt="Layer Ar" className="h-12" />
        </motion.div>
      </motion.div>

      {/* Gradient Loading Bar */}
      <motion.div
        className="absolute bottom-16 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          className="h-full w-full bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ width: "2px" }}
        animate={{ x: ["-100vw", "100vw"] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
    </motion.div>
  );
}; 