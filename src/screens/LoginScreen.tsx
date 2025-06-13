import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Phone, Fingerprint, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import appLogo from "../assets/AGEX_App.png";

export const LoginScreen: React.FC = () => {
  const UAEPrefix = "+971";
  const [phoneLocal, setPhoneLocal] = useState(""); // 9-digit local number
  const phone = UAEPrefix + phoneLocal;
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [info, setInfo] = useState<string>("");
  const [counter, setCounter] = useState<number>(60);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { login, loginWithUAEPass } = useAuth();
  const navigate = useNavigate();

  // Start countdown when step switches to otp
  React.useEffect(() => {
    if (step === "otp") {
      setCounter(60);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            timerRef.current && clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [step]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    setInfo("");
    
    try {
      // Simple validation
      if (phoneLocal.length !== 9) {
        setError("Enter valid 9-digit UAE mobile number");
        return;
      }

      const success = await login(phone, otp);
      if (success) {
        navigate("/home");
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (phoneLocal.length !== 9) {
      setError("Please enter 9-digit UAE number");
      return;
    }
    setIsLoading(true);
    setError("");
    setInfo("");
    // Simulate API send
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      setInfo("OTP sent to " + phone);
      // Demo: set otp as 123456
      setOtp("123456");
    }, 1200);
  };

  const handleUAEPassLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithUAEPass();
      navigate("/home");
    } catch (err) {
      setError("UAE Pass login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (counter !== 0) return;
    handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden bg-white"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={appLogo} alt="AGEX" className="object-contain w-full h-full" />
          </motion.div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to your Al Ghurair Exchange account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 space-y-6">
              {step === "phone" && (
                <motion.div
                  className="space-y-2"
                  key="phone-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 font-medium">
                      {UAEPrefix}
                    </div>
                    <Input
                      type="tel"
                      value={phoneLocal}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length <= 9) setPhoneLocal(val);
                      }}
                      className="pl-24 h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 rounded-full tracking-wider"
                      placeholder="501234567"
                      maxLength={9}
                    />
                  </div>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  className="space-y-2"
                  key="otp-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <Input
                      type={showOtp ? "text" : "password"}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pr-10 h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 rounded-full tracking-widest text-center font-mono"
                      placeholder="••••••"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Resend OTP */}
                  <div className="text-right text-xs mt-1">
                    {counter > 0 ? (
                      <span className="text-zinc-500">Resend in {counter}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-green-600 hover:underline font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="text-red-500 text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
              {info && (
                <motion.div
                  className="text-green-600 text-sm text-center flex items-center justify-center space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{info}</span>
                </motion.div>
              )}

              {/* Login / Send OTP Button */}
              {step === "phone" ? (
                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>
              )}

              {/* Separator */}
              <div className="relative">
                <Separator className="bg-zinc-200 dark:bg-zinc-600" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 px-3 text-sm text-zinc-500">
                  or
                </span>
              </div>

              {/* UAE Pass Login */}
              <Button
                onClick={handleUAEPassLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-2 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-full"
              >
                <Fingerprint className="w-5 h-5 mr-2 text-blue-600" />
                Continue with UAE Pass
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};