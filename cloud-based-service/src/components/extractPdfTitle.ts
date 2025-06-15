// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// استخدم CDN للـ worker
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.js`;

export async function extractPdfTitle(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
  const firstPage = await pdf.getPage(1);
  const textContent = await firstPage.getTextContent();
  const textItems = textContent.items.map((item: any) => item.str).filter(Boolean);
  // Try to get the first non-empty line as the title
  const title = textItems.find((line: string) => line.trim().length > 0) || file.name;
  return title.trim();
}

export async function extractPdfTitleAndText(file: File): Promise<{ title: string; text: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
  const firstPage = await pdf.getPage(1);
  const textContent = await firstPage.getTextContent();
  const textItems = textContent.items.map((item: any) => item.str).filter(Boolean);
  const title = textItems.find((line: string) => line.trim().length > 0) || file.name;

  // استخراج نص جميع الصفحات
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return { title: title.trim(), text: fullText.trim() };
}
