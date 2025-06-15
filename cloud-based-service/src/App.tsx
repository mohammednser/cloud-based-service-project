import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from './components/LanguageContext';
import { useTheme } from './components/ThemeContext';

// Import components
import Upload from './components/Upload';
import Search from './components/Search';
import Stats from './components/Stats';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';

// Configure Amplify
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const MainNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const navItems = [
    {
      to: '/stats',
      color: 'bg-orange-400 hover:bg-orange-500',
      icon: (
        // أيقونة رسم بياني للإحصائيات
        <svg className="w-6 h-6 mb-1 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19V7m4 12V3m4 16v-8m4 8v-4m4 4V5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
      label: t.stats,
    },
    {
      to: '/sort',
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: (
        // أيقونة شجرة/مجلدات للتصنيف
        <svg className="w-6 h-6 mb-1 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 3v12M6 15l-2 2m2-2l2 2M18 3v6m0 6v6m0-6l-2 2m2-2l2 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
      label: t.sort,
    },
    {
      to: '/search',
      color: 'bg-pink-400 hover:bg-pink-500',
      icon: (
        // أيقونة مستندات (مجلد مفتوح)
        <svg className="w-6 h-6 mb-1 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h3.17a2 2 0 011.41.59l1.83 1.83A2 2 0 0012.83 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
      label: t.search,
    },
    {
      to: '/upload',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      icon: (
        // أيقونة رفع (سهم للأعلى داخل دائرة)
        <svg className="w-6 h-6 mb-1 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16V8m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
      label: t.upload,
    },
    {
      to: '/settings',
      color: 'bg-gray-400 hover:bg-gray-500',
      icon: (
        // أيقونة إعدادات (ترس)
        <svg className="w-6 h-6 mb-1 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
      ),
      label: t.settings,
    },
  ];
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-6 px-4">
      <Link to="/" className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0 cursor-pointer select-none">
        {t.upload.includes('Upload') ? 'Cloud Docs' : 'تطبيق المستندات'}
      </Link>
      <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center rounded-xl shadow-lg px-8 py-4 text-white font-semibold text-lg transition-all duration-200 ${item.color} ${location.pathname === item.to ? 'ring-4 ring-indigo-200' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const HomeHero: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-10 transition-colors duration-300 relative overflow-hidden">
      {/* خلفية متدرجة متحركة */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 opacity-60 blur-2xl" />
      <div className="relative z-10 flex flex-col items-center">
        {/* صورة تعبيرية عصرية عن المشروع */}
        <img src="/project-hero.png" alt="Document Cloud Illustration" className="w-40 h-40 mb-4 drop-shadow-2xl rounded-2xl object-contain bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 animate-fade-in" style={{marginTop: '-1rem'}} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-4 drop-shadow-lg animate-fade-in">
          Cloud-Based Program for Basic Data Analytics
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <Link to="/upload" className="bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 focus:scale-105">
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            {t.startUpload}
          </Link>
          <Link to="/search" className="bg-white dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-400 text-indigo-700 dark:text-indigo-200 font-bold px-8 py-4 rounded-xl shadow text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 focus:scale-105">
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            {t.browseDocs}
          </Link>
        </div>
      </div>
    </section>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}
      aria-label="تبديل الوضع الليلي"
    >
      {theme === 'dark' ? (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
};

const AppContent: React.FC = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();

  // Ensure the theme class is always set on the html element
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex">
        <Sidebar />
        <main className="main-centered p-6">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/search" element={<Search />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/sort" element={<div className='text-center text-gray-500 text-xl py-20'>ميزة التصنيف قيد التطوير</div>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <ToastContainer
        position={lang === 'ar' ? 'top-left' : 'top-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={lang === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
