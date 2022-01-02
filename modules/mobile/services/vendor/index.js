const ProductModel = require("../../../../models/Product");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");
