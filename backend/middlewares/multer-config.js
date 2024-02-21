const multer = require('multer')
const SharpMulter = require('sharp-multer')

const newFilenameFunction = (og_filename, options) => {
  const newname = og_filename.replace(/\.(jpg|jpeg|png)$/, '').split(' ').join('_') + Date.now() + '.' + options.fileFormat;
  return newname;
};

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, 'images'),
  imageOptions: {
    fileFormat: 'webp',
    quality: 80,
    resize: { width: 500, height: null }
  },
  filename: newFilenameFunction,
})

module.exports = multer({ storage: storage }).single('image')