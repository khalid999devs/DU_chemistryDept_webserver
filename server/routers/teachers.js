const {
  createTeacher,
  loginTeacher,
  getTeacher,
  getAllTeachers,
  updateTeacher,
} = require('../controllers/teachers');
const adminValidate = require('../middlewares/adminTokenVerify');
const clientValidate = require('../middlewares/clientTokenVerify');
const { clientRegValidate } = require('../middlewares/clientValidate');

const router = require('express').Router();

router.post('/create', adminValidate, clientRegValidate, createTeacher);
// router.post('/login', loginTeacher);

router.get('/get-teacher', getTeacher);
router.get('/get-all-teacher', getAllTeachers);

router.put('/update', adminValidate, updateTeacher);

module.exports = router;
