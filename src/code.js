figma.ui.onmessage = (message) => {
  if (message.close) {
    figma.closePlugin();
  }
};

figma.showUI(__html__, { visible: true });

const getAllImages = async () => {
  const allRectanglesWithImages = figma.root.findAll((node) => {
    return (
      node.type === 'RECTANGLE' &&
      node.fills.some((fill) => fill.type == 'IMAGE')
    );
  });

  const allImages = allRectanglesWithImages.reduce((acc, rect) => {
    let name = rect.name;

    return acc.concat(
      rect.fills.map((fill, i) => {
        const name = rect.name + (rect.fills.length == 1 ? '' : `-${i}`);
        return {
          name: uniqueName(acc, name),
          path: getPath(rect),
          hash: fill.imageHash,
        };
      })
    );
  }, []);

  figma.ui.postMessage({ filename: figma.root.name });
  for (let i = 0; i < allImages.length; i++) {
    const image = allImages[i];
    const data = figma.getImageByHash(image.hash);
    image.bytes = await data.getBytesAsync();
    figma.ui.postMessage({ image });
  }
  figma.ui.postMessage({ done: true });
};

// code utils
const uniqueName = (list, name, i = 1) => {
  const versioned = name + `-${i}`;
  if (list.includes((a) => a.name == name)) {
    if (list.includes((a) => a.name == versioned)) {
      return uniqueName(list, name, i + 1);
    } else {
      return versioned;
    }
  } else {
    return name;
  }
};
const TYPES = ['DOCUMENT', 'PAGE', 'FRAME'];
const getPath = (obj, path = []) => {
  if (obj.parent) {
    if (TYPES.includes(obj.parent.type)) {
      path.unshift(obj.parent.name);
    }

    return getPath(obj.parent, path);
  } else {
    return path.join('/');
  }
};

getAllImages();
