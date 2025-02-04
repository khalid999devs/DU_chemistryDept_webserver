const {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');
const adminValidate = require('../middlewares/adminTokenVerify');
const upload = require('../middlewares/uploadFile');

const router = require('express').Router();

router.post(
  '/create',
  adminValidate,
  upload.fields([{ name: 'evbanner', maxCount: 1 }, { name: 'evgallery' }]),
  createEvent
);
// router.post('/login', loginStudent);

router.get('/get-all-event', getAllEvents);
router.get('/get/:id', getSingleEvent);

router.put(
  '/update/:id',
  adminValidate,
  upload.fields([{ name: 'evbanner', maxCount: 1 }, { name: 'evgallery' }]),
  updateEvent
);

router.delete('/delete/:id', adminValidate, deleteEvent);

module.exports = router;
