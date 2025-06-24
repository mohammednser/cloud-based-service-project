const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-north-1' });
const BUCKET_NAME = 'cloud-documents-499888193987';
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch {
    return '';
  }
}

async function extractTextFromDocx(buffer) {
  try {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } catch {
    return '';
  }
}

exports.handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body || '{}');
    if (!query) throw new Error('Query is required');
    const list = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: 'documents/' }).promise();
    const files = list.Contents || [];
    const results = [];
    for (const file of files) {
      const key = file.Key;
      if (!key.endsWith('.pdf') && !key.endsWith('.docx')) continue;
      const obj = await s3.getObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      let text = '';
      if (key.endsWith('.pdf')) text = await extractTextFromPDF(obj.Body);
      if (key.endsWith('.docx')) text = await extractTextFromDocx(obj.Body);
      if (text.toLowerCase().includes(query.toLowerCase())) {
        // إرجاع جزء من النص حول الكلمة المطلوبة
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        const context = text.substring(Math.max(0, idx - 40), idx + query.length + 40);
        results.push({ file: key, context });
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ results }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
};
