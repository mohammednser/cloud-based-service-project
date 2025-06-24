import React, { useEffect, useState } from 'react';

const LAMBDA_LIST_URL = 'https://fg9nays5v9.execute-api.eu-north-1.amazonaws.com/default/listFilesFromS3';
const LAMBDA_GET_URL = 'https://fg9nays5v9.execute-api.eu-north-1.amazonaws.com/default/getFileFromS3';

const FilesList: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(LAMBDA_LIST_URL);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError('تعذر جلب الملفات');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileKey: string) => {
    setSelectedFile(fileKey);
    setDownloadUrl(null);
    try {
      const res = await fetch(`${LAMBDA_GET_URL}?fileKey=${encodeURIComponent(fileKey)}`);
      const data = await res.text();
      // نفترض أن الملف base64
      const ext = fileKey.endsWith('.pdf') ? 'pdf' : fileKey.endsWith('.docx') ? 'docx' : '';
      const url = `data:application/${ext};base64,${data}`;
      setDownloadUrl(url);
      // فتح الملف في نافذة جديدة
      window.open(url, '_blank');
    } catch (err) {
      setError('تعذر تحميل الملف');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">قائمة الملفات</h2>
      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {files.map((file, idx) => (
          <li key={idx} className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-2 shadow-sm">
            <span>{file}</span>
            <button
              className="ml-auto px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-xs font-bold"
              onClick={() => handleDownload(file)}
            >
              تحميل / معاينة
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilesList;
