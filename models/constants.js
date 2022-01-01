const userTypes = {
  USER: "user",
  VENDOR: "vendor",
  TRANSPORTER: "transporter",
};

const supportedLanguages = {
  AR: "ar",
  EN: "en",
};

const countryCodes = {
  SA: "+966",
  EG: "+20",
};

const settingsKeys = {
  MOBILE: "mobileSettings",
  FEATURED_VENDORS: "featuredVendors",
};

const supplyRequestStatus = {
  AWAITING_QUOTATION: "awaitingQuotation", // When sent to vendor {AUTO - DEFAULT}
  AWAITING_APPROVAL: "awaitingApproval", // When waiting for user to accept the offer {MANUAL}
  PREPARING: "preparing", // When request is accepted by vendor & he is either preparing it or finding a transporter
  AWAITING_TRANSPORTAION: "awaitingTransportation", // When order is finished preparing and awaiting either transporter or user or vendor to transport {AUTO}
  ON_WAY: "onWay", // When order is on the way --> not applicable if transportation is handled by the user only
  DELIVERED: "delivered", // The order is successfully delivered to the user
};

const transportationStatus = {
  PENDING: "pending", // The transportation offer is accepted by the
  PICKUP_LOCATION: "pickupLocation",
  DELIVERY_LOCATIONN: "deliveryLocation",
  DELIVERED: "delivered", // The order is successfully delivered to the user
};

module.exports = {
  userTypes,
  supportedLanguages,
  countryCodes,
  settingsKeys,
  supplyRequestStatus,
  transportationStatus,
};
