const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-north-1' });
const BUCKET_NAME = 'cloud-documents-499888193987';

exports.handler = async (event) => {
  try {
    const { fileKey } = event.queryStringParameters || {};
    if (!fileKey) throw new Error('fileKey is required');
    const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: fileKey }).promise();
    return {
      statusCode: 200,
      body: data.Body.toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': data.ContentType,
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
};
