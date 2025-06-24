// Web Crawler: Downloads PDF/Word files from a given URL and uploads to AWS S3
const axios = require('axios');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');
const path = require('path');

// Configure AWS SDK (use IAM user with S3 access or Lambda role)
AWS.config.update({ region: 'us-east-1' }); // عدل المنطقة حسب إعداداتك
const s3 = new AWS.S3();
const BUCKET_NAME = 'cloud-documents-bucket'; // عدل اسم البكت

// Helper: Download file as buffer
async function downloadFile(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
}

// Helper: Upload buffer to S3
async function uploadToS3(buffer, fileName, contentType) {
  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: `documents/crawled-${Date.now()}-${fileName}`,
    Body: buffer,
    ContentType: contentType,
  }).promise();
}

// Main: Crawl a page for PDF/DOC/DOCX links and upload them
async function crawlAndUpload(pageUrl) {
  const res = await axios.get(pageUrl);
  const $ = cheerio.load(res.data);
  const links = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && /\.(pdf|docx?)$/i.test(href)) {
      links.push(new URL(href, pageUrl).href);
    }
  });
  for (const fileUrl of links) {
    const ext = path.extname(fileUrl).toLowerCase();
    const fileName = path.basename(fileUrl);
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    if (ext === '.doc') contentType = 'application/msword';
    if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const buffer = await downloadFile(fileUrl);
    await uploadToS3(buffer, fileName, contentType);
    console.log(`Uploaded: ${fileName}`);
  }
  return links;
}

// Example usage: node crawler.js https://example.com
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node crawler.js <URL>');
    process.exit(1);
  }
  crawlAndUpload(url)
    .then(links => console.log('Done. Files:', links))
    .catch(err => console.error('Error:', err));
}

module.exports = { crawlAndUpload };
