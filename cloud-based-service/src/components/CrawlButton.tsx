import React from "react";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1 className="text-4xl font-extrabold leading-tight mb-4">
        Welcome to the Web Crawler
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        This is a simple web crawler interface. Please enter the URL you want to
        crawl and click on the "Fetch" button.
      </p>
      {/* تم حذف مكون CrawlButton بناءً على طلب المستخدم */}
    </div>
  );
};

export default App;