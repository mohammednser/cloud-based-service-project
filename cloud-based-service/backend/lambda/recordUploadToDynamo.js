const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });
const TABLE_NAME = 'UploadedFiles';

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { fileName, s3Key } = body;
    if (!fileName || !s3Key) throw new Error('fileName and s3Key are required');
    const now = new Date().toISOString();
    await dynamo.put({
      TableName: TABLE_NAME,
      Item: {
        id: `${s3Key}`,
        fileName,
        s3Key,
        uploadedAt: now
      }
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Recorded in DynamoDB' }),
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
