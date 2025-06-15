// تصنيف المستندات تلقائيًا بناءً على محتوى النص أو العنوان
// يمكن تطوير الخوارزمية لاحقًا لتكون أكثر ذكاءً (مثلاً باستخدام NLP أو API خارجي)

const categories = [
  { key: 'research', keywords: ['بحث', 'research', 'paper', 'دراسة', 'study'] },
  { key: 'invoice', keywords: ['فاتورة', 'invoice', 'bill', 'amount'] },
  { key: 'report', keywords: ['تقرير', 'report', 'summary', 'ملخص'] },
  { key: 'letter', keywords: ['خطاب', 'letter', 'correspondence'] },
  { key: 'contract', keywords: ['عقد', 'contract', 'اتفاقية', 'agreement'] },
  { key: 'other', keywords: [] },
];

export function classifyDocument(title: string, text: string): string {
  const content = `${title} ${text}`.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some((kw) => content.includes(kw))) {
      return cat.key;
    }
  }
  return 'other';
}

export const categoryLabels: Record<string, string> = {
  research: 'بحث علمي',
  invoice: 'فاتورة',
  report: 'تقرير',
  letter: 'خطاب',
  contract: 'عقد',
  other: 'أخرى',
};
