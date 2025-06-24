const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-north-1' });
const BUCKET_NAME = 'cloud-documents-499888193987';

exports.handler = async () => {
  try {
    const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: 'documents/' }).promise();
    const files = (data.Contents || []);
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, obj) => sum + (obj.Size || 0), 0);
    return {
      statusCode: 200,
      body: JSON.stringify({ totalFiles, totalSize }),
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
