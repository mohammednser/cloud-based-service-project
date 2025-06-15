// سكريبت Node.js لجلب ملفات PDF من arXiv عبر زيارة صفحات التفاصيل
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const PAGE_URL = 'https://arxiv.org/list/cs.AI/recent';
const DOWNLOAD_DIR = path.join(__dirname, '../public/scraped-files');

async function scrapeAndDownload() {
  await fs.ensureDir(DOWNLOAD_DIR);
  const { data: html } = await axios.get(PAGE_URL);
  const $ = cheerio.load(html);
  const detailLinks = [];

  // اجمع روابط صفحات التفاصيل لكل بحث
  $('dt a[title="Abstract"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      const absUrl = href.startsWith('http') ? href : new URL(href, PAGE_URL).href;
      detailLinks.push(absUrl);
    }
  });

  console.log(`Found ${detailLinks.length} detail pages. Fetching PDFs...`);

  let pdfCount = 0;
  for (const detailUrl of detailLinks) {
    try {
      const { data: detailHtml } = await axios.get(detailUrl);
      const $detail = cheerio.load(detailHtml);
      // ابحث عن رابط PDF في صفحة التفاصيل (أي رابط يحتوي على /pdf/)
      let pdfLink = $detail('a[href*="/pdf/"]').attr('href');
      if (pdfLink) {
        // بعض الروابط قد تكون مختصرة (بدون .pdf)، أضف .pdf إذا لم تكن موجودة
        if (!pdfLink.endsWith('.pdf')) pdfLink += '.pdf';
        const fullPdfUrl = pdfLink.startsWith('http') ? pdfLink : new URL(pdfLink, 'https://arxiv.org').href;
        console.log('Trying PDF:', fullPdfUrl); // طباعة الرابط
        const fileName = path.basename(fullPdfUrl.split('?')[0]);
        const filePath = path.join(DOWNLOAD_DIR, fileName);
        try {
          const response = await axios.get(fullPdfUrl, { responseType: 'stream' });
          await new Promise((resolve, reject) => {
            const stream = response.data.pipe(fs.createWriteStream(filePath));
            stream.on('finish', resolve);
            stream.on('error', reject);
          });
          pdfCount++;
          console.log(`Downloaded: ${fileName}`);
        } catch (err) {
          console.error(`Failed to download PDF ${fullPdfUrl}:`, err.message);
        }
      } else {
        console.log('No PDF link found in:', detailUrl);
      }
    } catch (err) {
      console.error(`Failed to process ${detailUrl}:`, err.message);
    }
  }

  console.log(`Download complete. Total PDFs: ${pdfCount}`);
}

scrapeAndDownload();
