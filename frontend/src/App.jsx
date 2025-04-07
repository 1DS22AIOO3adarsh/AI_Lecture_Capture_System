import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.message) {
        setStatus({
          message: `Success: ${data.message} (${data.filename})`,
          type: 'success',
        });
      } else {
        setStatus({ message: 'Upload failed', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'Upload error', type: 'error' });
      console.error(error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <main className="app-container">
      <section className="content-wrapper">
        <h1 className="app-title">Lecture Video Uploader</h1>
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 16V6m0 10 4-4m-4 4-4-4m9-8h-2.586a1 1 0 0 0-.707.293l-5.414 5.414a1 1 0 0 0 0 1.414l5.414 5.414a1 1 0 0 0 .707.293H21a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" />
            </svg>
          </div>
          <p className="drop-zone-text">
            {isDragging
              ? 'Release to Upload'
              : 'Drag & drop your video here or click to browse'}
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="status-bar">
          {status && (
            <div className={`status ${status.type}`}>
              {status.message}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
