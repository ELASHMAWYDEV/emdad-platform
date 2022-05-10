const ProductService = require("../../services/product");
const SupplyService = require("../../services/supply");
const TransportationService = require("../../services/transportation");

const addProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const result = await ProductService.addProduct({
      ...product,
      vendorId: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم اضافة المنتج بنجاح",
      data: { product: result },
    });
  } catch (e) {
    next(e);
  }
};

const quoteSupplyRequest = async (req, res, next) => {
  try {
    const quotation = req.body;
    const { supplyRequestId } = req.params;
    const result = await SupplyService.quoteSupplyRequest({ ...quotation, supplyRequestId, vendorId: req.user._id });

    return res.json({
      status: true,
      message: "تم ارسال عرض السعر بنجاح",
      data: { supplyRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const listSupplyRequests = async (req, res, next) => {
  try {
    const { paginationToken, limit, requestStatus } = req.query;
    const result = await SupplyService.listSupplyRequests({
      vendorId: req.user._id,
      paginationToken,
      limit,
      requestStatus,
    });

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

const listProducts = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await ProductService.listProducts({ vendorId: req.user._id, ...filters });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.getProductDetails(productId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { product: result },
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

const listTransportationOffers = async (req, res, next) => {
  try {
    const { paginationToken, limit } = req.query;
    const { transportationRequestId } = req.params;
    const result = await TransportationService.listTransportationOffers({
      transportationRequestId,
      paginationToken,
      limit,
    });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { transportationOffers: result },
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

const getTransportationOfferInfo = async (req, res, next) => {
  try {
    const { transportationOfferId } = req.params;
    const result = await TransportationService.getTransportationOfferInfo(transportationOfferId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { transportationOffer: result },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addProduct,
  quoteSupplyRequest,
  listSupplyRequests,
  getSupplyRequestInfo,
  listProducts,
  getProductDetails,
  createTransportationRequest,
  listTransportationOffers,
  acceptTransportationOffer,
  getTransportationOfferInfo,
};
