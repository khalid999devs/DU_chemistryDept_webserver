const { teachers } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');

const createTeacher = async (req, res) => {
  let userData = req.user;

  if (req?.file?.path) {
    userData.image = {
      url: req.file.path,
      serverImg: req.file,
    };
  }
  if (userData.researchf) userData.researchf = JSON.parse(userData.researchf);
  if (userData.works) userData.works = JSON.parse(userData.works);

  if (req.mode === 'update') {
    await teachers.update(userData);
    return res.json({
      succeed: true,
      msg: 'Successfully updated!',
    });
  }
  const user = await teachers.create(userData);

  res.json({
    succeed: true,
    msg: 'teacher created successfully',
    user: user,
  });
};

const loginTeacher = async (req, res) => {
  const { phone } = req.body;

  let user = await teachers.findOne({ where: { phone } });
  if (!user) {
    throw new NotFoundError(
      'Teacher with this phone not found in the database!'
    );
  }
  res.json({
    succeed: true,
    msg: 'logged in',
    user,
  });
};

const getTeacher = async (req, res) => {
  const userId = req.params.id;

  const userInfo = await teachers.findOne({
    where: { id: userId },
  });
  if (!userInfo) {
    throw new UnauthorizedError('You are not authorized!');
  }

  res.json({
    succeed: true,
    msg: 'Successfully got Teacher!',
    user: userInfo,
  });
};

const getAllTeachers = async (req, res) => {
  const teachersObj = await teachers.findAll({});

  res.json({
    succeed: true,
    msg: "Successfully fetched teachers' data!",
    teachers: teachersObj,
  });
};

const updateTeacher = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  const targetTeacher = await teachers.findByPk(id);
  if (!targetTeacher) throw new NotFoundError('Teacher not found!');

  if (req?.file?.path) {
    data.image = {
      url: req.file.path,
      serverImg: req.file,
    };
    if (targetTeacher?.image?.url) deleteFile(targetTeacher.image.url);
  }
  if (data.researchf) data.researchf = JSON.parse(data.researchf);
  if (data.works) data.works = JSON.parse(data.works);

  await teachers.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated',
  });
};

const deleteTeacher = async (req, res) => {
  const id = req.params.id;
  const targetTeacher = await teachers.findByPk(id);
  if (!targetTeacher) {
    throw new BadRequestError('Invalid Teacher Id provided!');
  }

  if (targetTeacher?.image?.url) {
    deleteFile(targetTeacher.image.url);
  }

  await targetTeacher.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted teacher!',
  });
};

module.exports = {
  createTeacher,
  loginTeacher,
  getTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
};
