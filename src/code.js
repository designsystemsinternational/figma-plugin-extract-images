const TYPES = ['DOCUMENT', 'PAGE', 'FRAME'];

figma.showUI(__html__, { visible: true, height: 300 });

const nodeHasImages = (node) =>
  node.type === 'RECTANGLE' && node.fills.some((fill) => fill.type == 'IMAGE');

const getAllImages = async (mode) => {
  figma.ui.postMessage({ start: true });
  figma.ui.postMessage({ filename: figma.root.name });
  figma.ui.postMessage({ status: 'Finding images...' });

  let root;
  if (mode === 'Everything') {
    root = figma.root;
  } else if (mode === 'Selection') {
    root = figma.currentPage.selection;
  } else {
    // Default: Current Page
    root = figma.currentPage;
  }

  let allRectanglesWithImages = [];
  if (Array.isArray(root)) {
    for (const node of root) {
      if (node.findAll) {
        allRectanglesWithImages = allRectanglesWithImages.concat(
          node.findAll(nodeHasImages)
        );
      } else if (nodeHasImages(node)) {
        allRectanglesWithImages.push(node);
      }
    }
  } else {
    allRectanglesWithImages = allRectanglesWithImages.concat(
      root.findAll(nodeHasImages)
    );
  }
  const allImages = allRectanglesWithImages.reduce((acc, rect) => {
    figma.ui.postMessage({ status: `Found ${acc.lenght} images...` });
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

  const images = [];
  for (let i = 0; i < allImages.length; i++) {
    figma.ui.postMessage({
      status: `Processing ${images.length} of ${allImages.lenght} images...`,
    });
    const image = allImages[i];
    const data = figma.getImageByHash(image.hash);
    image.bytes = await data.getBytesAsync();
    images.push(image);
  }
  figma.ui.postMessage({ done: true, images });
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

figma.ui.onmessage = (message) => {
  if (message.close) {
    figma.closePlugin();
  }
  if (message.start) {
    getAllImages(message.mode);
  }
};

const checkSelection = () => {
  figma.ui.postMessage({
    selection: true,
    selected: figma.currentPage.selection.length,
  });
};
checkSelection();
figma.on('selectionchange', checkSelection);
