import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Camera, 
  Upload, 
  Clock, 
  Receipt, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Image as ImageIcon,
  Scan,
  ArrowRight,
  CreditCard,
  Building,
  User
} from "lucide-react";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface QRPayment {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  amount?: number;
  currency?: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  reference: string;
}

const recentQRPayments: QRPayment[] = [
  {
    id: "qr_001",
    merchantName: "Starbucks Coffee",
    amount: 25.50,
    currency: "AED",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "success",
    reference: "QR123456"
  },
  {
    id: "qr_002",
    merchantName: "Carrefour Mall",
    amount: 127.85,
    currency: "AED",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "success",
    reference: "QR789012"
  },
  {
    id: "qr_003",
    merchantName: "Emirates NBD ATM",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "pending",
    reference: "QR345678"
  }
];

export const PayWithQRScreen: React.FC = () => {
  const [scannerActive, setScannerActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'recent'>('scan');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate camera access and QR scanning
  const startScanning = async () => {
    try {
      setScannerActive(true);
      // In a real app, you would request camera permission and access
      // For demo purposes, we'll simulate the scanning process
      console.log('Starting QR scanner...');
    } catch (error) {
      console.error('Camera access denied:', error);
      setScannerActive(false);
    }
  };

  const stopScanning = () => {
    setScannerActive(false);
    setFlashlightOn(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would decode the QR code from the image
      console.log('Processing uploaded QR image:', file.name);
      setIsProcessing(true);
      setTimeout(() => {
        setScanResult("demo_qr_code_data");
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      setIsProcessing(true);
      setTimeout(() => {
        setScanResult(manualCode);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const processQRPayment = (qrData: string) => {
    console.log('Processing QR payment:', qrData);
    // TODO: Navigate to payment confirmation screen
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getStatusColor = (status: QRPayment['status']) => {
    switch (status) {
      case 'success':
        return "text-green-600 dark:text-green-400";
      case 'pending':
        return "text-orange-500 dark:text-orange-400";
      case 'failed':
        return "text-red-600 dark:text-red-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  };

  const getStatusIcon = (status: QRPayment['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      stopScanning();
    };
  }, []);

  return (
    <div className="max-w-md mx-auto flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900" style={{ paddingTop: '64px' }}>
      <Header />

      <div className="flex-1 overflow-hidden">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2">
          <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg p-1">
            {[
              { id: 'scan', label: 'Scan QR', icon: Scan },
              { id: 'manual', label: 'Manual', icon: QrCode },
              { id: 'recent', label: 'Recent', icon: Clock }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-xs ${
                  activeTab === tab.id 
                    ? "bg-white dark:bg-zinc-600 shadow-sm" 
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-600"
                }`}
              >
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 space-y-6"
              >
                {/* QR Scanner Section */}
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-lime-600" />
                      QR Code Scanner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!scannerActive ? (
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-zinc-100 dark:bg-zinc-700 rounded-xl flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
                            Scan QR Code to Pay
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                            Point your camera at the merchant's QR code
                          </p>
                          <Button
                            onClick={startScanning}
                            className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Start Scanning
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="aspect-square bg-black rounded-xl overflow-hidden relative">
                          {/* Camera preview would go here */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-48 h-48 border-2 border-lime-500 rounded-xl"
                            >
                              <div className="absolute inset-0 border-2 border-lime-500/30 rounded-xl animate-pulse" />
                            </motion.div>
                          </div>
                          
                          {/* Scanner controls */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => setFlashlightOn(!flashlightOn)}
                              className={`bg-black/50 hover:bg-black/70 border-0 ${
                                flashlightOn ? 'text-yellow-400' : 'text-white'
                              }`}
                            >
                              {flashlightOn ? (
                                <Flashlight className="w-4 h-4" />
                              ) : (
                                <FlashlightOff className="w-4 h-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="secondary"
                              onClick={stopScanning}
                              className="bg-red-500 hover:bg-red-600 text-white border-0"
                            >
                              Stop Scanning
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-2">
                          Position the QR code within the frame to scan
                        </p>
                      </div>
                    )}

                    {/* Upload QR Code Option */}
                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <label
                            htmlFor="qr-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2 text-zinc-500" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              Upload QR Image
                            </span>
                          </label>
                          <input
                            id="qr-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing State */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-4 w-4 text-lime-600 dark:text-lime-400" />
                          <span className="text-lime-800 dark:text-lime-200">
                            Processing QR code...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan Result */}
                <AnimatePresence>
                  {scanResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-6 h-6 text-lime-600 dark:text-lime-400 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-medium text-lime-800 dark:text-lime-200">
                                QR Code Detected
                              </h3>
                              <p className="text-sm text-lime-700 dark:text-lime-300 mt-1">
                                Ready to proceed with payment
                              </p>
                            </div>
                            <Button
                              onClick={() => processQRPayment(scanResult)}
                              className="bg-lime-600 hover:bg-lime-700 text-white"
                            >
                              Proceed
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'manual' && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <QrCode className="w-5 h-5 mr-2 text-lime-600" />
                      Enter QR Code Manually
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        QR Code Data
                      </label>
                      <Input
                        placeholder="Enter QR code data or payment URL"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        You can paste the QR code URL or data here
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleManualSubmit}
                      disabled={!manualCode.trim() || isProcessing}
                      className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Process Payment
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-lime-600" />
                      Recent QR Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentQRPayments.length === 0 ? (
                      <div className="p-8 text-center">
                        <Receipt className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                        <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                          No Recent Payments
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Your QR payment history will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {recentQRPayments.map((payment, index) => {
                          const StatusIcon = getStatusIcon(payment.status);
                          
                          return (
                            <motion.div
                              key={payment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Building className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-zinc-900 dark:text-white truncate">
                                    {payment.merchantName}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <StatusIcon className={`w-3 h-3 ${getStatusColor(payment.status)}`} />
                                    <span className={`text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                      {payment.status}
                                    </span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                      • {formatTimeAgo(payment.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-right flex-shrink-0">
                                  {payment.amount && (
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                      {payment.amount.toFixed(2)} {payment.currency}
                                    </p>
                                  )}
                                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {payment.reference}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}; 