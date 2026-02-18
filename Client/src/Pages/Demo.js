import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import OneSignal from 'react-onesignal';

export default function Demo() {
  const [files, setFiles] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false); // Added loading state

  const handleSubscribe = async () => {
    try {
      // Ask permission
      await OneSignal.Notifications.requestPermission();

      if (Notification.permission === 'granted') {
        await OneSignal.User.PushSubscription.optIn();
        const playerId = OneSignal.User.PushSubscription.id;
        console.log('✅ Player ID:', playerId);
      } else {
        console.log('⚠️ Notification permission not granted');
      }
    } catch (err) {
      console.error('❌ Error subscribing for push:', err);
    }
  };

  useEffect(() => {
    const font = new FontFace(
      'Poppins',
      'url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.woff2)'
    );
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }, []);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const processImage = (image) => {
    return new Promise((resolve) => {
      const userImg = new Image();
      const templateImg = new Image();

      templateImg.src = '/6.png';
      templateImg.onload = () => {
        userImg.src = URL.createObjectURL(image);
        userImg.onload = () => {
          const T_WIDTH = templateImg.width;
          const T_HEIGHT = templateImg.height;

          const canvas = document.createElement('canvas');
          canvas.width = T_WIDTH;
          canvas.height = T_HEIGHT;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(templateImg, 0, 0, T_WIDTH, T_HEIGHT);

          const paddingLeftRight = T_WIDTH * 0.05;
          const paddingTop = T_HEIGHT * 0.3;
          const paddingBottom = T_HEIGHT * 0.05;

          const targetX = paddingLeftRight;
          const targetY = paddingTop;
          const targetW = T_WIDTH - paddingLeftRight * 2;
          const targetH = T_HEIGHT - paddingTop - paddingBottom;

          const imgRatio = userImg.width / userImg.height;
          const targetRatio = targetW / targetH;

          let drawWidth, drawHeight;

          if (imgRatio > targetRatio) {
            drawWidth = targetW;
            drawHeight = targetW / imgRatio;
          } else {
            drawHeight = targetH;
            drawWidth = targetH * imgRatio;
          }

          const offsetX = targetX + (targetW - drawWidth) / 2;
          const offsetY = targetY;

          ctx.drawImage(userImg, offsetX, offsetY, drawWidth, drawHeight);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(userImg.src);
              resolve(blob);
            },
            'image/jpeg',
            0.95
          );
        };
      };
    });
  };

  const downloadZip = async () => {
    if (!files.length) return alert('Select images first!');

    setIsDownloading(true); // Start loading

    try {
      const zip = new JSZip();

      for (const file of files) {
        const processed = await processImage(file);
        zip.file(`processed_${file.name}`, processed);
      }

      const zipFile = await zip.generateAsync({ type: 'blob' });
      saveAs(zipFile, 'processed_images.zip');
    } catch (error) {
      console.error('Download failed', error);
      alert('Something went wrong during the download.');
    } finally {
      setIsDownloading(false); // End loading
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Poppins, sans-serif' }}>
      <h2>Template Fit (No Crop + Margins)</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={isDownloading} // Disable input while processing
      />
      <p>{files.length} file(s) selected</p>
      <button onClick={handleSubscribe}>Subscribe</button>
      <button
        onClick={downloadZip}
        disabled={isDownloading || files.length === 0} // Disable button while processing
        style={{
          padding: '12px 24px',
          marginTop: 10,
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          backgroundColor: isDownloading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isDownloading ? 'Processing & Downloading...' : 'Download ZIP'}
      </button>

      {isDownloading && (
        <p style={{ color: '#007bff', marginTop: '10px' }}>
          Please wait, generating your files...
        </p>
      )}
    </div>
  );
}
