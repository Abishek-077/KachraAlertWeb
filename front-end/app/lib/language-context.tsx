"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "en" | "ne";

const LANGUAGE_STORAGE_KEY = "ka_language";

const NEPALI_TRANSLATIONS: Record<string, string> = {
  "Dashboard": "ड्यासबोर्ड",
  "Schedule": "तालिका",
  "Payments": "भुक्तानी",
  "Reports": "रिपोर्टहरू",
  "Alerts": "सूचनाहरू",
  "Messages": "सन्देशहरू",
  "Admin Panel": "प्रशासन प्यानल",
  "User Management": "प्रयोगकर्ता व्यवस्थापन",
  "Settings": "सेटिङहरू",
  "Logout": "लगआउट",
  "Smart Waste Management": "स्मार्ट फोहोर व्यवस्थापन",
  "Current Mode": "हालको मोड",
  "Admin / Driver": "प्रशासक / चालक",
  "Admin/Driver": "प्रशासक/चालक",
  "Resident": "बासिन्दा",
  "Resident Mode": "बासिन्दा मोड",
  "Admin / Driver Mode": "प्रशासक / चालक मोड",
  "Switch between admin and resident views.": "प्रशासक र बासिन्दा दृश्य बीच स्विच गर्नुहोस्।",
  "Expand sidebar": "साइडबार विस्तार गर्नुहोस्",
  "Collapse sidebar": "साइडबार सानो गर्नुहोस्",
  "Search reports, payments, schedules...": "रिपोर्ट, भुक्तानी, तालिका खोज्नुहोस्...",
  "Notifications": "सूचना",
  "Profile": "प्रोफाइल",
  "Profile photo": "प्रोफाइल फोटो",
  "No Photo": "फोटो छैन",
  "Upload photo": "फोटो अपलोड गर्नुहोस्",
  "Uploading...": "अपलोड हुँदैछ...",
  "PNG or JPG up to 5MB.": "PNG वा JPG, अधिकतम 5MB।",
  "Full name": "पुरा नाम",
  "Email": "इमेल",
  "Phone": "फोन",
  "Save changes": "परिवर्तन सुरक्षित गर्नुहोस्",
  "Saving...": "सेभ हुँदैछ...",
  "Address": "ठेगाना",
  "Society": "समाज",
  "Building": "भवन",
  "Apartment": "अपार्टमेन्ट",
  "Save address": "ठेगाना सुरक्षित गर्नुहोस्",
  "Pickup reminders": "संकलन सम्झाइ",
  "Get notified 30 minutes before pickup": "संकलन अघि 30 मिनेटमा सूचना पाउनुहोस्",
  "Enabled": "सक्रिय",
  "Payment updates": "भुक्तानी अपडेट",
  "Invoice due & payment confirmations": "इनभ्वाइस बाँकी र भुक्तानी पुष्टि",
  "Urgent alerts": "तत्काल सूचना",
  "Route changes, delays, road blockage": "मार्ग परिवर्तन, ढिलाइ, सडक अवरोध",
  "Security": "सुरक्षा",
  "Change password": "पासवर्ड परिवर्तन",
  "New password": "नयाँ पासवर्ड",
  "Confirm password": "पासवर्ड पुष्टि गर्नुहोस्",
  "Update password": "पासवर्ड अपडेट गर्नुहोस्",
  "Customize your experience": "आफ्नो अनुभव अनुकूलित गर्नुहोस्",
  "Update your profile details": "आफ्नो प्रोफाइल विवरण अपडेट गर्नुहोस्",
  "Language": "भाषा",
  "Language preference": "भाषा प्राथमिकता",
  "Choose the app language for all static text.": "सबै स्थिर पाठका लागि एपको भाषा छान्नुहोस्।",
  "English": "अंग्रेजी",
  "Nepali": "नेपाली",
  "Current language": "हालको भाषा",
  "Welcome back": "फेरि स्वागत छ",
  "Welcome back 👋": "फेरि स्वागत छ 👋",
  "Your next collection is in": "तपाईंको अर्को संकलन",
  "4 hours 30 minutes": "4 घण्टा 30 मिनेट",
  "Report an issue": "समस्या रिपोर्ट गर्नुहोस्",
  "View schedule": "तालिका हेर्नुहोस्",
  "Pay now": "अहिले भुक्तानी गर्नुहोस्",
  "Pickups this month": "यस महिनाको संकलन",
  "On-time: 91%": "समयमै: 91%",
  "Payment status": "भुक्तानी स्थिति",
  "Due": "बाँकी",
  "Paid": "तिरेको",
  "All clear": "सबै ठीक छ",
  "Unread alerts": "नपढिएका सूचना",
  "Tap bell to view": "हेर्न बेल थिच्नुहोस्",
  "Complaints resolved": "समाधान भएका गुनासा",
  "Last 30 days": "पछिल्ला 30 दिन",
  "Recent reports": "हालका रिपोर्टहरू",
  "Track issues you've submitted": "तपाईंले पठाएका समस्याहरू ट्र्याक गर्नुहोस्",
  "Track issues you’ve submitted": "तपाईंले पठाएका समस्याहरू ट्र्याक गर्नुहोस्",
  "New report": "नयाँ रिपोर्ट",
  "Next Collection": "अर्को संकलन",
  "Get ready - we'll notify you before pickup": "तयार रहनुहोस् - संकलन अघि सूचना दिनेछौं",
  "Get ready — we’ll notify you before pickup": "तयार रहनुहोस् - संकलन अघि सूचना दिनेछौं",
  "Today": "आज",
  "Ward 10, Kathmandu": "वडा 10, काठमाडौं",
  "Time remaining": "बाँकी समय",
  "Tip: Keep segregated waste ready near your pickup point.": "सुझाव: छुट्याएको फोहोर संकलन बिन्दु नजिक तयार राख्नुहोस्।",
  "Quick actions": "छिटो कार्यहरू",
  "Set reminder": "रिमाइन्डर सेट गर्नुहोस्",
  "Reminder set (demo)": "रिमाइन्डर सेट भयो (डेमो)",
  "Reminders will appear in your alerts and (later) push notifications.": "रिमाइन्डरहरू तपाईंका सूचना र (पछि) पुश नोटिफिकेसनमा देखिनेछन्।",
  "Weekly pickups": "साप्ताहिक संकलन",
  "Collections completed this week": "यस हप्तामा सम्पन्न संकलन",
  "Tip: Use reports to flag missed pickups or overflow issues.": "सुझाव: छुटेका संकलन वा ओभरफ्लो समस्याका लागि रिपोर्ट प्रयोग गर्नुहोस्।",
  "Alerts Center": "सूचना केन्द्र",
  "Filter": "फिल्टर",
  "Mark all read": "सबै पढिएको चिन्ह लगाउनुहोस्",
  "Read": "पढियो",
  "Mark read": "पढिएको चिन्ह लगाउनुहोस्",
  "View all": "सबै हेर्नुहोस्",
  "Latest updates and reminders": "नवीनतम अपडेट र रिमाइन्डर",
  "NEW": "नयाँ",
  "Enable alert sound": "सूचना ध्वनि सक्षम गर्नुहोस्",
  "Tap to allow urgent broadcast alerts to play a sound.": "तत्काल सूचना बज्न अनुमति दिन थिच्नुहोस्।",
  "Close": "बन्द गर्नुहोस्",
  "Today’s schedule": "आजको तालिका",
  "Today's schedule": "आजको तालिका",
  "Open": "खुला",
  "In Progress": "प्रक्रियामा",
  "Resolved": "समाधान गरिएको",
  "Low": "कम",
  "Medium": "मध्यम",
  "High": "उच्च",
  "Overdue": "म्याद नाघेको",
  "Upcoming": "आउँदैछ",
  "Completed": "सम्पन्न",
  "Missed": "छुटेको",
  "Biodegradable": "जैविक",
  "Dry Waste": "सुख्खा फोहोर",
  "Plastic": "प्लास्टिक",
  "Glass": "काँच",
  "Metal": "धातु",
  "Mon": "सोम",
  "Tue": "मंगल",
  "Wed": "बुध",
  "Thu": "बिही",
  "Fri": "शुक्र",
  "Sat": "शनि",
  "Sun": "आइत"
};

function withOriginalWhitespace(original: string, translatedCore: string) {
  const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return translatedCore;
  return `${match[1]}${translatedCore}${match[3]}`;
}

export function translateText(language: AppLanguage, text: string) {
  if (language === "en") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  const translated = NEPALI_TRANSLATIONS[trimmed];
  if (!translated) return text;
  return withOriginalWhitespace(text, translated);
}

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (next: AppLanguage) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en" || stored === "ne") {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.setAttribute("data-language", language);
    }
  }, [language]);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (text: string) => {
      return translateText(language, text);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
