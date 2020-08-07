import React, { useState, useEffect } from 'react';

import { downloadZip } from 'client-zip';
import FileType from 'file-type/browser';

export const fileFromImage = async (image, keepPath) => {
  const path = keepPath ? `${image.path}/` : ``;

  const type = await FileType.fromBuffer(image.bytes);
  const filename = `${image.name}.${type.ext}`;

  return {
    name: path + filename,
    input: image.bytes,
    lastModified: Date.now(),
  };
};

export const downloadZipFile = async (content, keepPath) => {
  if (content.images && content.images.length) {
    const files = [];
    for (var i = 0; i < content.images.length; i++) {
      const img = content.images[i];
      files.push(await fileFromImage(img, keepPath));
    }

    const blob = await downloadZip(files).blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${content.filename} - images.zip`;
    link.click();
    link.remove();
  }
};

export const useContent = () => {
  const [filename, setFilename] = useState('figma');
  const [done, setDone] = useState(false);
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
        setDone(true);
      }
    };
  }, []);
  return { filename, images, done };
};
