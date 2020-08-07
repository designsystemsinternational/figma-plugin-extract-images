const { downloadZip } = require('client-zip');
const FileType = require('file-type/browser');

const KEEP_STRUCTURE = false;

const files = [];
let filename = 'figma';
window.onmessage = async (event) => {
  const message = event.data.pluginMessage;
  if (!message) return;

  if (message.filename) {
    filename = message.filename;
  } else if (message.image) {
    const image = message.image;

    const path = KEEP_STRUCTURE ? `${image.path}/` : ``;
    const type = await FileType.fromBuffer(image.bytes);
    const filename = `${image.name}.${type.ext}`;

    files.push({
      name: path + filename,
      input: image.bytes,
      lastModified: Date.now(),
    });
  } else if (message.done) {
    if (files.length) {
      const blob = await downloadZip(files).blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-images.zip`;
      link.click();
      link.remove();
    }
    window.parent.postMessage({ pluginMessage: { close: true } }, '*');
  }
};
