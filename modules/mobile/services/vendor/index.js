const ProductModel = require("../../../../models/Product");
const ApiError = require("../../../../errors/ApiError");
const {
  errorCodes
} = require("../../../../errors");
const {
  validateSchema
} = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");


const addProductForVendor = validateSchema(schemas.addProductSchema)(async (product) => {

  // @TODO: upload images

  const createdProduct = await ProductModel.create(product);

  return createdProduct;

})


module.exports = {
  addProductForVendor
}