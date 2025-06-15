import React, { useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import CrawlerButton from './CrawlerButton';

const LANG_KEY = 'app-lang';
const THEME_KEY = 'app-theme';

const Settings: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleReset = () => {
    setLang('ar');
    setTheme('light');
    localStorage.setItem('app-lang', 'ar');
    localStorage.setItem('app-theme', 'light');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div
        className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-10 mt-10 transition-colors duration-300 border border-white/60 dark:border-gray-800/80 backdrop-blur-2xl flex flex-col gap-8"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-8 text-center tracking-tight drop-shadow-lg">
          {t.settings}
        </h2>

        {/* قسم واجهة المستخدم */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300 mb-6 text-center">
            {t.language}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* اللغة */}
            <div className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-md">
              <span className="text-lg text-gray-700 dark:text-gray-200 font-medium">{t.language}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-base font-bold transition-colors duration-300 ${
                    lang === 'ar' ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {t.arabic}
                </span>
                <button
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    lang === 'ar' ? 'bg-indigo-500 dark:bg-indigo-700' : 'bg-green-500 dark:bg-green-600'
                  } shadow-inner border-2 border-indigo-200 dark:border-indigo-700 flex items-center`}
                  aria-label={t.language}
                  tabIndex={0}
                  style={{ boxShadow: lang === 'ar' ? '0 2px 8px #6366f1' : '0 2px 8px #22c55e', minWidth: 64 }}
                >
                  <span
                    className={`absolute top-1 left-1 w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center bg-white dark:bg-gray-100 ${
                      lang === 'en' ? 'translate-x-7' : ''
                    } ring-2 ring-white dark:ring-gray-200 border border-indigo-300 dark:border-indigo-600`}
                  >
                    {lang === 'ar' ? (
                      <span className="text-indigo-600 font-bold text-base">ع</span>
                    ) : (
                      <span className="text-green-600 font-bold text-base">EN</span>
                    )}
                  </span>
                </button>
                <span
                  className={`text-base font-bold transition-colors duration-300 ${
                    lang === 'en' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {t.english}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* زر إعادة تعيين الإعدادات */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold shadow-lg hover:from-red-500 hover:to-pink-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 text-lg tracking-wide"
            aria-label={lang === 'ar' ? 'إعادة تعيين الإعدادات الافتراضية' : 'Reset to default settings'}
          >
            {lang === 'ar' ? 'إعادة تعيين الإعدادات الافتراضية' : 'Reset to default settings'}
          </button>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8 animate-pulse">
        {t.saved}
      </div>

      {/* زر تشغيل الكراولر */}
      <div className="flex justify-center mt-8 gap-4">
        <CrawlerButton />
        {/* زر تبديل الوضع */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`px-6 py-2 rounded-xl font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base tracking-wide
            ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
          {theme === 'dark' ? (lang === 'ar' ? 'وضع فاتح' : 'Light Mode') : (lang === 'ar' ? 'وضع داكن' : 'Dark Mode')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
