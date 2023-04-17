const SettingsService = require("../../services/settings");
const FileService = require("../../services/file");

const listSettings = async (req, res, next) => {
  try {
    const result = await SettingsService.getMobileSettings();

    return res.json({
      status: true,
      data: {
        settings: result,
      },
    });
  } catch (e) {
    next(e);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    const { type } = req.body;
    const result = await FileService.uploadImages({ type, files: req.files });

    return res.json({
      status: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const listNotifications = async (req, res, next) => {
  try {
    const filters = req.query;
    const { userId } = req.user;

    const result = await SettingsService.listNotifications({ userId, ...filters });

    return res.json({
      status: true,
      data: {
        notifications: result || [],
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listSettings,
  uploadImages,
  listNotifications,
};
