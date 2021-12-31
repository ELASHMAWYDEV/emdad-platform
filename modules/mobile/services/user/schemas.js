module.exports = {
  listVendorsSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      fullData: {
        type: "boolean",
      },
      paginationToken: {
        type: ["string", "object"],
      },
      searchQuery: {
        type: "string",
      },
      vendorType: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
      },
      city: {
        type: "string",
      },
      country: {
        type: "string",
      },
    },
  },
  rateTargetSchema: {
    type: "object",
    additionalProperties: false,
    required: ["targetId", "userId", "rating", "comment"],
    properties: {
      targetId: {
        type: ["string", "object"],
      },
      userId: {
        type: ["string", "object"],
      },
      rating: {
        type: "number",
        minimum: 0,
        maximum: 5,
      },
      comment: {
        type: "string",
      },
    },
  },
};
