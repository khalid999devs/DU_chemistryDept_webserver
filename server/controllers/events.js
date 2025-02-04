const { events } = require('../models');
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

const createEvent = async (req, res) => {
  let eventData = req.body;

  if (!eventData.name) {
    throw new BadRequestError('You must provide a name to the Event!');
  }

  eventData.value =
    eventData.name.slice(0, 20).split(' ')[0].toLowerCase() + `@${Date.now()}`;

  if (req.files) {
    const uploadedFiles = req.files;
    if (uploadedFiles?.evbanner?.length > 0) {
      eventData.banner = {
        url: uploadedFiles.evbanner[0].path,
        serverFile: uploadedFiles.evbanner[0],
      };
    }
    if (uploadedFiles?.evgallery?.length > 0) {
      eventData.gallery = uploadedFiles.evgallery.map((file, key) => {
        return {
          id: `${key}@${Date.now()}`,
          url: file.path,
          serverFile: file,
        };
      });
    }
  }
  if (eventData.segments) {
    eventData.segments = JSON.parse(eventData.segments);
  }

  const event = await events.create(eventData);

  res.json({
    succeed: true,
    msg: 'Event created successfully',
    event,
  });
};

const getAllEvents = async (req, res) => {
  const eventsObj = await events.findAll({
    attributes: [
      'id',
      'name',
      'value',
      'date',
      'year',
      [Sequelize.literal(`banner->>'url'`), 'bannerUrl'],
      'createdAt',
    ],
  });

  res.json({
    succeed: true,
    msg: 'Successfully fetched events',
    events: eventsObj,
  });
};

const getSingleEvent = async (req, res) => {
  const id = req.params.id;
  const singleEvent = await events.findByPk(id);

  if (!singleEvent) {
    throw new NotFoundError('Event not found!');
  }

  res.json({
    succeed: true,
    msg: 'Successfully fetched the event',
    event: singleEvent,
  });
};

const updateEvent = async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  let targetEvent = await events.findByPk(id);

  if (!targetEvent) {
    throw new NotFoundError('event not found!');
  }

  if (data.segments) {
    data.segments = JSON.parse(data.segments);
  }

  if (req.files) {
    const uploadedFiles = req.files;

    if (uploadedFiles?.evbanner?.length > 0) {
      data.banner = {
        url: uploadedFiles.evbanner[0].path,
        serverFile: uploadedFiles.evbanner[0],
      };
      if (targetEvent?.banner?.url) deleteFile(targetEvent.banner.url);
    }

    if (uploadedFiles?.evgallery?.length > 0) {
      if (data?.mode && data.mode === 'replaceGImg') {
        if (data?.replaceImgId) {
          data.gallery = targetEvent.gallery.map((item) => {
            if (item.id === data.replaceImgId) {
              console.log('doen');
              deleteFile(item.url);
              item.url = uploadedFiles.evgallery[0].path;
              item.serverFile = uploadedFiles.evgallery[0];
            }
            return item;
          });
        }
      } else {
        data.gallery = [
          ...targetEvent.gallery,
          ...uploadedFiles.evgallery.map((file, key) => {
            return {
              id: `${key}@${Date.now()}`,
              url: file.path,
              serverFile: file,
            };
          }),
        ];
      }
    }
  }

  if (targetEvent?.gallery?.length > 0) {
    if (data?.mode && data.mode === 'deleteGImg') {
      if (data?.deleteImgId) {
        const deleteUrl = targetEvent.gallery.find(
          (item) => item.id === data?.deleteImgId
        )?.url;
        if (deleteUrl) deleteFile(deleteUrl);

        data.gallery = targetEvent.gallery.filter(
          (item) => item.id !== data.deleteImgId
        );
      }
    } else if (data?.mode && data.mode === 'deleteAllGImg') {
      targetEvent.gallery?.forEach((item) => {
        if (item.url) deleteFile(item.url);
      });
      data.gallery = [];
    }
  }

  await events.update({ ...data }, { where: { id: id } });

  res.json({
    succeed: true,
    msg: 'Successfully updated event!',
  });
};

const deleteEvent = async (req, res) => {
  const id = req.params.id;
  const targetEvent = await events.findByPk(id);
  if (!targetEvent) {
    throw new BadRequestError('Invalid Event Id provided!');
  }

  if (targetEvent?.banner?.url) deleteFile(targetEvent.banner.url);
  if (targetEvent?.gallery?.length > 0) {
    targetEvent.gallery.map((item) => {
      if (item.url) deleteFile(item.url);
    });
  }

  await targetEvent.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted the Event!',
  });
};

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
