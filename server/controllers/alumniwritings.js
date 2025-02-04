const { alumniwritings } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');

const createAlumniWriting = async (req, res) => {
  let writingData = req.body;

  if (!writingData.title) {
    throw new BadRequestError('You must provide a tite!');
  }

  writingData.value =
    writingData.title.slice(0, 20).split(' ')[0].toLowerCase() +
    `@${Date.now()}`;
  if (writingData.writerInfo)
    writingData.writerInfo = JSON.parse(writingData.writerInfo);

  if (req?.files?.length > 0) {
    writingData.images = req.files.map((file, key) => {
      return {
        id: `${key}@${Date.now()}`,
        url: file.path,
        serverFile: file,
      };
    });
  }

  const alumniwriting = await alumniwritings.create(writingData);

  res.json({
    succeed: true,
    msg: 'Writing created successfully',
    alumniwriting,
  });
};

const getAllAlumniWritings = async (req, res) => {
  const writingsObj = await alumniwritings.findAll({});

  res.json({
    succeed: true,
    msg: 'Successfully fetched alumni writings',
    alumniwritings: writingsObj,
  });
};

const getSingleAlumniWriting = async (req, res) => {
  const id = req.params.id;
  const singleWriting = await alumniwritings.findByPk(id);

  res.json({
    succeed: true,
    msg: 'Successfully fetched the Alumni writing',
    alumniwriting: singleWriting,
  });
};

const updateAlumniWriting = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  let targetWriting = await alumniwritings.findByPk(id);

  if (!targetWriting) throw new NotFoundError('Alumni writing not found!');

  if (req?.files?.length > 0) {
    if (data?.mode && data.mode === 'replaceImg') {
      if (data?.replaceImgId) {
        data.images = targetWriting.images.map((item) => {
          if (item.id === data.replaceImgId) {
            deleteFile(item.url);
            item.url = req.files[0].path;
            item.serverFile = req.files[0];
          }
          return item;
        });
      }
    } else {
      data.images = [
        ...targetWriting.images,
        ...req.files.map((file, key) => {
          return {
            id: `${key}@${Date.now()}`,
            url: file.path,
            serverFile: file,
          };
        }),
      ];
    }
  }

  if (targetWriting?.images.length > 0) {
    if (data?.mode && data.mode === 'deleteImg') {
      if (data?.deleteImgId) {
        const deleteUrl = targetWriting.images.find(
          (item) => item.id === data?.deleteImgId
        )?.url;
        if (deleteUrl) deleteFile(deleteUrl);

        data.images = targetWriting.images.filter(
          (item) => item.id !== data.deleteImgId
        );
      }
    } else if (data?.mode && data.mode === 'deleteAllImg') {
      targetWriting.images?.forEach((item) => {
        if (item.url) deleteFile(item.url);
      });
      data.images = [];
    }
  }
  if (data.writerInfo) data.writerInfo = JSON.parse(data.writerInfo);

  await alumniwritings.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated Alumni Writing!',
  });
};

const deleteAlumniWriting = async (req, res) => {
  const id = req.params.id;
  const targetWriting = await alumniwritings.findByPk(id);
  if (!targetWriting) {
    throw new BadRequestError('Invalid Writing Id provided!');
  }

  if (targetWriting?.images?.length > 0) {
    targetWriting.images.map((item) => {
      if (item.url) deleteFile(item.url);
    });
  }

  await targetWriting.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted the Alumni Writing!',
  });
};

module.exports = {
  createAlumniWriting,
  getAllAlumniWritings,
  getSingleAlumniWriting,
  updateAlumniWriting,
  deleteAlumniWriting,
};
