import React, { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { debounce } from 'lodash';
import { searchDocuments } from '../graphql/queries';
import { DocumentType } from '../types';
import { useLanguage } from './LanguageContext';

const client = generateClient();

const Search: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  // قياس زمن البحث
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
      setDocuments([]);
      setSearchTime(null);
      return;
    }

    setLoading(true);
    const start = performance.now();
    try {
      const response = await client.graphql({
        query: searchDocuments,
        variables: { filter: term }
      });
      if ('data' in response && response.data && response.data.searchDocuments) {
        setDocuments(response.data.searchDocuments.items);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setLoading(false);
      const end = performance.now();
      setSearchTime(end - start);
    }
  }, []);

  const debouncedSearch = debounce(handleSearch, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // تظليل النص المطابق في نتائج البحث
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 mt-10 transition-colors duration-300 border border-white/60 dark:border-gray-800/80 backdrop-blur-2xl flex flex-col gap-8">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-8 text-center tracking-tight drop-shadow-lg font-arabic">
          {lang === 'ar' ? 'بحث المستندات' : 'Search Documents'}
        </h2>

        {loading && (
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="w-72 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <div className="w-56 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <div className="w-80 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <p className="text-indigo-500 font-semibold animate-pulse font-arabic">{lang === 'ar' ? t.searching || 'جاري البحث...' : t.searching || 'Searching...'}</p>
            </div>
          </div>
        )}

        {!loading && documents.length === 0 && searchTerm && (
          <div className="text-center">
            <p className="text-gray-400 text-lg animate-pulse font-arabic">{lang === 'ar' ? t.noResults || 'لا توجد نتائج' : t.noResults || 'No results found'}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="search"
              className="block text-base font-semibold text-gray-700 font-arabic mb-2"
            >
              {lang === 'ar' ? 'مصطلح البحث' : 'Search term'}
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={lang === 'ar' ? 'أدخل مصطلح البحث...' : 'Enter search term...'}
                className="search-input input-primary font-arabic text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                dir="auto"
              />
            </div>
          </div>

          {searchTime !== null && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              {lang === 'ar' ? 'زمن البحث:' : 'Search time:'} {searchTime.toFixed(2)} ms
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-arabic text-indigo-700 dark:text-indigo-300 mb-4">
                {lang === 'ar' ? `تم العثور على ${documents.length} مستند` : `Found ${documents.length} document(s)`}
              </h3>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
                >
                  <h4 className="font-medium">{doc.title}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {highlightText(doc.text.substring(0, 200) + '...', searchTerm)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    File: {doc.fileName} ({Math.round((doc.size || 0) / 1024)} KB)
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searchTerm && documents.length === 0 && (
            <p className="text-gray-500 font-arabic">{lang === 'ar' ? 'لم يتم العثور على مستندات.' : 'No documents found.'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;