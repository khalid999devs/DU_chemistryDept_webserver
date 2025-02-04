const {
  createNotice,
  getAllnotices,
  updateNotice,
  deleteNotice,
} = require('../controllers/notices');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post('/create', adminValidate, upload.single('notices'), createNotice);
// router.post('/login', loginStudent);

router.get('/get-all-notice', getAllnotices);

router.put(
  '/update/:id',
  adminValidate,
  upload.single('notices'),
  updateNotice
);

router.delete('/delete/:id', adminValidate, deleteNotice);

module.exports = router;
