# Extract images

#### A Figma Plugin to find all images in a file and extract the originals to a zip file.

This plugin scans a document for images, and extracts them to a zip file for download.

This is useful when you need to use a document' images outside of figma and it's not easy or possible to find the source files.

I have used it to collect moodboard images, or gather the assets for a website.

## How to use

The plugin will allow you to choose the current page, the whole document or the current selection. 

Once you have found the images you can click save to get them in a zip file.

## Development

After cloning the repo, run `npm install`.

Then, to compile run `npm run dev`

To link this plugin to Figma go to Menu > Plugins > Development > New Plugin... and choose **Link existing plugin** / _Click to choose a manifest.json file_ and find this folder's `manifest.json`
