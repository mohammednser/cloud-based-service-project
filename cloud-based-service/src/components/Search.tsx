import React, { useState, useCallback } from 'react';
import { GraphQLAPI } from '@aws-amplify/api-graphql';
import { firstValueFrom } from 'rxjs';
import { debounce } from 'lodash';
import { searchDocuments } from '../graphql/queries';
import { DocumentType } from '../types';
import { useLanguage } from './LanguageContext';

const Search: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    try {
      // تمرير كل شيء داخل object واحد (GraphQLOptions)
      const observable = GraphQLAPI.graphql({
        query: searchDocuments,
        variables: { filter: term }
      }) as any;
      let response: any;
      if (typeof observable === 'object' && 'subscribe' in observable) {
        response = await firstValueFrom(observable);
      } else {
        response = await observable;
      }
      if (response?.data?.searchDocuments) {
        setDocuments(response.data.searchDocuments.items);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = debounce(handleSearch, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="max-w-4xl mx-auto" dir="auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 font-arabic">بحث المستندات</h2>

        {loading && (
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mb-4"></div>
              {/* Skeleton UI */}
              <div className="w-72 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <div className="w-56 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <div className="w-80 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <p className="text-indigo-500 font-semibold animate-pulse">{lang === 'ar' ? t.searching || 'جاري البحث...' : t.searching || 'Searching...'}</p>
            </div>
          </div>
        )}

        {!loading && documents.length === 0 && searchTerm && (
          <div className="text-center">
            <p className="text-gray-400 text-lg animate-pulse">{lang === 'ar' ? t.noResults || 'لا توجد نتائج' : t.noResults || 'No results found'}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 font-arabic"
            >
              مصطلح البحث
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="أدخل مصطلح البحث..."
                className="search-input input-primary font-arabic"
                dir="auto"
              />
            </div>
          </div>

          {!loading && documents.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium font-arabic">
                تم العثور على {documents.length} مستند
              </h3>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-50 p-4 rounded-lg space-y-2"
                >
                  <h4 className="font-medium font-arabic">{doc.title}</h4>
                  <p className="text-sm text-gray-600 font-arabic">
                    الفئة: {doc.category}
                  </p>
                  <div className="text-sm font-arabic">
                    {doc.text}
                  </div>
                  <div className="text-xs text-gray-500 font-arabic">
                    الملف: {doc.fileName} ({doc.size ? Math.round(doc.size / 1024) : 0} كيلوبايت)
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searchTerm && documents.length === 0 && (
            <p className="text-gray-500 font-arabic">لم يتم العثور على مستندات.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;