// run-crawler.js
// API endpoint to run the pdf_word_scraper.js script from the frontend
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());

app.post('/run-crawler', (req, res) => {
  const scriptPath = path.join(__dirname, 'src', 'pdf_word_scraper.js');
  exec(`node "${scriptPath}"`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message, stderr });
    }
    res.json({ success: true, stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Crawler API listening on port ${PORT}`);
});
