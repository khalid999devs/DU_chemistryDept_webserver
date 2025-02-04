const {
  createStudent,
  getStudent,
  getAllstudents,
  updateStudent,
  deleteStudent,
} = require('../controllers/students');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post('/create', adminValidate, upload.single('students'), createStudent);
// router.post('/login', loginStudent);

router.get('/get-student/:id', getStudent);
router.get('/get-all-student', getAllstudents);

router.put(
  '/update/:id',
  adminValidate,
  upload.single('students'),
  updateStudent
);

router.delete('/delete/:id', adminValidate, deleteStudent);

module.exports = router;
