const { students } = require('../models');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { sendToken } = require('../utils/createToken');
const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');
const { Sequelize } = require('sequelize');

const createStudent = async (req, res) => {
  let userData = req.body;
  if (!userData.fullName) {
    throw new BadRequestError('You must provide fullName for any student!');
  }
  userData.username =
    userData.fullName.split(' ')[0].toLowerCase() + `@${Date.now()}`;

  if (userData.phone) {
    const isUser = await students.findOne({
      where: { phone: userData.phone.trim() },
    });
    if (isUser) {
      if (req?.file?.path) deleteFile(req.file.path);
      throw new UnauthorizedError('User already exists!');
    }
  }

  if (req?.file?.path) {
    userData.image = {
      url: req.file.path,
      serverImg: req.file,
    };
  }
  if (userData.works) userData.works = JSON.parse(userData.works);
  if (userData.writings) userData.writings = JSON.parse(userData.writings);

  const user = await students.create(userData);

  res.json({
    succeed: true,
    msg: 'Student created successfully',
    student: user,
  });
};

const loginStudent = async (req, res) => {
  const { phone } = req.body;

  let user = await students.findOne({ where: { phone } });
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

const getStudent = async (req, res) => {
  const userId = req.params.id;

  const userInfo = await students.findOne({
    where: { id: userId },
  });
  if (!userInfo) {
    throw new NotFoundError('Student Not Found!');
  }

  res.json({
    succeed: true,
    msg: 'Successfully got Student!',
    student: userInfo,
  });
};

const getAllstudents = async (req, res) => {
  const studentsObj = await students.findAll({
    attributes: [
      'id',
      'fullName',
      'username',
      [Sequelize.literal(`image->>'url'`), 'avatar'],
      'createdAt',
    ],
  });

  res.json({
    succeed: true,
    msg: "Successfully fetched students' data!",
    students: studentsObj,
  });
};

const updateStudent = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  const targetStudent = await students.findByPk(id);
  if (!targetStudent) throw new NotFoundError('Student not found!');

  if (req?.file?.path) {
    data.image = {
      url: req.file.path,
      serverImg: req.file,
    };
    if (targetStudent?.image?.url) deleteFile(targetStudent.image.url);
  }
  if (data.works) data.works = JSON.parse(data.works);
  if (data.writings) data.writings = JSON.parse(data.writings);

  await students.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated',
  });
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;
  const targetStudent = await students.findByPk(id);
  if (!targetStudent) {
    throw new BadRequestError('Invalid Teacher Id provided!');
  }

  if (targetStudent?.image?.url) {
    deleteFile(targetStudent.image.url);
  }

  await targetStudent.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted Student!',
  });
};

module.exports = {
  createStudent,
  loginStudent,
  getStudent,
  getAllstudents,
  updateStudent,
  deleteStudent,
};
