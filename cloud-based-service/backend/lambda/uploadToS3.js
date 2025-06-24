const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-north-1' });

const BUCKET_NAME = 'cloud-documents-499888193987';

exports.handler = async (event) => {
  try {
    // إذا كان API Gateway Proxy: body عبارة عن base64
    const body = JSON.parse(event.body);
    const { fileName, fileContent, contentType } = body;

    const buffer = Buffer.from(fileContent, 'base64');
    // توليد s3Key ثابت لاستخدامه في DynamoDB
    const s3Key = `documents/${Date.now()}-${fileName}`;

    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully!', s3Key, fileName }),
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
