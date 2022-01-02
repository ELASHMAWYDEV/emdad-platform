const ProductService = require("../../services/product");
const SupplyService = require("../../services/supply");

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
    const { paginationToken } = req.query;
    const result = await SupplyService.listSupplyRequests({ vendorId: req.user._id, paginationToken });

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

module.exports = {
  addProduct,
  quoteSupplyRequest,
  listSupplyRequests,
  getSupplyRequestInfo,
  listProducts,
  getProductDetails
};
