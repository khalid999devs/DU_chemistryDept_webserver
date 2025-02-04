const { teachers } = require('../models');
const {
  UnauthenticatedError,
  BadRequestError,
  UnauthorizedError,
} = require('../errors');
const deleteFile = require('../utils/deleteFile');

const passwordValidate = async (req, res, next) => {
  const { id, mode } = req.user;
  const { password } = req.body;
  if (!password) {
  }

  const clientUser = await clients.findByPk(id, {
    attributes: ['password'],
  });
  const match = await compare(password, clientUser.password);
  if (!match) {
    throw new UnauthenticatedError('wrong password entered');
  } else next();
};

const clientRegValidate = async (req, res, next) => {
  const data = req.body;
  const fullName = data.fullName;

  if (fullName) {
    const username = fullName.split(' ')[0].toLowerCase() + `@${Date.now()}`;

    if (data.phone) {
      const isUser = await teachers.findOne({
        where: { phone: data.phone.trim() },
      });
      if (isUser) {
        if (!isUser.fullName) {
          req.mode = 'update';
        } else {
          if (req?.file?.path) deleteFile(req.file.path);
          throw new UnauthorizedError('User already exists!');
        }
      }
    }

    let userData = {
      ...data,
      username,
    };

    req.user = userData;

    next();
  } else {
    throw new BadRequestError('Input fields should not be empty');
  }
};

module.exports = {
  clientRegValidate,
  passwordValidate,
};
