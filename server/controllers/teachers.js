const { teachers } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');

const createTeacher = async (req, res) => {
  const userData = req.user;
  const { byPassOTP = false } = req.body;

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
  const user = req.user;

  const userInfo = await teachers.findOne({
    where: { id: user.id },
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
  const teachers = await teachers.findAll({});

  res.json({
    succeed: true,
    msg: "Successfully fetched teachers' data!",
    teachers,
  });
};

const updateTeacher = async (req, res) => {
  const data = req.body;
  await teachers.update({ ...data }, { where: { id: req.user.id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated',
  });
};

module.exports = {
  createTeacher,
  loginTeacher,
  getTeacher,
  getAllTeachers,
  updateTeacher,
};
