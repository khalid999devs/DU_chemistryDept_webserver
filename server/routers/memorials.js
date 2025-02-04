const {
  createMemorial,
  getAllMemorials,
  updateMemorial,
  deleteMemorial,
} = require('../controllers/memorials');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post(
  '/create',
  adminValidate,
  upload.single('memorials'),
  createMemorial
);
// router.post('/login', loginStudent);

router.get('/get-all-memorial', getAllMemorials);

router.put(
  '/update/:id',
  adminValidate,
  upload.single('memorials'),
  updateMemorial
);

router.delete('/delete/:id', adminValidate, deleteMemorial);

module.exports = router;
