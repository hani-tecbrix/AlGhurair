import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.exchange': { en: 'Exchange', ar: 'الصرافة' },
  'nav.payments': { en: 'Payments', ar: 'المدفوعات' },
  'nav.accounts': { en: 'Accounts', ar: 'الحسابات' },
  
  // Header
  'header.alGhurairExchange': { en: 'Al Ghurair Exchange', ar: 'صرافة الغرير' },
  
  // Quick Actions
  'quickActions.sendMoney': { en: 'Send Money', ar: 'إرسال أموال' },
  'quickActions.manageCards': { en: 'Manage Cards', ar: 'إدارة البطاقات' },
  'quickActions.billPayment': { en: 'Bill Payment', ar: 'دفع الفواتير' },
  'quickActions.transactionTracker': { en: 'Transaction Tracker', ar: 'تتبع المعاملات' },
  
  // Send Money
  'sendMoney.selectRecipient': { en: 'Select Recipient', ar: 'اختر المستقبل' },
  'sendMoney.selectRecipientDesc': { en: 'Choose who you want to send money to', ar: 'اختر من تريد إرسال الأموال إليه' },
  'sendMoney.searchPlaceholder': { en: 'Search recipients, banks, or accounts...', ar: 'البحث عن المستقبلين أو البنوك أو الحسابات...' },
  'sendMoney.quickSend': { en: 'Quick Send', ar: 'إرسال سريع' },
  'sendMoney.smartDetection': { en: 'Smart Detection', ar: 'الكشف الذكي' },
  'sendMoney.smartDetectionDesc': { en: 'We\'ll auto-detect IBAN or account numbers', ar: 'سنكتشف تلقائياً رقم الآيبان أو الحساب' },
  'sendMoney.ibanOrAccountPlaceholder': { en: 'Enter IBAN or Account Number', ar: 'أدخل رقم الآيبان أو الحساب' },
  'sendMoney.enterAccountOrIban': { en: 'IBAN: AE07 0331 2345 6789 0123 456\nAccount: 1234567890', ar: 'آيبان: AE07 0331 2345 6789 0123 456\nحساب: 1234567890' },
  'sendMoney.selectBank': { en: 'Select Bank', ar: 'اختر البنك' },
  'sendMoney.chooseBankPlaceholder': { en: 'Choose a bank...', ar: 'اختر بنك...' },
  'sendMoney.accountVerified': { en: 'Account Verified', ar: 'تم التحقق من الحساب' },
  'sendMoney.continueWithRecipient': { en: 'Continue with Recipient', ar: 'متابعة مع المستقبل' },
  'sendMoney.addNewBeneficiary': { en: 'Add New Recipient', ar: 'إضافة مستقبل جديد' },
  'sendMoney.addNewBeneficiaryDesc': { en: 'Send money to someone new', ar: 'إرسال أموال لشخص جديد' },
  'sendMoney.savedRecipients': { en: 'Saved Recipients', ar: 'المستقبلون المحفوظون' },
  'sendMoney.noRecipientsFound': { en: 'No Recipients Found', ar: 'لم يتم العثور على مستقبلين' },
  'sendMoney.noRecipientsFoundDesc': { en: 'Try adjusting your search or add a new recipient', ar: 'جرب تعديل البحث أو أضف مستقبل جديد' },
  'sendMoney.transfers': { en: 'transfers', ar: 'تحويل' },
  'sendMoney.ibanDetected': { en: 'IBAN Detected', ar: 'تم اكتشاف الآيبان' },
  'sendMoney.accountNumberDetected': { en: 'Account Number Detected', ar: 'تم اكتشاف رقم الحساب' },
  'sendMoney.enterValidFormat': { en: 'Enter valid IBAN or account number', ar: 'أدخل آيبان أو رقم حساب صحيح' },
  'sendMoney.smartValidation': { en: 'Smart Validation', ar: 'التحقق الذكي' },
  'sendMoney.smartValidationDesc': { en: 'Real-time account verification and validation', ar: 'التحقق والتصديق الفوري للحساب' },
  'sendMoney.addNewRecipient': { en: 'Add New Recipient', ar: 'إضافة مستقبل جديد' },
  'sendMoney.enterAccountDetails': { en: 'Enter Account Details', ar: 'أدخل تفاصيل الحساب' },
  'sendMoney.selectRecipientBank': { en: 'Select Recipient Bank', ar: 'اختر بنك المستقبل' },
  'sendMoney.selectBankForAccount': { en: 'Select bank for account', ar: 'اختر البنك للحساب' },
  'sendMoney.beneficiaryDetails': { en: 'Beneficiary Details', ar: 'تفاصيل المستفيد' },
  'sendMoney.reviewDetails': { en: 'Review Details', ar: 'مراجعة التفاصيل' },
  'sendMoney.personalDetails': { en: 'Personal Details', ar: 'التفاصيل الشخصية' },
  'sendMoney.detectedAccountHolder': { en: 'Detected Account Holder', ar: 'صاحب الحساب المكتشف' },
  'sendMoney.enterFullName': { en: 'Enter full name...', ar: 'أدخل الاسم الكامل...' },
  'sendMoney.enterNickname': { en: 'Enter nickname...', ar: 'أدخل الاسم المستعار...' },
  'sendMoney.enterEmail': { en: 'Enter email address...', ar: 'أدخل عنوان البريد الإلكتروني...' },
  'sendMoney.enterPhone': { en: 'Enter phone number...', ar: 'أدخل رقم الهاتف...' },
  'sendMoney.reviewRecipient': { en: 'Review Recipient', ar: 'مراجعة المستقبل' },
  'sendMoney.accountInformation': { en: 'Account Information', ar: 'معلومات الحساب' },
  'sendMoney.additionalDetails': { en: 'Additional Details', ar: 'تفاصيل إضافية' },
  'sendMoney.saveAndPay': { en: 'Save & Pay', ar: 'حفظ ودفع' },
  
  // Bill Payment
  'billPayment.title': { en: 'Bill Payment', ar: 'دفع الفواتير' },
  'billPayment.subtitle': { en: 'Pay your bills quickly and securely', ar: 'ادفع فواتيرك بسرعة وأمان' },
  'billPayment.selectBiller': { en: 'Select a Biller', ar: 'اختر مزود الخدمة' },
  'billPayment.enterDetails': { en: 'Enter Bill Details', ar: 'أدخل تفاصيل الفاتورة' },
  'billPayment.confirm': { en: 'Confirm Payment', ar: 'تأكيد الدفع' },
  'billPayment.success': { en: 'Payment Successful', ar: 'تم الدفع بنجاح' },
  
  // Transaction Tracker
  'transactionTracker.title': { en: 'Transaction Tracker', ar: 'تتبع المعاملات' },
  'transactionTracker.subtitle': { en: 'Track and manage all your transactions', ar: 'تتبع وإدارة جميع معاملاتك' },
  'transactionTracker.addTransaction': { en: 'Add Transaction', ar: 'إضافة معاملة' },
  'transactionTracker.recentTransactions': { en: 'Recent Transactions', ar: 'المعاملات الأخيرة' },
  'transactionTracker.noTransactions': { en: 'No Transactions Found', ar: 'لا توجد معاملات' },
  'transactionTracker.noTransactionsDesc': { en: 'Start tracking by adding your first transaction', ar: 'ابدأ التتبع بإضافة معاملتك الأولى' },
  'transactionTracker.analytics': { en: 'Analytics', ar: 'التحليلات' },
  'transactionTracker.details': { en: 'Transaction Details', ar: 'تفاصيل المعاملة' },
  'transactionTracker.notFound': { en: 'Transaction not found', ar: 'المعاملة غير موجودة' },
  
  // Add Transaction
  'addTransaction.basicInfo': { en: 'Basic Information', ar: 'المعلومات الأساسية' },
  'addTransaction.basicInfoDesc': { en: 'Tell us about your transaction', ar: 'أخبرنا عن معاملتك' },
  'addTransaction.dateTime': { en: 'Date & Time', ar: 'التاريخ والوقت' },
  'addTransaction.dateTimeDesc': { en: 'When did this transaction happen?', ar: 'متى حدثت هذه المعاملة؟' },
  'addTransaction.additionalDetails': { en: 'Additional Details', ar: 'تفاصيل إضافية' },
  'addTransaction.additionalDetailsDesc': { en: 'Add notes, tags, and attachments', ar: 'أضف ملاحظات وعلامات ومرفقات' },
  'addTransaction.transactionType': { en: 'Transaction Type', ar: 'نوع المعاملة' },
  'addTransaction.selectCategory': { en: 'Select Category', ar: 'اختر الفئة' },
  'addTransaction.whenDidThisHappen': { en: 'When did this happen?', ar: 'متى حدث هذا؟' },
  'addTransaction.descriptionPlaceholder': { en: 'e.g., Lunch at Marina Walk', ar: 'مثل: غداء في مارينا ووك' },
  'addTransaction.merchantPlaceholder': { en: 'e.g., Marina Restaurant', ar: 'مثل: مطعم المارينا' },
  'addTransaction.locationPlaceholder': { en: 'e.g., Dubai Marina', ar: 'مثل: دبي مارينا' },
  'addTransaction.notesPlaceholder': { en: 'Add any additional notes...', ar: 'أضف أي ملاحظات إضافية...' },
  'addTransaction.addTag': { en: 'Add tag...', ar: 'أضف علامة...' },
  'addTransaction.summary': { en: 'Transaction Summary', ar: 'ملخص المعاملة' },
  'addTransaction.saveTransaction': { en: 'Save Transaction', ar: 'حفظ المعاملة' },
  'addTransaction.step': { en: 'Step', ar: 'الخطوة' },
  'addTransaction.income': { en: 'Income', ar: 'دخل' },
  'addTransaction.expense': { en: 'Expense', ar: 'مصروف' },
  'addTransaction.transfer': { en: 'Transfer', ar: 'تحويل' },
  
  // Analytics
  'analytics.title': { en: 'Analytics', ar: 'التحليلات' },
  'analytics.subtitle': { en: 'Insights into your spending patterns', ar: 'رؤى حول أنماط إنفاقك' },
  'analytics.totalIncome': { en: 'Total Income', ar: 'إجمالي الدخل' },
  'analytics.totalExpenses': { en: 'Total Expenses', ar: 'إجمالي المصروفات' },
  'analytics.netIncome': { en: 'Net Income', ar: 'صافي الدخل' },
  'analytics.savingsRate': { en: 'Savings Rate', ar: 'معدل الادخار' },
  'analytics.topCategories': { en: 'Top Categories', ar: 'الفئات الأعلى' },
  'analytics.monthlyTrends': { en: 'Monthly Trends', ar: 'الاتجاهات الشهرية' },
  'analytics.financialGoals': { en: 'Financial Goals', ar: 'الأهداف المالية' },
  'analytics.addGoal': { en: 'Add Goal', ar: 'إضافة هدف' },
  'analytics.insights': { en: 'Smart Insights', ar: 'رؤى ذكية' },
  'analytics.exportReport': { en: 'Export Report', ar: 'تصدير التقرير' },
  'analytics.budgetPlanner': { en: 'Budget Planner', ar: 'مخطط الميزانية' },
  
  // Filter Options
  'All Transactions': { en: 'All Transactions', ar: 'جميع المعاملات' },
  'Income': { en: 'Income', ar: 'الدخل' },
  'Expenses': { en: 'Expenses', ar: 'المصروفات' },
  'Transfers': { en: 'Transfers', ar: 'التحويلات' },
  'Today': { en: 'Today', ar: 'اليوم' },
  'This Week': { en: 'This Week', ar: 'هذا الأسبوع' },
  'This Month': { en: 'This Month', ar: 'هذا الشهر' },
  'This Year': { en: 'This Year', ar: 'هذا العام' },
  'Custom Range': { en: 'Custom Range', ar: 'نطاق مخصص' },
  'Overview': { en: 'Overview', ar: 'نظرة عامة' },
  'Categories': { en: 'Categories', ar: 'الفئات' },
  'Trends': { en: 'Trends', ar: 'الاتجاهات' },
  'Goals': { en: 'Goals', ar: 'الأهداف' },
  
  // Biller Categories
  'billers.utilities': { en: 'Utilities', ar: 'المرافق' },
  'billers.telecom': { en: 'Telecom', ar: 'الاتصالات' },
  'billers.education': { en: 'Education', ar: 'التعليم' },
  'billers.government': { en: 'Government', ar: 'الحكومة' },
  'billers.insurance': { en: 'Insurance', ar: 'التأمين' },
  'billers.other': { en: 'Other', ar: 'أخرى' },
  
  // Common
  'common.continue': { en: 'Continue', ar: 'متابعة' },
  'common.back': { en: 'Back', ar: 'العودة' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.confirm': { en: 'Confirm', ar: 'تأكيد' },
  'common.amount': { en: 'Amount', ar: 'المبلغ' },
  'common.billNumber': { en: 'Bill Number', ar: 'رقم الفاتورة' },
  'common.accountNumber': { en: 'Account Number', ar: 'رقم الحساب' },
  'common.customerNumber': { en: 'Customer Number', ar: 'رقم العميل' },
  'common.search': { en: 'Search', ar: 'بحث' },
  'common.searchTransactions': { en: 'Search transactions...', ar: 'البحث في المعاملات...' },
  'common.recent': { en: 'Recent', ar: 'الأخيرة' },
  'common.favorites': { en: 'Favorites', ar: 'المفضلة' },
  'common.filters': { en: 'Filters', ar: 'المرشحات' },
  'common.results': { en: 'results', ar: 'نتيجة' },
  'common.loading': { en: 'Loading...', ar: 'جارٍ التحميل...' },
  'common.category': { en: 'Category', ar: 'الفئة' },
  'common.type': { en: 'Type', ar: 'النوع' },
  'common.merchant': { en: 'Merchant', ar: 'التاجر' },
  'common.reference': { en: 'Reference', ar: 'المرجع' },
  'common.status': { en: 'Status', ar: 'الحالة' },
  'common.location': { en: 'Location', ar: 'الموقع' },
  'common.notes': { en: 'Notes', ar: 'الملاحظات' },
  'common.tags': { en: 'Tags', ar: 'العلامات' },
  'common.date': { en: 'Date', ar: 'التاريخ' },
  'common.time': { en: 'Time', ar: 'الوقت' },
  'common.description': { en: 'Description', ar: 'الوصف' },
  'common.optional': { en: 'Optional', ar: 'اختياري' },
  'common.of': { en: 'of', ar: 'من' },
  'common.next': { en: 'Next', ar: 'التالي' },
  'common.previous': { en: 'Previous', ar: 'السابق' },
  'common.saving': { en: 'Saving...', ar: 'جارٍ الحفظ...' },
  'common.edit': { en: 'Edit', ar: 'تعديل' },
  'common.delete': { en: 'Delete', ar: 'حذف' },
  'common.share': { en: 'Share', ar: 'مشاركة' },
  'common.copy': { en: 'Copy', ar: 'نسخ' },
  'common.export': { en: 'Export', ar: 'تصدير' },
  'common.receipt': { en: 'Receipt', ar: 'الإيصال' },
  'common.moreActions': { en: 'More Actions', ar: 'المزيد من الإجراءات' },
  'common.addToFavorites': { en: 'Add to Favorites', ar: 'إضافة للمفضلة' },
  'common.removeFromFavorites': { en: 'Remove from Favorites', ar: 'إزالة من المفضلة' },
  'common.showAmounts': { en: 'Show Amounts', ar: 'إظهار المبالغ' },
  'common.hideAmounts': { en: 'Hide Amounts', ar: 'إخفاء المبالغ' },
  'common.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'common.nickname': { en: 'Nickname', ar: 'الاسم المستعار' },
  'common.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'common.phoneNumber': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'common.relationship': { en: 'Relationship', ar: 'العلاقة' },
  'common.purpose': { en: 'Purpose', ar: 'الغرض' },
  'common.bank': { en: 'Bank', ar: 'البنك' },
  'common.currency': { en: 'Currency', ar: 'العملة' },
  'common.swiftCode': { en: 'SWIFT Code', ar: 'كود سويفت' },
  'common.branch': { en: 'Branch', ar: 'الفرع' },
  'common.accountTitle': { en: 'Account Title', ar: 'اسم الحساب' },
  'common.confidence': { en: 'Confidence', ar: 'الثقة' },
  'common.complete': { en: 'Complete', ar: 'مكتمل' },
  'common.found': { en: 'found', ar: 'موجود' },
  'common.show': { en: 'Show', ar: 'إظهار' },
  'common.hide': { en: 'Hide', ar: 'إخفاء' },
  'common.showAccounts': { en: 'Show Accounts', ar: 'إظهار الحسابات' },
  'common.hideAccounts': { en: 'Hide Accounts', ar: 'إخفاء الحسابات' },
  'common.showAdvanced': { en: 'Show Advanced', ar: 'إظهار المتقدم' },
  'common.hideAdvanced': { en: 'Hide Advanced', ar: 'إخفاء المتقدم' },
  'common.selectRelationship': { en: 'Select relationship...', ar: 'اختر العلاقة...' },
  'common.selectPurpose': { en: 'Select purpose...', ar: 'اختر الغرض...' },
  'common.reviewDetails': { en: 'Review Details', ar: 'مراجعة التفاصيل' },
  'common.saveOnly': { en: 'Save Only', ar: 'حفظ فقط' },
  
  // Validation Messages
  'validation.required': { en: 'This field is required', ar: 'هذا الحقل مطلوب' },
  'validation.invalidAmount': { en: 'Please enter a valid amount', ar: 'يرجى إدخال مبلغ صحيح' },
  'validation.minAmount': { en: 'Minimum amount is', ar: 'الحد الأدنى للمبلغ هو' },
  'validation.maxAmount': { en: 'Maximum amount is', ar: 'الحد الأقصى للمبلغ هو' },
  'validation.invalidBillNumber': { en: 'Please enter a valid bill number', ar: 'يرجى إدخال رقم فاتورة صحيح' },
  
  // Success Messages
  'success.paymentCompleted': { en: 'Payment completed successfully!', ar: 'تم الدفع بنجاح!' },
  'success.billPaid': { en: 'Your bill has been paid', ar: 'تم دفع فاتورتك' },
  'success.transactionAdded': { en: 'Transaction added successfully!', ar: 'تم إضافة المعاملة بنجاح!' },
  'success.transactionUpdated': { en: 'Transaction updated successfully!', ar: 'تم تحديث المعاملة بنجاح!' },
  
  // Error Messages
  'error.paymentFailed': { en: 'Payment failed. Please try again.', ar: 'فشل الدفع. يرجى المحاولة مرة أخرى.' },
  'error.insufficientFunds': { en: 'Insufficient funds', ar: 'رصيد غير كافٍ' },
  'error.networkError': { en: 'Network error. Please check your connection.', ar: 'خطأ في الشبكة. يرجى التحقق من الاتصال.' },
  'error.transactionFailed': { en: 'Transaction failed. Please try again.', ar: 'فشلت المعاملة. يرجى المحاولة مرة أخرى.' },

  // Manage Cards
  'manageCards.title': { en: 'Manage Cards', ar: 'إدارة البطاقات' },
  'manageCards.subtitle': { en: 'Your payment cards and settings', ar: 'بطاقاتك وإعداداتها' },
  'manageCards.addCard': { en: 'Add New Card', ar: 'إضافة بطاقة جديدة' },
  'manageCards.searchCards': { en: 'Search cards...', ar: 'البحث في البطاقات...' },
  'manageCards.totalCards': { en: 'Total Cards', ar: 'إجمالي البطاقات' },
  'manageCards.activeCards': { en: 'Active Cards', ar: 'البطاقات النشطة' },
  'manageCards.monthlySpend': { en: 'Monthly Spend', ar: 'الإنفاق الشهري' },
  'manageCards.noCards': { en: 'No Cards Found', ar: 'لم يتم العثور على بطاقات' },
  'manageCards.scanCard': { en: 'Scan Card', ar: 'مسح البطاقة' },
  'manageCards.viewDetails': { en: 'View Details', ar: 'عرض التفاصيل' },
  'manageCards.editCard': { en: 'Edit Card', ar: 'تعديل البطاقة' },
  'manageCards.blockCard': { en: 'Block Card', ar: 'حظر البطاقة' },
  'manageCards.unblockCard': { en: 'Unblock Card', ar: 'إلغاء حظر البطاقة' },
  'manageCards.deleteCard': { en: 'Delete Card', ar: 'حذف البطاقة' },
  'manageCards.setDefault': { en: 'Set as Default', ar: 'تعيين كافتراضي' },
  'manageCards.addToFavorites': { en: 'Add to Favorites', ar: 'إضافة للمفضلة' },
  'manageCards.removeFromFavorites': { en: 'Remove from Favorites', ar: 'إزالة من المفضلة' },

  // Add Card
  'addCard.title': { en: 'Add New Card', ar: 'إضافة بطاقة جديدة' },
  'addCard.subtitle': { en: 'Add your payment card securely', ar: 'أضف بطاقة الدفع بأمان' },
  'addCard.cardNumber': { en: 'Card Number', ar: 'رقم البطاقة' },
  'addCard.cardholderName': { en: 'Cardholder Name', ar: 'اسم حامل البطاقة' },
  'addCard.expiryDate': { en: 'Expiry Date', ar: 'تاريخ انتهاء الصلاحية' },
  'addCard.cvv': { en: 'CVV', ar: 'رمز الأمان' },
  'addCard.cardName': { en: 'Card Name', ar: 'اسم البطاقة' },
  'addCard.cardType': { en: 'Card Type', ar: 'نوع البطاقة' },
  'addCard.features': { en: 'Card Features', ar: 'مميزات البطاقة' },
  'addCard.setAsDefault': { en: 'Set as Default Card', ar: 'تعيين كبطاقة افتراضية' },
  'addCard.scanCardOption': { en: 'Scan Card with Camera', ar: 'مسح البطاقة بالكاميرا' },
  'addCard.enterManually': { en: 'Or enter card details manually below', ar: 'أو أدخل تفاصيل البطاقة يدوياً أدناه' },
  'addCard.scanning': { en: 'Scanning Your Card', ar: 'جاري مسح البطاقة' },
  'addCard.positionCard': { en: 'Position your card within the frame', ar: 'ضع البطاقة داخل الإطار' },
  'addCard.step1': { en: 'Card Information', ar: 'معلومات البطاقة' },
  'addCard.step2': { en: 'Security Details', ar: 'تفاصيل الأمان' },
  'addCard.step3': { en: 'Card Settings', ar: 'إعدادات البطاقة' },
  'addCard.addSecurely': { en: 'Add Card Securely', ar: 'إضافة البطاقة بأمان' },
  'addCard.cardAdded': { en: 'Card added successfully!', ar: 'تم إضافة البطاقة بنجاح!' },
  'addCard.invalidCard': { en: 'Invalid card number', ar: 'رقم بطاقة غير صحيح' },
  'addCard.invalidExpiry': { en: 'Invalid expiry date', ar: 'تاريخ انتهاء صلاحية غير صحيح' },
  'addCard.invalidCvv': { en: 'Invalid CVV', ar: 'رمز أمان غير صحيح' },
  'addCard.required': { en: 'This field is required', ar: 'هذا الحقل مطلوب' },
  'addCard.nameRequired': { en: 'Cardholder name is required', ar: 'اسم حامل البطاقة مطلوب' },
  'addCard.cardExpired': { en: 'Card is expired', ar: 'البطاقة منتهية الصلاحية' },
  'addCard.processing': { en: 'Adding your card...', ar: 'جاري إضافة البطاقة...' },
  'addCard.secureNotice': { en: 'Your card information is encrypted and secure', ar: 'معلومات البطاقة مشفرة وآمنة' },

  // Card Details
  'cardDetails.availableBalance': { en: 'Available Balance', ar: 'الرصيد المتاح' },
  'cardDetails.creditLimit': { en: 'Credit Limit', ar: 'حد الائتمان' },
  'cardDetails.dailyLimit': { en: 'Daily Limit', ar: 'الحد اليومي' },
  'cardDetails.monthlyLimit': { en: 'Monthly Limit', ar: 'الحد الشهري' },
  'cardDetails.lastUsed': { en: 'Last Used', ar: 'آخر استخدام' },
  'cardDetails.showBalance': { en: 'Show Balance', ar: 'إظهار الرصيد' },
  'cardDetails.hideBalance': { en: 'Hide Balance', ar: 'إخفاء الرصيد' },
  'cardDetails.copyNumber': { en: 'Copy Card Number', ar: 'نسخ رقم البطاقة' },
  'cardDetails.copied': { en: 'Copied!', ar: 'تم النسخ!' },
  'cardDetails.recentTransactions': { en: 'Recent Transactions', ar: 'المعاملات الأخيرة' },
  'cardDetails.viewAll': { en: 'View All', ar: 'عرض الكل' },
  'cardDetails.exportStatement': { en: 'Export Statement', ar: 'تصدير الكشف' },
  'cardDetails.shareDetails': { en: 'Share Details', ar: 'مشاركة التفاصيل' },
  'cardDetails.transactionHistory': { en: 'Transaction History', ar: 'تاريخ المعاملات' },
  'cardDetails.noTransactions': { en: 'No transactions found', ar: 'لم يتم العثور على معاملات' },
  'cardDetails.searchTransactions': { en: 'Search transactions...', ar: 'البحث في المعاملات...' },
  'cardDetails.rewards': { en: 'Rewards', ar: 'المكافآت' },
  'cardDetails.points': { en: 'Points', ar: 'النقاط' },
  'cardDetails.cashback': { en: 'Cashback', ar: 'استرداد نقدي' },
  'cardDetails.tier': { en: 'Tier', ar: 'المستوى' },

  // Transaction Track
  'transactionTrack.title': { en: 'Track Your Transfer', ar: 'تتبع التحويل' },
  'transactionTrack.subtitle': { en: 'Enter your reference number to track transfer status', ar: 'أدخل الرقم المرجعي لتتبع حالة التحويل' },
  'transactionTrack.referenceNumber': { en: 'Reference Number', ar: 'الرقم المرجعي' },
  'transactionTrack.placeholder': { en: 'AG240110001234 or TXN-2024-001234567', ar: 'AG240110001234 أو TXN-2024-001234567' },
  'transactionTrack.helperText': { en: 'Enter the reference number from your transfer confirmation', ar: 'أدخل الرقم المرجعي من تأكيد التحويل' },
  'transactionTrack.trackTransfer': { en: 'Track Transfer', ar: 'تتبع التحويل' },
  'transactionTrack.searching': { en: 'Searching...', ar: 'جاري البحث...' },
  'transactionTrack.scanQR': { en: 'Scan QR Code', ar: 'مسح رمز QR' },
  'transactionTrack.recentTransfers': { en: 'Recent Transfers', ar: 'التحويلات الأخيرة' },
  'transactionTrack.transactionStatus': { en: 'Transaction Status', ar: 'حالة المعاملة' },
  'transactionTrack.progress': { en: 'Progress', ar: 'التقدم' },
  'transactionTrack.recipient': { en: 'Recipient', ar: 'المستلم' },
  'transactionTrack.fromAccount': { en: 'From Account', ar: 'من الحساب' },
  'transactionTrack.initiated': { en: 'Initiated', ar: 'بدأت' },
  'transactionTrack.estimatedTime': { en: 'Estimated Time', ar: 'الوقت المقدر' },
  'transactionTrack.amount': { en: 'Amount', ar: 'المبلغ' },
  'transactionTrack.details': { en: 'Details', ar: 'التفاصيل' },
  'transactionTrack.receipt': { en: 'Receipt', ar: 'الإيصال' },
  'transactionTrack.share': { en: 'Share', ar: 'مشاركة' },
  'transactionTrack.timeline': { en: 'Transaction Timeline', ar: 'الجدول الزمني للمعاملة' },
  'transactionTrack.inProgress': { en: 'In progress...', ar: 'قيد التنفيذ...' },
  'transactionTrack.needHelp': { en: 'Need Help?', ar: 'تحتاج مساعدة؟' },
  'transactionTrack.contactSupport': { en: 'Contact our support team', ar: 'اتصل بفريق الدعم' },
  'transactionTrack.call': { en: 'Call', ar: 'اتصال' },
  'transactionTrack.callSupport': { en: 'Call Support', ar: 'اتصل بالدعم' },
  'transactionTrack.liveChat': { en: 'Live Chat', ar: 'محادثة مباشرة' },
  'transactionTrack.notifications': { en: 'Notification Preferences', ar: 'تفضيلات الإشعارات' },
  'transactionTrack.smsUpdates': { en: 'SMS Updates', ar: 'تحديثات SMS' },
  'transactionTrack.pushNotifications': { en: 'Push Notifications', ar: 'الإشعارات الفورية' },
  'transactionTrack.supportMessage': { en: 'Can\'t find your transaction? Our support team is here to help 24/7', ar: 'لا يمكنك العثور على معاملتك؟ فريق الدعم متاح للمساعدة على مدار 24/7' },
  'transactionTrack.securityNotice': { en: 'Your transaction data is encrypted and secure', ar: 'بيانات معاملتك مشفرة وآمنة' },

  // Transaction Status
  'transactionStatus.initiated': { en: 'Initiated', ar: 'بدأت' },
  'transactionStatus.processing': { en: 'Processing', ar: 'قيد المعالجة' },
  'transactionStatus.completed': { en: 'Completed', ar: 'مكتملة' },
  'transactionStatus.failed': { en: 'Failed', ar: 'فشلت' },
  'transactionStatus.cancelled': { en: 'Cancelled', ar: 'ملغية' },
  'transactionStatus.pendingVerification': { en: 'Pending Verification', ar: 'في انتظار التحقق' },
  'transactionStatus.inTransit': { en: 'In Transit', ar: 'في الطريق' },
  'transactionStatus.processingDescription': { en: 'Transfer in progress...', ar: 'التحويل قيد التنفيذ...' },
  'transactionStatus.completedDescription': { en: 'Transfer completed successfully', ar: 'تم التحويل بنجاح' },
  'transactionStatus.failedDescription': { en: 'Transfer failed', ar: 'فشل التحويل' },
  'transactionStatus.initiatedDescription': { en: 'Transfer initiated', ar: 'بدء التحويل' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 