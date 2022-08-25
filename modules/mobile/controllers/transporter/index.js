const TransportationService = require("../../services/transportation");

const listTransportationRequests = async (req, res, next) => {
  try {
    const { paginationToken, limit, transportationStatus } = req.query;
    const result = await TransportationService.listTransportationRequests({
      paginationToken,
      limit,
      transportationStatus,
      city: req.user.city,
    });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { transportationRequests: result },
    });
  } catch (e) {
    next(e);
  }
};

const getTransportationRequestDetails = async (req, res, next) => {
  try {
    const { transportationRequestId } = req.params;
    const result = await TransportationService.getTransportationRequestInfo(transportationRequestId);

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { transportationRequest: result },
    });
  } catch (e) {
    next(e);
  }
};

const listAcceptedTransportationRequests = async (req, res, next) => {
  try {
    const { paginationToken, limit, transportationStatus } = req.query;
    const result = await TransportationService.listTransportationRequests({
      paginationToken,
      limit,
      transportationStatus: transportationStatus || { $nin: ["awaitingOffers", "delivered"] },
      transporterId: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: { transportationRequests: result },
    });
  } catch (e) {
    next(e);
  }
};

const createTransportationOffer = async (req, res, next) => {
  try {
    const transportationOffer = req.body;
    const result = await TransportationService.createTransportationOffer({
      ...transportationOffer,
      transporterId: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم ارسال عرض التوصيل بنجاح",
      data: { transportationOffer: result },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listTransportationRequests,
  getTransportationRequestDetails,
  listAcceptedTransportationRequests,
  createTransportationOffer,
};
