import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

// Import components
import Upload from './components/Upload';
import Search from './components/Search';
import Sort from './components/Sort';
import Stats from './components/Stats';

// Configure Amplify
Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Home
                </Link>
                <Link
                  to="/upload"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Upload
                </Link>
                <Link
                  to="/search"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Search
                </Link>
                <Link
                  to="/sort"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Sort
                </Link>
                <Link
                  to="/stats"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Statistics
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={
                <div className="prose max-w-none">
                  <h1>Document Analysis System</h1>
                  <p>Welcome to the cloud-based document analysis system. This application allows you to:</p>
                  <ul>
                    <li>Upload PDF and Word documents</li>
                    <li>Search through document contents</li>
                    <li>Sort documents by title</li>
                    <li>View document statistics</li>
                  </ul>
                </div>
              } />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/sort" element={<Sort />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
