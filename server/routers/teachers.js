const {
  createTeacher,
  loginTeacher,
  getTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teachers');
const adminValidate = require('../middlewares/adminTokenVerify');
const clientValidate = require('../middlewares/clientTokenVerify');
const { clientRegValidate } = require('../middlewares/clientValidate');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post(
  '/create',
  adminValidate,
  upload.single('teachers'),
  clientRegValidate,
  createTeacher
);
// router.post('/login', loginTeacher);

router.get('/get-teacher/:id', getTeacher);
router.get('/get-all-teacher', getAllTeachers);

router.put(
  '/update/:id',
  adminValidate,
  upload.single('teachers'),
  updateTeacher
);

router.delete('/delete/:id', adminValidate, deleteTeacher);

module.exports = router;
