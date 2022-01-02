module.exports = {
  addProductSchema: {
    type: "object",
    additionalProperties: false,
    required: ["vendorId", "name", "description", "productType", "units", "images"],
    properties: {
      vendorId: {
        type: ["object", "string"],
      },
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      productType: {
        type: "string",
      },
      units: {
        type: "array",
        uniqueItems: true,
        minItems: 1,
        items: [
          {
            type: "object",
            required: ["productUnit", "pricePerUnit"],
            properties: {
              productUnit: {
                type: "string",
              },
              pricePerUnit: {
                type: "number",
              },
              minimumAmountPerOrder: {
                type: "number",
              },
            },
          },
        ],
      },
      isPriceShown: {
        type: "boolean",
      },
      images: {
        type: "array",
        minItems: 1,
        uniqueItems: true,
        items: [
          {
            type: "string",
          },
        ],
      },
      notes: {
        type: "string",
      },
    },
  },
};
