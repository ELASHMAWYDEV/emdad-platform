const UserService = require("../../services/user");
const SettingsService = require("../../services/settings");
const SupplyService = require("../../services/supply");
const ProductService = require("../../services/product");
const TransportationService = require("../../services/transportation");
const { userTypes } = require("../../../../models/constants");

const getHomeData = async (req, res, next) => {
  try {
    const vendors = await UserService.listVendors({});
    const favouriteVendors =
      req.user.userType == userTypes.GUEST ? [] : await UserService.getFavouriteVendors(req.user._id);
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
    const result = await ProductService.listProducts({ vendorId, ...filters, categorized: true });

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
      data: { product: result },
    });
  } catch (e) {
    next(e);
  }
};

const toggleVendorToFavourites = async (req, res, next) => {
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
      data: { rating: result },
    });
  } catch (e) {
    next(e);
  }
};

const createSupplyRequest = async (req, res, next) => {
  try {
    const supplyRequest = req.body;
    const result = await SupplyService.createSupplyRequest({ ...supplyRequest, userId: req.user._id });

    return res.json({
      status: true,
      message: "تم ارسال الطلب بنجاح",
      data: { supplyRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const resendSupplyRequest = async (req, res, next) => {
  try {
    const supplyRequest = req.body;
    const { supplyRequestId } = req.params;
    const result = await SupplyService.resendSupplyRequest({ ...supplyRequest, supplyRequestId });

    return res.json({
      status: true,
      message: "تم اعادة ارسال الطلب بنجاح",
      data: { supplyRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const acceptSupplyRequest = async (req, res, next) => {
  try {
    const { supplyRequestId } = req.params;
    const result = await SupplyService.acceptSupplyRequest(supplyRequestId);

    return res.json({
      status: true,
      message: "تمت الموافقة علي عرض السعر بنجاح",
      data: { supplyRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const listSupplyRequests = async (req, res, next) => {
  try {
    const { paginationToken } = req.query;
    const result = await SupplyService.listSupplyRequests({ userId: req.user._id, paginationToken });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { supplyRequests: result },
    });
  } catch (e) {
    next(e);
  }
};

const getSupplyRequestInfo = async (req, res, next) => {
  try {
    const { supplyRequestId } = req.params;
    const result = await SupplyService.getSupplyRequestInfo(supplyRequestId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { supplyRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const createTransportationRequest = async (req, res, next) => {
  try {
    const transportationRequest = req.body;
    const result = await TransportationService.createTransportationRequest({
      ...transportationRequest,
      requesterId: req.user._id,
      requesterType: req.user.userType,
    });

    return res.json({
      status: true,
      message: "تم ارسال الطلب بنجاح",
      data: { transportationRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const acceptTransportationOffer = async (req, res, next) => {
  try {
    const { transportationOfferId } = req.params;
    const result = await TransportationService.acceptTransportationOffer(transportationOfferId);

    return res.json({
      status: true,
      message: "تمت الموافقة علي عرض التوصيل بنجاح",
      data: null,
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
  toggleVendorToFavourites,
  rateVendor,
  createSupplyRequest,
  resendSupplyRequest,
  listSupplyRequests,
  getSupplyRequestInfo,
  acceptSupplyRequest,
  createTransportationRequest,
  acceptTransportationOffer,
};
