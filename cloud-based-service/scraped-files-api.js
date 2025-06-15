// API بسيط لعرض ملفات scraped-files عبر HTTP
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;
const SCRAPED_DIR = path.join(__dirname, 'public', 'scraped-files');

app.use(cors());

app.get('/api/scraped-files', (req, res) => {
  fs.readdir(SCRAPED_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }
    // فقط ملفات PDF وWord
    const filtered = files.filter(f => /\.(pdf|docx?)$/i.test(f));
    res.json(filtered);
  });
});

// Endpoint لتشغيل الكراولر
app.post('/api/crawl', (req, res) => {
  // شغل السكريبت كعملية منفصلة
  exec('node ./src/pdf_word_scraper.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Crawler error:', error);
      return res.status(500).json({ success: false, message: 'Crawler failed', error: error.message });
    }
    if (stderr) {
      console.error('Crawler stderr:', stderr);
    }
    // بعد انتهاء الزحف، أعد قراءة الملفات وأرسلها مباشرة
    fs.readdir(SCRAPED_DIR, (err, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Crawled but failed to read directory', error: err.message });
      }
      const filtered = files.filter(f => /\.(pdf|docx?)$/i.test(f));
      res.json({ success: true, message: 'Crawling started', output: stdout, files: filtered });
    });
  });
});

// Endpoint لحذف ملف من scraped-files
app.delete('/api/scraped-files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(SCRAPED_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete file', error: err.message });
    }
    res.json({ success: true, message: 'File deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`scraped-files API running on http://localhost:${PORT}/api/scraped-files`);
});
