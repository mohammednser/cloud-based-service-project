import React, { useState } from 'react';

const CrawlerButton: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRunCrawler = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/run-crawler', { method: 'POST' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setStatus('success');
      setMessage(data.message || 'تم جلب الملفات بنجاح!');
    } catch (err: any) {
      setStatus('error');
      setMessage('حدث خطأ أثناء جلب الملفات.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        onClick={handleRunCrawler}
        disabled={status === 'loading'}
        className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg tracking-wide
          ${status === 'loading' ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'}
        `}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            جاري جلب ملفات PDF...
          </span>
        ) : (
          <span>جلب ملفات PDF من الإنترنت</span>
        )}
      </button>
      {status === 'success' && (
        <span className="text-green-600 dark:text-green-400 font-semibold animate-pulse">{message}</span>
      )}
      {status === 'error' && (
        <span className="text-red-600 dark:text-red-400 font-semibold animate-pulse">{message}</span>
      )}
    </div>
  );
};

export default CrawlerButton;
