import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listDocuments } from '../graphql/queries';
import { DocumentType } from '../types';
import { useLanguage } from './LanguageContext';
import { categoryLabels } from './classifyDocument';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const client = generateClient();

interface Stats {
  totalDocuments: number;
  totalSize: number;
  averageSize: number;
  categoryCounts: Record<string, number>;
  languageCounts: Record<string, number>;
}

const Stats: React.FC = () => {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalDocuments: 0,
    totalSize: 0,
    averageSize: 0,
    categoryCounts: {},
    languageCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await client.graphql({
        query: listDocuments,
      });
      if ('data' in response && response.data && response.data.listDocuments) {
        const documents: DocumentType[] = response.data.listDocuments.items;
        
        // Calculate statistics
        const newStats = {
          totalDocuments: documents.length,
          totalSize: documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
          averageSize: 0,
          categoryCounts: {} as Record<string, number>,
          languageCounts: {} as Record<string, number>,
        };

        // Calculate average size
        newStats.averageSize = newStats.totalDocuments > 0 
          ? newStats.totalSize / newStats.totalDocuments 
          : 0;

        // Count documents by category and language
        documents.forEach(doc => {
          if (doc.category) {
            newStats.categoryCounts[doc.category] = (newStats.categoryCounts[doc.category] || 0) + 1;
          }
          if (doc.language) {
            newStats.languageCounts[doc.language] = (newStats.languageCounts[doc.language] || 0) + 1;
          }
        });

        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('حدث خطأ في جلب الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  // إعداد بيانات الرسم البياني
  const categoryPieData = {
    labels: Object.keys(stats.categoryCounts).map((cat) => categoryLabels[cat] || cat),
    datasets: [
      {
        data: Object.values(stats.categoryCounts),
        backgroundColor: [
          '#6366f1', '#f59e42', '#10b981', '#f43f5e', '#3b82f6', '#a3a3a3', '#fbbf24', '#14b8a6'
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mb-4"></div>
          {/* Skeleton UI */}
          <div className="w-64 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="w-40 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="w-80 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="w-56 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <p className="text-gray-600 animate-pulse">{lang === 'ar' ? t.loadingStats || 'جاري تحميل الإحصائيات...' : t.loadingStats || 'Loading statistics...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Statistics */}
        <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-3xl shadow-xl border border-indigo-100 dark:border-gray-800 flex flex-col gap-3 backdrop-blur-xl transition-all duration-300" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mb-4">{lang === 'ar' ? t.generalStats || 'إحصائيات عامة' : t.generalStats || 'General Statistics'}</h3>
          <div className="space-y-3 text-lg">
            <p>
              <span className="text-gray-600 dark:text-gray-300">{lang === 'ar' ? t.totalDocs || 'إجمالي المستندات:' : t.totalDocs || 'Total Documents:'}</span>{' '}
              <span className="font-bold text-indigo-700 dark:text-indigo-200">{stats.totalDocuments}</span>
            </p>
            <p>
              <span className="text-gray-600 dark:text-gray-300">{lang === 'ar' ? t.totalSize || 'إجمالي الحجم:' : t.totalSize || 'Total Size:'}</span>{' '}
              <span className="font-bold text-indigo-700 dark:text-indigo-200">{Math.round(stats.totalSize / 1024)} KB</span>
            </p>
            <p>
              <span className="text-gray-600 dark:text-gray-300">{lang === 'ar' ? t.avgSize || 'متوسط حجم المستند:' : t.avgSize || 'Average Document Size:'}</span>{' '}
              <span className="font-bold text-indigo-700 dark:text-indigo-200">{Math.round(stats.averageSize / 1024)} KB</span>
            </p>
            <p>
              <span className="text-gray-600 dark:text-gray-300">{lang === 'ar' ? 'آخر تحديث:' : 'Last updated:'}</span>{' '}
              <span className="font-bold text-indigo-700 dark:text-indigo-200">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
            </p>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-3xl shadow-xl border border-indigo-100 dark:border-gray-800 flex flex-col gap-6 backdrop-blur-xl transition-all duration-300" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mb-4">{lang === 'ar' ? t.categoryDist || 'التوزيع حسب التصنيف' : t.categoryDist || 'Category Distribution'}</h3>
          {Object.entries(stats.categoryCounts).length > 0 ? (
            <>
              <div className="w-full flex justify-center mb-4">
                <div className="w-64 h-64">
                  <Pie data={categoryPieData} options={{ plugins: { legend: { position: lang === 'ar' ? 'left' : 'right', labels: { font: { size: 16 } } } } }} />
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(stats.categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center text-lg">
                    <span className="text-gray-600 dark:text-gray-300">
                      {categoryLabels[category] || category}
                    </span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-200">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 animate-pulse">{lang === 'ar' ? t.noCategories || 'لا توجد تصنيفات' : t.noCategories || 'No categories'}</p>
          )}
        </div>

        {/* Language Distribution */}
        <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-3xl shadow-xl border border-indigo-100 dark:border-gray-800 flex flex-col gap-3 md:col-span-2 backdrop-blur-xl transition-all duration-300" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mb-4">{lang === 'ar' ? t.languageDist || 'التوزيع حسب اللغة' : t.languageDist || 'Language Distribution'}</h3>
          {Object.entries(stats.languageCounts).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.languageCounts).map(([language, count]) => (
                <div key={language} className="flex justify-between items-center text-lg">
                  <span className="text-gray-600 dark:text-gray-300">{language}</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-200">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 animate-pulse">{lang === 'ar' ? t.noLangData || 'لا توجد بيانات لغة' : t.noLangData || 'No language data'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;