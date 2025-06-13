import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigation } from "../../contexts/NavigationContext";
import { 
  ArrowLeft, 
  User, 
  Building2, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

interface BankDetails {
  bankName: string;
  branchCode: string;
  swiftCode: string;
  address: string;
}

interface BeneficiaryData {
  iban: string;
  accountNumber: string;
  fullName: string;
  bankDetails?: BankDetails;
}

export const NewBeneficiaryScreen: React.FC = () => {
  const { goBack, navigateTo } = useNavigation();
  const [step, setStep] = useState<'account' | 'details' | 'confirmation'>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryData>({
    iban: '',
    accountNumber: '',
    fullName: '',
  });

  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  const validateIBAN = (iban: string): boolean => {
    // Basic IBAN validation for UAE (AE)
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
    return cleanIBAN.length === 23 && cleanIBAN.startsWith('AE');
  };

  const formatIBAN = (value: string): string => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 27); // Max length with spaces
  };

  const handleAccountSubmit = async () => {
    setError(null);
    
    if (!beneficiaryData.iban && !beneficiaryData.accountNumber) {
      setError('Please enter either IBAN or Account Number');
      return;
    }

    if (beneficiaryData.iban && !validateIBAN(beneficiaryData.iban)) {
      setError('Please enter a valid UAE IBAN');
      return;
    }

    setLoading(true);
    
    // Simulate API call to fetch bank details
    setTimeout(() => {
      const mockBankDetails: BankDetails = {
        bankName: 'Emirates NBD Bank',
        branchCode: '001',
        swiftCode: 'EBILAEAD',
        address: 'Baniyas Road, Dubai, UAE'
      };
      
      setBankDetails(mockBankDetails);
      setStep('details');
      setLoading(false);
    }, 2000);
  };

  const handleDetailsSubmit = () => {
    if (!beneficiaryData.fullName.trim()) {
      setError('Please enter the beneficiary name');
      return;
    }
    
    setStep('confirmation');
  };

  const handleConfirmation = (action: 'save' | 'pay') => {
    const completeData = {
      ...beneficiaryData,
      bankDetails,
    };
    
    if (action === 'save') {
      // Save beneficiary and go back
      navigateTo('send-money-beneficiary');
    } else {
      // Save and proceed to payment
      navigateTo('send-money-amount', { 
        beneficiary: {
          id: `new_${Date.now()}`,
          name: beneficiaryData.fullName,
          bank: bankDetails?.bankName || 'Unknown Bank',
          accountNumber: beneficiaryData.accountNumber || beneficiaryData.iban?.slice(-4) || '',
          iban: beneficiaryData.iban,
          isStarred: false,
          lastUsed: new Date(),
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 min-h-screen">
        {/* Header */}
        <motion.div
          className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Add Beneficiary
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {step === 'account' && 'Enter account details'}
                  {step === 'details' && 'Verify information'}
                  {step === 'confirmation' && 'Confirm details'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    (step === 'account' && stepNumber === 1) ||
                    (step === 'details' && stepNumber === 2) ||
                    (step === 'confirmation' && stepNumber === 3)
                      ? 'bg-green-600 text-white'
                      : stepNumber < (step === 'details' ? 2 : step === 'confirmation' ? 3 : 1)
                      ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                      : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-400'
                  }`}>
                    {stepNumber < (step === 'details' ? 2 : step === 'confirmation' ? 3 : 1) ? 
                      <CheckCircle2 className="w-3 h-3" /> : 
                      stepNumber
                    }
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                      stepNumber < (step === 'details' ? 2 : step === 'confirmation' ? 3 : 1)
                        ? 'bg-green-200 dark:bg-green-800'
                        : 'bg-zinc-200 dark:bg-zinc-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Account Details Step */}
          {step === 'account' && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span>Account Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="iban">IBAN Number</Label>
                    <Input
                      id="iban"
                      placeholder="AE07 0331 2345 6789 0123 456"
                      value={beneficiaryData.iban}
                      onChange={(e) => setBeneficiaryData(prev => ({
                        ...prev,
                        iban: formatIBAN(e.target.value)
                      }))}
                      className="mt-1 font-mono"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      UAE IBAN format: AE + 21 digits
                    </p>
                  </div>

                  <div className="text-center text-zinc-500 dark:text-zinc-400">
                    <span className="text-sm">OR</span>
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number"
                      value={beneficiaryData.accountNumber}
                      onChange={(e) => setBeneficiaryData(prev => ({
                        ...prev,
                        accountNumber: e.target.value
                      }))}
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleAccountSubmit}
                    disabled={loading || (!beneficiaryData.iban && !beneficiaryData.accountNumber)}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying Account...
                      </>
                    ) : (
                      'Verify Account'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bank Details Step */}
          {step === 'details' && bankDetails && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span>Bank Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-zinc-600 dark:text-zinc-400">Bank Name</Label>
                      <p className="font-medium">{bankDetails.bankName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-zinc-600 dark:text-zinc-400">Branch Code</Label>
                      <p className="font-medium">{bankDetails.branchCode}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-zinc-600 dark:text-zinc-400">SWIFT Code</Label>
                      <p className="font-medium">{bankDetails.swiftCode}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-zinc-600 dark:text-zinc-400">Address</Label>
                      <p className="font-medium text-xs">{bankDetails.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span>Beneficiary Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter beneficiary's full name"
                      value={beneficiaryData.fullName}
                      onChange={(e) => setBeneficiaryData(prev => ({
                        ...prev,
                        fullName: e.target.value
                      }))}
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleDetailsSubmit}
                    disabled={!beneficiaryData.fullName.trim()}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Confirm Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                      <span className="font-medium">{beneficiaryData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Bank:</span>
                      <span className="font-medium">{bankDetails?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">IBAN:</span>
                      <span className="font-medium font-mono text-sm">{beneficiaryData.iban}</span>
                    </div>
                    {beneficiaryData.accountNumber && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Account:</span>
                        <span className="font-medium">{beneficiaryData.accountNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleConfirmation('save')}
                      className="w-full"
                    >
                      Save Only
                    </Button>
                    <Button
                      onClick={() => handleConfirmation('pay')}
                      className="w-full"
                    >
                      Save & Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}; 