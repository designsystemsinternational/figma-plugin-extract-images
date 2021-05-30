import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  TypographyStyles,
  BaseStyles,
  SecondaryButton,
  PrimaryButton,
  Switch,
  SelectMenu,
  SelectMenuItem,
  Type12PosBold,
  Type12Pos,
  Type11Pos,
} from 'figma-ui-components';

import { useContent, downloadZipFile } from './utils';

import css from './ui.css';

const MODES = ['Selection', 'Page', 'Everything'];

const UI = () => {
  const content = useContent();

  const [modeOpen, setModeOpen] = useState(false);
  const [keepPath, setKeepPath] = useState(false);

  const onStartFindingImages = () => {
    window.parent.postMessage(
      { pluginMessage: { start: true, mode: content.mode } },
      '*'
    );
  };

  const onDownloadFile = async () => {
    await downloadZipFile(content, keepPath);
    // window.parent.postMessage({ pluginMessage: { close: true } }, '*');
  };

  const onModeSelectClick = (e) => {
    setModeOpen((o) => !o);
  };

  return (
    <div className={css.root}>
      <TypographyStyles />
      <BaseStyles />
      <Type12Pos>
        Find all images in a selection and extract the source files into a zip
        folder.
      </Type12Pos>

      <Type12PosBold className={css.title}>Find</Type12PosBold>

      <div className={css.row}>
        <div onClick={onModeSelectClick} style={{ minWidth: 135 }}>
          <SelectMenu label={`Context: ${content.mode}`} isActive={modeOpen}>
            {MODES.map((opt, i) => (
              <SelectMenuItem
                onClick={() => content.setMode(opt)}
                key={`opt-${opt}-${i}`}
                text={opt}
                isActive={opt === content.mode}
              />
            ))}
          </SelectMenu>
        </div>
        <SecondaryButton
          disabled={content.running}
          onClick={onStartFindingImages}>
          Find Images
        </SecondaryButton>
      </div>
      <div style={{ marginTop: 20 }} />
      <div className={css.row}>
        <div style={{ marginRight: 10 }}>
          <Type12Pos>{content.images.length} images found.</Type12Pos>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {content.status && <Type12Pos>{content.status}</Type12Pos>}
      </div>

      <div>
        <div>
          <Type12PosBold className={css.title}>Extract and save</Type12PosBold>
        </div>

        <Switch
          name="Organize files by frame"
          checked={keepPath}
          onChange={() => setKeepPath(!keepPath)}
        />
        <Type11Pos style={{ marginLeft: 48 }}>
          {keepPath
            ? 'Files will be organized in folders by path.'
            : 'Files will be placed in a single folder.'}
        </Type11Pos>
      </div>
      <div style={{ marginTop: 10 }}>
        <PrimaryButton disabled={!content.done} onClick={onDownloadFile}>
          Download Zip File
        </PrimaryButton>
        <div style={{ marginTop: 10 }} />
      </div>
    </div>
  );
};

ReactDOM.render(<UI />, document.getElementById('react-root'));
