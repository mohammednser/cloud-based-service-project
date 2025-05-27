import React, { useState, useCallback } from 'react';
import { Storage } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { createDocument } from '../graphql/mutations';
import { DocumentType } from '../types';

const Upload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF or Word documents only.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload to S3
      const s3Key = `documents/${Date.now()}-${file.name}`;
      await Storage.put(s3Key, file, {
        contentType: file.type,
        progressCallback: (progress) => {
          setUploadProgress((progress.loaded / progress.total) * 100);
        },
      });

      // Create document metadata in DynamoDB
      const documentInput: Partial<DocumentType> = {
        fileName: file.name,
        title: file.name, // Will be updated by Lambda function
        text: '', // Will be updated by Lambda function
        size: file.size,
        category: 'uncategorized', // Will be updated by classification
        s3Key,
        classification: [],
      };

      await API.graphql(graphqlOperation(createDocument, { input: documentInput }));

      // Reset form
      event.target.value = '';
      setUploadProgress(0);
      alert('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select PDF or Word document
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
          </div>

          {isUploading && (
            <div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-primary-600">
                      Uploading...
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary-600">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Supported file types: PDF (.pdf), Word (.doc, .docx)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload; 