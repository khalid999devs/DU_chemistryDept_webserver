const {
  createWriting,
  getAllWritings,
  getSingleWriting,
  updateWriting,
  deleteWriting,
} = require('../controllers/writings');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post('/create', adminValidate, upload.array('writings'), createWriting);
// router.post('/login', loginStudent);

router.get('/get-all-writing', getAllWritings);
router.get('/get/:id', getSingleWriting);

router.put(
  '/update/:id',
  adminValidate,
  upload.array('writings'),
  updateWriting
);

router.delete('/delete/:id', adminValidate, deleteWriting);

module.exports = router;
