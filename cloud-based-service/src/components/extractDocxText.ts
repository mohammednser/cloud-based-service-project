import mammoth from 'mammoth';

export async function extractDocxTitleAndText(file: File): Promise<{ title: string; text: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  // العنوان: أول سطر غير فارغ أو اسم الملف
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const title = lines[0] || file.name;
  return { title, text: text.trim() };
}
