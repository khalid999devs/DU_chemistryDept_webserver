const multer = require('multer');
const { existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const { BadRequestError } = require('../errors');

const sanitizeFilename = (name) => {
  return name.replace(/[\\/:*?"<>|]/g, '_');
};

//file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const validFields =
      /teachers|students|notices|memorials|writings|alumniwritings|evbanner|evgallery/;
    if (!file.fieldname) {
      return cb(null, true);
    }

    const isFieldValid = validFields.test(file.fieldname);

    if (!isFieldValid) {
      cb(new Error(`Field name didn't match`));
    }

    let titleStr = '';
    if (req?.body.fullName)
      titleStr = req.body?.fullName
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');
    else if (req?.body?.title)
      titleStr = req.body?.title
        .slice(0, 20)
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');
    else if (req?.body?.name)
      titleStr = req.body?.name
        .slice(0, 20)
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');

    let destName = resolve(__dirname, `../uploads/${file.fieldname}`);

    if (file.fieldname === 'memorials') {
      destName = resolve(
        __dirname,
        `../uploads/${file.fieldname}/${req.body?.batch || 'general'}`
      );
    } else if (
      file.fieldname === 'writings' ||
      file.fieldname === 'alumniwritings'
    ) {
      destName = resolve(
        __dirname,
        `../uploads/${file.fieldname}/${titleStr || 'general'}`
      );
    } else if (
      file.fieldname === 'evbanner' ||
      file.fieldname === 'evgallery'
    ) {
      destName = resolve(
        __dirname,
        `../uploads/events/${titleStr || 'general'}/${file.fieldname}`
      );
    }

    if (!existsSync(destName)) {
      try {
        mkdirSync(destName, { recursive: true });
      } catch (error) {
        console.log(error);
      }
    }

    let pathName = `uploads/${file.fieldname}`;
    if (file.fieldname === 'memorials') {
      pathName = `uploads/${file.fieldname}/${req.body?.batch || 'general'}`;
    } else if (
      file.fieldname === 'writings' ||
      file.fieldname === 'alumniwritings'
    ) {
      pathName = `uploads/${file.fieldname}/${titleStr || 'general'}`;
    } else if (
      file.fieldname === 'evbanner' ||
      file.fieldname === 'evgallery'
    ) {
      pathName = `uploads/events/${titleStr || 'general'}/${file.fieldname}`;
    }

    cb(null, pathName);
  },

  filename: (req, file, cb) => {
    let type, fileExt;
    // if (file.fieldname === 'farmers') {
    //   type = file.mimetype.split('/');
    //   fileExt = type[type.length - 1];
    // } else {
    type = file.originalname.split('.');
    fileExt = type[type.length - 1];
    // }
    let titleStr = '';
    if (req?.body.fullName)
      titleStr = req.body?.fullName
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');
    else if (req?.body?.title)
      titleStr = req.body?.title
        ?.slice(0, 20)
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');
    else if (req?.body?.name)
      titleStr = req.body?.name
        .slice(0, 20)
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-');

    let fileName = '';
    if (
      file.fieldname === 'teachers' ||
      file.fieldname === 'students' ||
      file.fieldname === 'notices' ||
      file.fieldname === 'memorials' ||
      file.fieldname === 'writings' ||
      file.fieldname === 'alumniwritings' ||
      file.fieldname === 'evbanner' ||
      file.fieldname === 'evgallery'
    ) {
      fileName =
        file.fieldname + '_' + sanitizeFilename(titleStr) + '@' + Date.now();
    } else {
      fileName = file.fieldname + `-${Date.now()}`;
    }
    cb(null, fileName + '.' + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf|webp|mp4|wav|mkv|x-matroska/;

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('only jpg,png,pdf,jpeg,webp,mp4,wav,mkv is allowed!'));
    }

    cb(new Error('there was an unknown error'));
  },
});

module.exports = upload;
