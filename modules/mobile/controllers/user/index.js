const UserService = require("../../services/user");
const SettingsService = require("../../services/settings");
const SupplyService = require("../../services/supply");

const getHomeData = async (req, res, next) => {
  try {
    const vendors = await UserService.listVendors({});
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
    const result = await UserService.getVendorProducts({ vendorId, ...filters, categorized: true });

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
    const result = await UserService.toggleVendorToFavourites({ vendorId, userId: req.user._id });

    return res.json({
      status: true,
      message: result,
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

const createSupplyRequest = async (req, res, next) => {
  try {
    const supplyRequest = req.body;
    console.log({ ...supplyRequest, userId: req.user._id });
    const result = await SupplyService.createSupplyRequest({ ...supplyRequest, userId: req.user._id });

    return res.json({
      status: true,
      message: "تم ارسال الطلب بنجاح",
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
  createSupplyRequest,
};
