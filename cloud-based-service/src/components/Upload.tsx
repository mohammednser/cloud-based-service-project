import React, { useState, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { createDocument } from '../graphql/mutations';
import { toast } from 'react-toastify';
import { useLanguage } from './LanguageContext';
import { extractPdfTitleAndText } from './extractPdfTitle';
import { classifyDocument } from './classifyDocument';
import { classifyWithNlpCloud } from './classifyWithNlpCloud';
import { extractDocxTitleAndText } from './extractDocxText';

const client = generateClient();

const Upload: React.FC = () => {
  const { lang, t } = useLanguage();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scrapedFiles, setScrapedFiles] = useState<string[]>([]);
  const [showCrawlModal, setShowCrawlModal] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlFiles, setCrawlFiles] = useState<string[]>([]);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  let crawlAbortController = useRef<AbortController | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setError(null);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const fileName = `documents/${Date.now()}-${file.name}`;
      await uploadData({
        key: fileName,
        data: file,
        options: {
          onProgress: (event) => {
            if (event.totalBytes) {
              setProgress(Math.round((event.transferredBytes / event.totalBytes) * 100));
            } else {
              setProgress(0);
            }
          },
        },
      }).result;

      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError(lang === 'ar' ? t.selectFile || 'الرجاء اختيار ملف للرفع' : t.selectFile || 'Please select a file to upload');
      toast.error(lang === 'ar' ? t.selectFile || 'الرجاء اختيار ملف للرفع' : t.selectFile || 'Please select a file to upload');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const key = await uploadFile(file);
        let title = file.name;
        let text = '';
        if (file.type === 'application/pdf') {
          try {
            const result = await extractPdfTitleAndText(file);
            title = result.title;
            text = result.text;
          } catch (e) {
            title = file.name;
            text = '';
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          try {
            const result = await extractDocxTitleAndText(file);
            title = result.title;
            text = result.text;
          } catch (e) {
            title = file.name;
            text = '';
          }
        }
        // تصنيف ذكي باستخدام NLP Cloud
        let category = '';
        if (process.env.REACT_APP_NLP_CLOUD_API_KEY) {
          category = (await classifyWithNlpCloud(text || title)) || '';
        }
        if (!category) {
          category = classifyDocument(title, text);
        }
        await client.graphql({
          query: createDocument,
          variables: {
            input: {
              title,
              fileName: file.name,
              text,
              size: file.size,
              s3Key: key,
              status: 'UPLOADED',
              createdAt: new Date().toISOString(),
              category,
            }
          }
        });
      }
      
      // Reset form
      setFiles(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      toast.success(lang === 'ar' ? t.uploadSuccess || 'تم رفع الملفات بنجاح!' : t.uploadSuccess || 'Files uploaded successfully!');
    } catch (error) {
      console.error('Error in upload process:', error);
      setError(lang === 'ar' ? t.uploadError || 'حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى.' : t.uploadError || 'An error occurred during upload. Please try again.');
      toast.error(lang === 'ar' ? t.uploadError || 'حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى.' : t.uploadError || 'An error occurred during upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // دالة لمعالجة اختيار فولدر ورفع جميع الملفات منه
  const handleFolderImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // فلترة الملفات PDF/Word فقط
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const filteredFiles = Array.from(e.target.files).filter(file => validTypes.includes(file.type));
      if (filteredFiles.length === 0) {
        setError(lang === 'ar' ? 'لا توجد ملفات PDF أو Word صالحة في هذا المجلد.' : 'No valid PDF or Word files found in this folder.');
        return;
      }
      // تحويل إلى FileList وهمي
      const dataTransfer = new DataTransfer();
      filteredFiles.forEach(file => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
      setError(null);
      toast.info(lang === 'ar' ? 'تم اختيار جميع الملفات من المجلد، اضغط رفع الملفات.' : 'All files from folder selected, click Upload Files.');
    }
  };

  // Drag & Drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      setError(null);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.classList.add('ring-4', 'ring-blue-300');
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.classList.remove('ring-4', 'ring-blue-300');
  };

  // دالة حذف ملف من القائمة
  const handleRemoveFile = (index: number) => {
    if (!files) return;
    const fileArray = Array.from(files);
    fileArray.splice(index, 1);
    const dataTransfer = new DataTransfer();
    fileArray.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  // دالة لجلب الملفات من مجلد scraped-files عبر API
  const handlePreviewScrapedFiles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/scraped-files');
      if (!response.ok) throw new Error('Network response was not ok');
      const files = await response.json();
      setScrapedFiles(files);
      toast.success(lang === 'ar' ? 'تم جلب الملفات من scraped-files.' : 'Fetched files from scraped-files.');
    } catch (err) {
      setScrapedFiles([]);
      setError(lang === 'ar' ? 'تعذر قراءة مجلد scraped-files.' : 'Failed to read scraped-files folder.');
      toast.error(lang === 'ar' ? 'تعذر قراءة مجلد scraped-files.' : 'Failed to read scraped-files folder.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div
        className="rounded-3xl shadow-2xl p-8 mt-10 transition-colors duration-300 border border-white/60 dark:border-gray-800/80 backdrop-blur-2xl flex flex-col gap-8 bg-white/90 dark:bg-gray-900/90"
      >
        <div className="flex justify-center mb-8">
          <img src="/Image upload-bro.png" alt="Upload Illustration" className="w-72 h-72 object-contain drop-shadow-2xl rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 animate-fade-in" />
        </div>

        <form onSubmit={handleUpload} className="space-y-8" onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}>
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="bg-white/40 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-gray-800/60 transition-all duration-300 p-10 flex flex-col items-center gap-8"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
          >
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-6 w-full">
              {/* زر اختيار ملفات فردية */}
              <label htmlFor="file-upload" className="cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-400 text-white px-12 py-6 rounded-2xl shadow-xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 font-bold text-xl tracking-wide flex-1 text-center border-2 border-transparent hover:border-blue-200">
                <svg className="inline-block w-7 h-7 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                {lang === 'ar' ? t.chooseFiles || 'اختر الملفات أو اسحبها هنا' : t.chooseFiles || 'Choose Files or Drag & Drop here'}
              </label>
              <input id="file-upload" name="file-upload" type="file" accept=".pdf,.doc,.docx" multiple onChange={handleFileChange} className="hidden" />
              {/* زر استيراد من فولدر */}
              <label htmlFor="folder-upload" className="cursor-pointer bg-gradient-to-r from-green-500 to-emerald-400 text-white px-12 py-6 rounded-2xl shadow-xl hover:from-green-600 hover:to-emerald-500 transition-all duration-300 font-bold text-xl tracking-wide flex-1 text-center border-2 border-transparent hover:border-emerald-200">
                <svg className="inline-block w-7 h-7 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h12M3 17h6" /></svg>
                {lang === 'ar' ? 'استيراد من مجلد' : 'Import from Folder'}
              </label>
              <input
                id="folder-upload"
                name="folder-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                // @ts-ignore
                webkitdirectory
                onChange={handleFolderImport}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 font-medium animate-fade-in-slow">{lang === 'ar' ? 'أو اسحب الملفات هنا للرفع' : 'Or drag and drop files here to upload'}</p>
          </div>

          {files && files.length > 0 && (
            <div className="mt-8 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-bold mb-4 text-indigo-700 dark:text-indigo-200">{lang === 'ar' ? 'الملفات المختارة:' : 'Selected Files:'}</h4>
              <ul className="space-y-2">
                {Array.from(files).map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-2 shadow-sm">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 7h.01" /></svg>
                    <span>{file.name} <span className="text-xs text-gray-400">({Math.round(file.size/1024)} KB)</span></span>
                    <button
                      className="ml-auto px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs font-bold transition-all flex items-center justify-center"
                      title={lang === 'ar' ? 'حذف الملف' : 'Delete file'}
                      aria-label={lang === 'ar' ? 'حذف الملف' : 'Delete file'}
                      onClick={() => handleRemoveFile(idx)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mt-6 text-red-600 text-center font-semibold bg-red-50 rounded-lg py-2 shadow">
              {error}
            </div>
          )}

          {uploading && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-400 h-3 rounded-full transition-all duration-300 shadow"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center mt-3 text-indigo-700 font-medium animate-pulse">
                {lang === 'ar' ? t.uploading || 'جاري الرفع...' : t.uploading || 'Uploading...'} {progress}%
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold px-12 py-6 rounded-2xl shadow-xl text-xl transition-all duration-300 w-full border-2 border-transparent hover:border-blue-200"
            >
              {uploading ? (lang === 'ar' ? '...جاري رفع الملفات' : 'Uploading...') : (lang === 'ar' ? t.uploadFiles || 'رفع الملفات' : t.uploadFiles || 'Upload Files')}
            </button>
          </div>
        </form>
        {/* أزرار جلب الملفات من الإنترنت وعرض الملفات خارج الفورم */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowCrawlModal(true);
              setCrawlFiles([]);
              setCrawlProgress(0);
              setCrawlError(null);
              setCrawlLoading(true);
              crawlAbortController.current = new AbortController();
              fetch('http://localhost:3001/api/crawl', { method: 'POST', signal: crawlAbortController.current.signal })
                .then(res => res.json())
                .then(data => {
                  setCrawlLoading(false);
                  if (data.success) {
                    setCrawlFiles(data.files || []);
                    setCrawlProgress(100);
                  } else {
                    setCrawlError(lang === 'ar' ? 'فشل جلب الملفات: ' : 'Failed to crawl files: ' + (data.error || ''));
                  }
                })
                .catch((err) => {
                  setCrawlLoading(false);
                  if (err.name === 'AbortError') return;
                  setCrawlError(lang === 'ar' ? 'تعذر الاتصال بخادم الجلب.' : 'Could not connect to crawling server.');
                });
              // محاكاة التقدم
              let progress = 0;
              const interval: NodeJS.Timeout = setInterval(() => {
                // لا تغلق الـ Modal أبداً هنا
                progress += Math.floor(Math.random() * 10) + 5;
                setCrawlProgress(p => (p < 90 ? Math.min(progress, 90) : p));
                if (progress >= 90 || !crawlLoading) clearInterval(interval);
              }, 700);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white px-12 py-6 rounded-2xl shadow-xl hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 font-bold text-xl tracking-wide w-full border-2 border-transparent hover:border-indigo-200"
          >
            <svg className="inline-block w-7 h-7 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {lang === 'ar' ? 'جلب ملفات من الإنترنت (كراولينج)' : 'Fetch from Internet (Crawling)'}
          </button>
          <button
            type="button"
            onClick={handlePreviewScrapedFiles}
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-12 py-6 rounded-2xl shadow-xl hover:from-purple-600 hover:to-pink-500 transition-all duration-300 font-bold text-xl tracking-wide w-full border-2 border-transparent hover:border-pink-200"
          >
            {lang === 'ar' ? 'عرض ملفات الإنترنت' : 'Show Internet Files'}
          </button>
        </div>
        {/* عرض الملفات المستخرجة إذا وجدت */}
        {scrapedFiles.length > 0 && (
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg p-6">
            <h4 className="text-lg font-bold mb-4 text-indigo-700 dark:text-indigo-200">{lang === 'ar' ? 'ملفات scraped-files:' : 'scraped-files:'}</h4>
            <ul className="space-y-2">
              {scrapedFiles.map((file, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-2 shadow-sm">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 7h.01" /></svg>
                  <a href={`/scraped-files/${file}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">{file}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- Modal component for crawling --- */}
      {showCrawlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 text-center">{lang === 'ar' ? 'جلب ملفات من الإنترنت' : 'Fetch from Internet (Crawling)'}</h2>
            {crawlError && <div className="mb-4 text-red-600 text-center font-semibold bg-red-50 rounded-lg py-2 shadow">{crawlError}</div>}
            <div className="mb-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
              {crawlFiles.length === 0 && <div className="text-gray-500 text-center">{lang === 'ar' ? 'جاري البحث عن الملفات...' : 'Fetching files...'}</div>}
              {crawlFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-2 shadow-sm">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 7h.01" /></svg>
                  <span>{file}</span>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-3 rounded-full transition-all duration-300 shadow" style={{ width: `${crawlProgress}%` }}></div>
              </div>
              <div className="text-center text-sm text-gray-600 mt-1">{lang === 'ar' ? 'نسبة التقدم:' : 'Progress:'} {crawlProgress}%</div>
            </div>
            <div className="flex gap-2 justify-center mt-6">
              <button onClick={() => { setShowCrawlModal(false); crawlAbortController.current?.abort(); }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-all">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={() => { setShowCrawlModal(false); setScrapedFiles(crawlFiles); }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-all">{lang === 'ar' ? 'موافق' : 'Accept'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;