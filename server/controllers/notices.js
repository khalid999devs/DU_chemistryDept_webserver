const { notices } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');

const createNotice = async (req, res) => {
  let noticeData = req.body;
  if (!noticeData.title || !req?.file?.path) {
    throw new BadRequestError('You must provide a tite and the file!');
  }

  if (req?.file?.path) {
    noticeData.file = {
      url: req.file.path,
      serverFile: req.file,
    };
  }

  const notice = await notices.create(noticeData);

  res.json({
    succeed: true,
    msg: 'Notice created successfully',
    notice,
  });
};

const getAllnotices = async (req, res) => {
  const noticesObj = await notices.findAll({});

  res.json({
    succeed: true,
    msg: 'Successfully fetched notices',
    notices: noticesObj,
  });
};

const updateNotice = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  const targetNotice = await notices.findByPk(id);
  if (!targetNotice) throw new NotFoundError('Notice not found!');

  if (req?.file?.path) {
    data.file = {
      url: req.file.path,
      serverImg: req.file,
    };
    if (targetNotice?.file?.url) deleteFile(targetNotice.file.url);
  }

  await notices.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated notice!',
  });
};

const deleteNotice = async (req, res) => {
  const id = req.params.id;
  const targetNotice = await notices.findByPk(id);
  if (!targetNotice) {
    throw new BadRequestError('Invalid notice Id provided!');
  }

  if (targetNotice?.file?.url) {
    deleteFile(targetNotice.file.url);
  }

  await targetNotice.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted Notice!',
  });
};

module.exports = {
  createNotice,
  getAllnotices,
  updateNotice,
  deleteNotice,
};
