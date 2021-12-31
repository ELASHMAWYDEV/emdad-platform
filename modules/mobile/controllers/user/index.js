const UserService = require("../../services/user");
const SettingsService = require("../../services/settings");

const getHomeData = async (req, res, next) => {
  try {
    const vendors = await UserService.listVendors({
      fullData: true,
    });
    const favouriteVendors = await UserService.getFavouriteVendors(req.user._id);
    const featuredVendors = await SettingsService.listFeaturedVendors();

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: {
        vendors,
        favouriteVendors,
        featuredVendors,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getListOfVendors = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await UserService.listVendors(filters);

    return res.json({
      status: true,
      message: "تم استرجاع الموردين بنجاح",
      data: {
        vendors: result,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getVendorInfo = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const result = await UserService.getVendorInfo(vendorId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getVendorProducts = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const filters = req.query;
    const result = await UserService.getVendorProducts({ vendorId, ...filters });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getProductInfo = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await UserService.getProductInfo(productId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const addVendorToFavourites = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    await UserService.addVendorToFavourites({ vendorId, userId: req.user._id });

    return res.json({
      status: true,
      message: "تم اضافة البائع الي المفضلة بنجاح",
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

const rateVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { rating, comment } = req.body;
    const result = await UserService.rateTarget({ targetId: vendorId, userId: req.user._id, rating, comment });

    return res.json({
      status: true,
      message: "تم تقييم البائع بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getHomeData,
  getListOfVendors,
  getVendorInfo,
  getVendorProducts,
  getProductInfo,
  addVendorToFavourites,
  rateVendor,
};
