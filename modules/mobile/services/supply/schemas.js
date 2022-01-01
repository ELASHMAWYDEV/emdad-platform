module.exports = {
  createSupplyRequestSchema: {
    type: "object",
    required: ["userId", "vendorId", "isTransportationNeeded", "requestItems"],
    additionalProperties: false,
    properties: {
      userId: {
        type: ["object", "string"],
      },
      vendorId: {
        type: ["object", "string"],
      },
      isTransportationNeeded: {
        type: "boolean",
      },
      requestItems: {
        type: "array",
        minItems: 1,
        items: [
          {
            type: "object",
            required: ["name", "quantity", "productUnit"],
            additionalProperties: false,
            properties: {
              name: {
                type: "string",
              },
              quantity: {
                type: "number",
              },
              productUnit: {
                type: "string",
              },
            },
          },
        ],
      },
      additionalItems: {
        type: "array",
        minItems: 0,
        items: [
          {
            type: "object",
            required: ["description"],
            properties: {
              description: {
                type: "string",
              },
            },
          },
        ],
      },
    },
  },
  quoteSupplyRequestSchema: {
    type: "object",
    required: ["supplyRequestId", "requestItems"],
    additionalProperties: false,
    properties: {
      supplyRequestId: {
        type: "string",
      },
      requestItems: {
        type: "array",
        items: [
          {
            type: "object",
            required: ["productId", "totalPrice"],
            additionalProperties: false,
            properties: {
              productId: {
                type: "string",
              },
              totalPrice: {
                type: "number",
              },
            },
          },
        ],
      },
      additionalItems: {
        type: "array",
        items: [
          {
            type: "object",
            required: ["itemId", "price"],
            additionalProperties: false,
            properties: {
              itemId: {
                type: "string",
              },
              price: {
                type: "number",
              },
            },
          },
        ],
      },
    },
  },
};
