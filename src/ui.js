import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  TypographyStyles,
  BaseStyles,
  PrimaryButton,
  Switch,
  Type12PosBold,
  Type12Pos,
} from 'figma-ui-components';

import { useContent, downloadZipFile } from './utils';

import css from './ui.css';

const UI = () => {
  const content = useContent();
  const [keepPath, setKeepPath] = useState(false);
  const onDownloadFile = async () => {
    await downloadZipFile(content, keepPath);
    window.parent.postMessage({ pluginMessage: { close: true } }, '*');
  };

  return (
    <div className={css.root}>
      <TypographyStyles />
      <BaseStyles />
      <div>
        <Type12PosBold>Extract images</Type12PosBold>
      </div>
      <div style={{ marginTop: 10 }}>
        {!content.done && <Type12Pos>Finding images...</Type12Pos>}
        <Type12Pos>{content.images.length} images found.</Type12Pos>
      </div>
      <div style={{ marginTop: 10 }}>
        <Switch
          name="Organize files by frames"
          checked={keepPath}
          onChange={() => setKeepPath(!keepPath)}
        />
      </div>
      <PrimaryButton disabled={!content.done} onClick={onDownloadFile}>
        Download Zip File
      </PrimaryButton>
    </div>
  );
};

ReactDOM.render(<UI />, document.getElementById('react-root'));
