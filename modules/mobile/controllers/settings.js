const { getMobileSettings } = require("../services/settings");

const liseSettings = async (req, res, next) => {
  try {
    const result = await getMobileSettings();

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

module.exports = {
  liseSettings,
};
