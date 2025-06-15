import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = [
    { to: '/', label: t.welcome, icon: (
      // أيقونة منزل عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ) },
    { to: '/upload', label: t.upload, icon: (
      // أيقونة رفع سحابية عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 16v-4a4 4 0 00-8 0v4" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v8m0 0l-3-3m3 3l3-3" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ) },
    { to: '/search', label: t.search, icon: (
      // أيقونة عدسة بحث عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    ) },
    { to: '/sort', label: t.sort, icon: (
      // أيقونة فرز وتصنيف عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h12M3 17h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ) },
    { to: '/stats', label: t.stats, icon: (
      // أيقونة إحصائيات/مخطط بياني عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="9" y="8" width="4" height="12" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
    ) },
    { to: '/settings', label: t.settings, icon: (
      // أيقونة إعدادات عصرية
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    ) },
  ];
  return (
    <aside
      className={`fixed ${lang === 'ar' ? 'right-0 rounded-l-3xl border-l' : 'left-0 rounded-r-3xl border-r'} top-0 h-full z-40 flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-white/90 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl border-white/60 dark:border-gray-800/60`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-2 mt-6 flex-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mb-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/70 shadow hover:scale-110 transition-transform border border-white/60 dark:border-gray-800/60"
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <svg
              className={`w-6 h-6 text-indigo-500 transform ${lang === 'ar' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg
              className={`w-6 h-6 text-indigo-500 transform ${lang === 'ar' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        <div className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.to
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-100/70 dark:hover:bg-gray-800/40'
              } ${collapsed ? 'justify-center' : lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <span className={`transition-transform ${!collapsed && location.pathname === item.to ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className={`${location.pathname === item.to ? 'font-semibold' : ''} font-arabic`}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className={`p-4 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl w-full transition-all duration-300 ${
            collapsed ? 'aspect-square' : ''
          } bg-white/80 dark:bg-gray-800/60 hover:bg-indigo-100/80 dark:hover:bg-gray-800/80 flex items-center gap-3 ${
            collapsed ? 'justify-center' : lang === 'ar' ? 'flex-row-reverse' : 'flex-row'
          } border border-white/60 dark:border-gray-800/60`}
        >
          {theme === 'dark' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          {!collapsed && (
            <span className="font-arabic">{theme === 'dark' ? t.light : t.dark}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
