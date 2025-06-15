import React, { createContext, useContext, useState, useEffect } from 'react';

const LANG_KEY = 'app-lang';

const translations = {  ar: {
    welcome: 'مرحباً بك في نظام تحليل المستندات السحابي',
    description: 'منصة ذكية لرفع، إدارة، وتحليل المستندات بسهولة وأمان. استمتع بواجهة عصرية متجاوبة تدعم جميع الأجهزة.',
    upload: 'رفع ملفات',
    search: 'تصفح المستندات',
    stats: 'إحصائيات',
    sort: 'تصنيف',
    settings: 'الإعدادات',
    language: 'اللغة',
    darkMode: 'الوضع الليلي',
    arabic: 'عربي',
    english: 'English',
    dark: 'داكن',
    light: 'فاتح',
    saved: 'الإعدادات تحفظ تلقائيًا',
    startUpload: 'ابدأ برفع مستند',
    browseDocs: 'تصفح المستندات',
    searchPlaceholder: 'ابحث عن مستندات...',
    searching: 'جاري البحث...',
    noResults: 'لا توجد نتائج',
    uploadedOn: 'تم الرفع في:',
    sortTitle: 'تصنيف وفرز المستندات',
    title: 'العنوان',
    category: 'التصنيف',
    size: 'الحجم',
    lastUpdated: 'آخر تحديث',
    ascending: '↑ تصاعدي',
    descending: '↓ تنازلي',
    loadingStats: 'جاري تحميل الإحصائيات...',
    generalStats: 'إحصائيات عامة',
    totalDocs: 'إجمالي المستندات:',
    totalSize: 'إجمالي الحجم:',
    avgSize: 'متوسط حجم المستند:',
    categoryDist: 'التوزيع حسب التصنيف',
    noCategories: 'لا توجد تصنيفات',
    languageDist: 'التوزيع حسب اللغة',
    noLangData: 'لا توجد بيانات لغة',
    chooseFiles: 'اختر الملفات',
    selectedFiles: 'الملفات المختارة:',
    selectFile: 'الرجاء اختيار ملف للرفع',
    uploadSuccess: 'تم رفع الملفات بنجاح!',
    uploadError: 'حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى.',
    uploading: 'جاري الرفع...',
    uploadFiles: 'رفع الملفات',
  },
  en: {
    welcome: 'Welcome to the Cloud Document App',
    description: 'A smart platform for uploading, managing, and classifying documents easily and securely. Enjoy a modern, responsive interface for all devices.',
    upload: 'Upload Document',
    search: 'Browse Documents',
    stats: 'Statistics',
    sort: 'Sort',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    arabic: 'Arabic',
    english: 'English',
    dark: 'Dark',
    light: 'Light',
    saved: 'Settings are saved automatically',
    startUpload: 'Start Upload',
    browseDocs: 'Browse Documents',
    searchPlaceholder: 'Search documents...',
    searching: 'Searching...',
    noResults: 'No results found',
    uploadedOn: 'Uploaded on:',
    sortTitle: 'Sort & Classify Documents',
    title: 'Title',
    category: 'Category',
    size: 'Size',
    lastUpdated: 'Last Updated',
    ascending: '↑ Ascending',
    descending: '↓ Descending',
    loadingStats: 'Loading statistics...',
    generalStats: 'General Statistics',
    totalDocs: 'Total Documents:',
    totalSize: 'Total Size:',
    avgSize: 'Average Document Size:',
    categoryDist: 'Category Distribution',
    noCategories: 'No categories',
    languageDist: 'Language Distribution',
    noLangData: 'No language data',
    chooseFiles: 'Choose Files',
    selectedFiles: 'Selected Files:',
    selectFile: 'Please select a file to upload',
    uploadSuccess: 'Files uploaded successfully!',
    uploadError: 'An error occurred during upload. Please try again.',
    uploading: 'Uploading...',
    uploadFiles: 'Upload Files',
  },
};

const LanguageContext = createContext({
  lang: 'ar',
  setLang: (l: string) => {},
  t: translations['ar'],
});

const getDefaultLang = () => {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored) return stored;
  const browser = navigator.language || navigator.languages[0] || 'ar';
  return browser.startsWith('en') ? 'en' : 'ar';
};

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [lang, setLang] = useState(getDefaultLang);
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);
  const t = translations[lang as 'ar' | 'en'];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
