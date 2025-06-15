import React, { useState, useCallback, ChangeEvent } from 'react';
import { Storage } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { createDocument } from './graphql/mutations';
import type { DocumentType } from './types';

interface FileUploadState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  showCrawlModal: boolean;
  crawlProgress: number;
  crawlingFiles: string[];
  abortController: AbortController | null;
}

const Upload: React.FC = () => {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null,
    showCrawlModal: false,
    crawlProgress: 0,
    crawlingFiles: [],
    abortController: null
  });

  const updateState = (updates: Partial<FileUploadState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleFileSelect = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    // Create new abort controller for this crawl operation
    const abortController = new AbortController();
    updateState({ 
      showCrawlModal: true, 
      crawlProgress: 0,
      crawlingFiles: [],
      abortController,
      error: null 
    });

    try {
      const files = Array.from(event.target.files);
      const totalFiles = files.length;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if operation was aborted
        if (abortController.signal.aborted) {
          updateState({ 
            showCrawlModal: false,
            error: 'File crawling was cancelled'
          });
          return;
        }

        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
          continue; // Skip invalid files
        }

        // Update progress
        updateState({
          crawlProgress: Math.round(((i + 1) / totalFiles) * 100),
          crawlingFiles: [...state.crawlingFiles, file.name]
        });

        // Upload to S3
        const s3Key = `documents/${Date.now()}-${file.name}`;
        await Storage.put(s3Key, file, {
          contentType: file.type,
          progressCallback: (progress) => {
            updateState({
              uploadProgress: (progress.loaded / progress.total) * 100
            });
          },
        });

        // Create document metadata in DynamoDB
        const documentInput: Partial<DocumentType> = {
          fileName: file.name,
          title: file.name,
          text: '',
          size: file.size,
          category: 'uncategorized',
          s3Key,
          classification: [],
        };

        await API.graphql(graphqlOperation(createDocument, { input: documentInput }));
      }

      // Reset form and show success
      event.target.value = '';
      updateState({
        showCrawlModal: false,
        crawlProgress: 0,
        crawlingFiles: [],
        uploadProgress: 0,
        abortController: null
      });
      
    } catch (err) {
      console.error('Error uploading files:', err);
      updateState({
        error: 'Error uploading files. Please try again.',
        showCrawlModal: false,
        crawlProgress: 0,
        crawlingFiles: [],
        abortController: null
      });
    }
  }, [state.crawlingFiles]);

  const handleCancelCrawl = () => {
    if (state.abortController) {
      state.abortController.abort();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
        
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{state.error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select a directory to crawl
            </label>
            <div className="mt-1">
              <input
                type="file"
                webkitdirectory
                onChange={handleFileSelect}
                disabled={state.isUploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
          </div>

          {state.showCrawlModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Crawling Files</h3>
                  <button
                    onClick={handleCancelCrawl}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{state.crawlProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-primary-500 rounded transition-all duration-300" 
                        style={{ width: `${state.crawlProgress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Files Found: {state.crawlingFiles.length}</h4>
                    <div className="max-h-40 overflow-y-auto">
                      <ul className="space-y-1">
                        {state.crawlingFiles.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
