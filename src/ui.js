import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { downloadZipFile } from './utils';

const useContent = () => {
  const [filename, setFilename] = useState('figma');
  const [images, setImages] = useState([]);
  useEffect(() => {
    window.onmessage = async (event) => {
      const message = event.data.pluginMessage;
      if (!message) return;
      if (message.filename) {
        setFilename(message.filename);
      } else if (message.image) {
        setImages((images) => images.concat(message.image));
      } else if (message.done) {
      }
    };
  }, []);
  return { filename, images };
};

import css from './ui.css';

const UI = () => {
  const content = useContent();
  const [keepPath, setKeepPath] = useState(false);
  const onDownloadFile = async () => {
    await downloadZipFile(content, keepPath);
    window.parent.postMessage({ pluginMessage: { close: true } }, '*');
  };
  console.log(content);
  return (
    <div className={css.root}>
      <h2>Extract images</h2>
      <p>Found {content.images.length} images...</p>
      <button onClick={onDownloadFile}>Download Zip File</button>
      <div>
        <input
          id="keepPath"
          type="checkbox"
          checked={keepPath}
          onChange={() => setKeepPath(!keepPath)}
        />
        <label htmlFor="keepPath">Keep pages/groups as folders </label>
      </div>
    </div>
  );
};

ReactDOM.render(<UI />, document.getElementById('react-root'));
