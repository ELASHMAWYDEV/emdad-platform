const { userTypes } = require("../../../../models/constants");

module.exports = {
  createTransportationRequestSchema: {
    type: "object",
    required: ["requesterId", "requesterType", "supplyRequestId", "transportationMethod", "city"],
    additionalProperties: false,
    properties: {
      requesterId: {
        type: ["object", "string"],
      },
      requesterType: {
        type: "string",
        enum: [userTypes.USER, userTypes.VENDOR],
      },
      supplyRequestId: {
        type: ["object", "string"],
      },
      transportationMethod: {
        type: "string",
      },
      city: {
        type: "string",
      },
    },
  },
  createTransportationOfferSchema: {
    type: "object",
    required: ["transporterId", "transportationRequestId", "price"],
    additionalProperties: false,
    properties: {
      transporterId: {
        type: ["object", "string"],
      },
      transportationRequestId: {
        type: ["object", "string"],
      },
      price: {
        type: "number",
      },
      notes: {
        type: "string",
      },
    },
  },
};
