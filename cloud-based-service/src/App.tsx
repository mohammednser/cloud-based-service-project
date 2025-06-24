import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
