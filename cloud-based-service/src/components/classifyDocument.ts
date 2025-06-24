// تصنيف المستندات تلقائيًا بناءً على محتوى النص أو العنوان
// يمكن تطوير الخوارزمية لاحقًا لتكون أكثر ذكاءً (مثلاً باستخدام NLP أو API خارجي)

// شجرة تصنيف متعددة المستويات
const categoryTree = [
  {
    key: 'science', label: 'علوم', keywords: ['علم', 'science', 'biology', 'physic', 'كيمياء', 'رياضيات'],
    children: [
      {
        key: 'computer_science', label: 'علوم الحاسوب', keywords: ['حاسوب', 'computer', 'machine learning', 'deep learning', 'ذكاء اصطناعي'],
        children: [
          { key: 'ai', label: 'ذكاء اصطناعي', keywords: ['ai', 'ذكاء اصطناعي', 'artificial intelligence'], children: [] },
          { key: 'networks', label: 'شبكات', keywords: ['network', 'شبكة'], children: [] },
        ]
      },
      {
        key: 'biology', label: 'أحياء', keywords: ['biology', 'أحياء'], children: []
      },
    ]
  },
  {
    key: 'business', label: 'أعمال', keywords: ['business', 'اقتصاد', 'management', 'إدارة'],
    children: [
      { key: 'finance', label: 'مالية', keywords: ['finance', 'مال', 'محاسبة'], children: [] },
      { key: 'marketing', label: 'تسويق', keywords: ['marketing', 'تسويق'], children: [] },
    ]
  },
  // ... أضف المزيد حسب الحاجة ...
];

function traverseTree(nodeList: any[], content: string, path: string[] = []): string {
  for (const node of nodeList) {
    if (node.keywords.some((kw: string) => content.includes(kw))) {
      if (node.children && node.children.length > 0) {
        const childResult = traverseTree(node.children, content, [...path, node.key]);
        if (childResult) return childResult;
      }
      return [...path, node.key].join(' > ');
    }
  }
  return '';
}

export function classifyDocument(title: string, text: string): string {
  const content = `${title} ${text}`.toLowerCase();
  // أولاً: التصنيف عبر الشجرة
  const treeResult = traverseTree(categoryTree, content);
  if (treeResult) return treeResult;
  // fallback: التصنيف البسيط القديم
  for (const cat of categories) {
    if ((cat.keywords as string[]).some((kw: string) => content.includes(kw))) {
      return cat.key;
    }
  }
  return 'other';
}

// التصنيف البسيط القديم (احتياطي)
const categories = [
  { key: 'research', keywords: ['بحث', 'research', 'paper', 'دراسة', 'study'] },
  { key: 'invoice', keywords: ['فاتورة', 'invoice', 'bill', 'amount'] },
  { key: 'report', keywords: ['تقرير', 'report', 'summary', 'ملخص'] },
  { key: 'letter', keywords: ['خطاب', 'letter', 'correspondence'] },
  { key: 'contract', keywords: ['عقد', 'contract', 'اتفاقية', 'agreement'] },
  { key: 'other', keywords: [] },
];

export const categoryLabels: Record<string, string> = {
  research: 'بحث علمي',
  invoice: 'فاتورة',
  report: 'تقرير',
  letter: 'خطاب',
  contract: 'عقد',
  other: 'أخرى',
  science: 'علوم',
  computer_science: 'علوم الحاسوب',
  ai: 'ذكاء اصطناعي',
  networks: 'شبكات',
  biology: 'أحياء',
  business: 'أعمال',
  finance: 'مالية',
  marketing: 'تسويق',
};
