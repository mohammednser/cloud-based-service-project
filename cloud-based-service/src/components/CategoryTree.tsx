import React from 'react';

const categoryTree = [
  {
    key: 'science', label: 'علوم', children: [
      {
        key: 'computer_science', label: 'علوم الحاسوب', children: [
          { key: 'ai', label: 'ذكاء اصطناعي', children: [] },
          { key: 'networks', label: 'شبكات', children: [] },
        ]
      },
      { key: 'biology', label: 'أحياء', children: [] },
    ]
  },
  {
    key: 'business', label: 'أعمال', children: [
      { key: 'finance', label: 'مالية', children: [] },
      { key: 'marketing', label: 'تسويق', children: [] },
    ]
  },
];

function renderTree(nodes: any[], level = 0) {
  return (
    <ul style={{ marginLeft: level * 20 }}>
      {nodes.map((node) => (
        <li key={node.key} style={{ fontWeight: level === 0 ? 'bold' : 'normal', color: level === 0 ? '#3b82f6' : level === 1 ? '#10b981' : '#f59e42' }}>
          {node.label}
          {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );
}

const CategoryTree: React.FC = () => (
  <div className="max-w-xl mx-auto py-10 px-4">
    <h2 className="text-2xl font-bold mb-6">شجرة التصنيفات</h2>
    {renderTree(categoryTree)}
  </div>
);

export default CategoryTree;
