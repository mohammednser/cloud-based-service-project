import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listDocuments } from '../graphql/queries';
import { DocumentType } from '../types';
import { useLanguage } from './LanguageContext';

const Sort: React.FC = () => {
  const { lang, t } = useLanguage();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [sortField, setSortField] = useState<'title' | 'category' | 'size'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await API.graphql(graphqlOperation(listDocuments));
      // @ts-ignore - response type is not properly inferred
      const fetchedDocuments = response.data.listDocuments.items;
      setDocuments(fetchedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(lang === 'ar' ? 'حدث خطأ أثناء جلب المستندات' : 'Error fetching documents');
    } finally {
      setIsLoading(false);
    }
  };

  const sortDocuments = (docs: DocumentType[]) => {
    return [...docs].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedDocuments = sortDocuments(documents);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 mt-10 transition-colors duration-300 border border-white/60 dark:border-gray-800/80 backdrop-blur-2xl flex flex-col gap-8">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-8 text-center tracking-tight drop-shadow-lg font-arabic">
          {lang === 'ar' ? 'تصنيف المستندات' : 'Sort Documents'}
        </h2>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-4 rounded-xl">
            <p className="text-red-700 font-arabic">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <div className="w-72 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2 mx-auto"></div>
            <div className="w-56 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2 mx-auto"></div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
              <div className="flex gap-4 items-center">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as 'title' | 'category' | 'size')}
                  className="rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-arabic text-base px-4 py-2"
                  dir="rtl"
                >
                  <option value="title">{lang === 'ar' ? 'العنوان' : 'Title'}</option>
                  <option value="category">{lang === 'ar' ? 'التصنيف' : 'Category'}</option>
                  <option value="size">{lang === 'ar' ? 'الحجم' : 'Size'}</option>
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-bold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-all font-arabic"
                  dir="rtl"
                >
                  {sortDirection === 'asc' 
                    ? (lang === 'ar' ? '↑ تصاعدي' : '↑ Ascending')
                    : (lang === 'ar' ? '↓ تنازلي' : '↓ Descending')}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-arabic">
                      {lang === 'ar' ? 'العنوان' : 'Title'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-arabic">
                      {lang === 'ar' ? 'التصنيف' : 'Category'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-arabic">
                      {lang === 'ar' ? 'الحجم' : 'Size'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-arabic">
                      {lang === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 dark:bg-gray-900/80 divide-y divide-gray-200 dark:divide-gray-800">
                  {sortedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 dark:text-gray-100 font-arabic">
                        {doc.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300 font-arabic">
                        {doc.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300 font-arabic">
                        {doc.size !== undefined ? Math.round(doc.size / 1024) : 0} {lang === 'ar' ? 'كيلوبايت' : 'KB'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400 font-arabic">
                        {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString(lang === 'ar' ? 'ar' : undefined) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedDocuments.length === 0 && (
              <p className="text-center text-gray-500 py-8 font-arabic text-lg">
                {lang === 'ar' ? 'لم يتم العثور على مستندات' : 'No documents found'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sort;