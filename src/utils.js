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
    console.log(files);
    const blob = await downloadZip(files).blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${content.filename}-images.zip`;
    link.click();
    link.remove();
  }
};
