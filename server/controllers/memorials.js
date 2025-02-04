const { memorials } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');

const createMemorial = async (req, res) => {
  let memorialData = req.body;
  if (!req?.file?.path) {
    throw new BadRequestError('You must provide an image!');
  }
  const prevCount = await memorials.count();
  memorialData.serial = prevCount + 1;
  memorialData.batch = parseInt(memorialData.batch);

  if (req?.file?.path) {
    memorialData.image = {
      url: req.file.path,
      serverFile: req.file,
    };
  }

  const memorial = await memorials.create(memorialData);

  res.json({
    succeed: true,
    msg: 'Memorial created successfully',
    memorial,
  });
};

const getAllMemorials = async (req, res) => {
  const memorialsObj = await memorials.findAll({});

  res.json({
    succeed: true,
    msg: 'Successfully fetched memorials',
    memorials: memorialsObj,
  });
};

const updateMemorial = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  const targetMemorial = await memorials.findByPk(id);
  if (!targetMemorial) throw new NotFoundError('Memorial not found!');

  if (req?.file?.path) {
    data.image = {
      url: req.file.path,
      serverImg: req.file,
    };
    if (targetMemorial?.image?.url) deleteFile(targetMemorial.image.url);
  }

  await memorials.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated memorial!',
  });
};

const deleteMemorial = async (req, res) => {
  const id = req.params.id;
  const targetMemorial = await memorials.findByPk(id);
  if (!targetMemorial) {
    throw new BadRequestError('Invalid memorial Id provided!');
  }

  if (targetMemorial?.image?.url) {
    deleteFile(targetMemorial.image.url);
  }

  await targetMemorial.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted Memorial!',
  });
};

module.exports = {
  createMemorial,
  getAllMemorials,
  updateMemorial,
  deleteMemorial,
};
