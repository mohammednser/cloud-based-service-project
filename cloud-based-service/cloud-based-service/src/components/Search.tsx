import React, { useState, useCallback } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { searchDocuments } from '../graphql/queries';
import { DocumentType } from '../types';
import { debounce } from 'lodash';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DocumentType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        const response = await API.graphql(
          graphqlOperation(searchDocuments, { query })
        );

        // @ts-ignore - response type is not properly inferred
        const documents = response.data.searchDocuments;
        setResults(documents);
      } catch (err) {
        console.error('Error searching documents:', err);
        setError('Error searching documents. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Search Documents</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search term
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Enter search term..."
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {isSearching && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">
                Found {results.length} document(s)
              </h3>
              {results.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-50 p-4 rounded-lg space-y-2"
                >
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-600">
                    Category: {doc.category}
                  </p>
                  <div className="text-sm">
                    {highlightText(
                      doc.text.substring(0, 200) + '...',
                      searchTerm
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    File: {doc.fileName} ({Math.round(doc.size / 1024)} KB)
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchTerm && results.length === 0 && (
            <p className="text-gray-500">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search; 