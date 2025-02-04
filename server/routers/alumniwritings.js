const {
  createAlumniWriting,
  getAllAlumniWritings,
  getSingleAlumniWriting,
  updateAlumniWriting,
  deleteAlumniWriting,
} = require('../controllers/alumniwritings');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post(
  '/create',
  adminValidate,
  upload.array('alumniwritings'),
  createAlumniWriting
);
// router.post('/login', loginStudent);

router.get('/get-all-writing', getAllAlumniWritings);
router.get('/get/:id', getSingleAlumniWriting);

router.put(
  '/update/:id',
  adminValidate,
  upload.array('alumniwritings'),
  updateAlumniWriting
);

router.delete('/delete/:id', adminValidate, deleteAlumniWriting);

module.exports = router;
