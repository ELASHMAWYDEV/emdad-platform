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
              units: {
                type: "array",
                minItems: 1,
                items: [
                  {
                    type: "object",
                    required: ["productUnit", "pricePerUnit", "minimumAmountPerOrder"],
                    properties: {
                      productUnit: { type: "string" },
                      pricePerUnit: { type: "number" },
                      minimumAmountPerOrder: { type: "number" },
                    },
                  },
                ],
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
  resendSupplyRequestSchema: {
    type: "object",
    required: ["supplyRequestId", "requestItems"],
    additionalProperties: false,
    properties: {
      supplyRequestId: {
        type: "string",
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
              units: {
                type: "array",
                minItems: 1,
                items: [
                  {
                    type: "object",
                    required: ["productUnit", "pricePerUnit", "minimumAmountPerOrder"],
                    properties: {
                      productUnit: { type: "string" },
                      pricePerUnit: { type: "number" },
                      minimumAmountPerOrder: { type: "number" },
                    },
                  },
                ],
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
    required: ["vendorId", "supplyRequestId", "requestItems", "estimationInSeconds"],
    additionalProperties: false,
    properties: {
      estimationInSeconds: {
        type: "number",
      },
      vendorId: {
        type: ["object", "string"],
      },
      supplyRequestId: {
        type: "string",
      },
      transportationPrice: {
        type: "number",
      },
      requestItems: {
        type: "array",
        minItems: 0,
        items: [
          {
            type: "object",
            required: ["itemId", "totalPrice"],
            additionalProperties: false,
            properties: {
              itemId: {
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
        minItems: 0,
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
