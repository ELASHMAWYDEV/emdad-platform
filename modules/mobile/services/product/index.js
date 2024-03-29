const ProductModel = require("../../../../models/Product");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas.js");
const CustomError = require("../../../../errors/CustomError");
const { ObjectId } = require("../../../../models/constants");

const addProduct = validateSchema(schemas.addProductSchema)(async (product) => {
  // Validation on images
  for (let image of product.images) {
    if (!/\w+-\w+-\w+-\w+-\w+\.\w+/.test(image))
      throw new CustomError("NOT_ALL_IMAGES_UPLOADED", "الصور التي ارسلتها  لم تقم برفعها كلها");
  }

  const createdProduct = await ProductModel.create(product);

  return createdProduct;
});

const editProduct = validateSchema(schemas.editProductSchema)(async ({ productId, ...product }) => {
  // Validation on images
  for (let image of product.images) {
    if (!/\w+-\w+-\w+-\w+-\w+\.\w+/.test(image))
      throw new CustomError("NOT_ALL_IMAGES_UPLOADED", "الصور التي ارسلتها  لم تقم برفعها كلها");
  }

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: ObjectId(productId) },
    { $set: { ...product } },
    { new: true }
  ).lean({
    virtuals: true,
  });

  return updatedProduct;
});

const listProducts = async ({
  vendorId,
  categorized = false,
  productType = [],
  paginationToken = null,
  limit = 10,
  searchQuery,
}) => {
  const products = await ProductModel.find({
    ...(paginationToken && {
      _id: {
        $gt: paginationToken,
      },
    }),
    ...(productType.length !== 0 && { productType: { $in: productType } }),
    vendorId: ObjectId(vendorId),
    ...(searchQuery && {
      $or: [
        { name: { $regex: ".*" + searchQuery + ".*", $options: "i" } },
        { description: { $regex: ".*" + searchQuery + ".*", $options: "i" } },
      ],
    }),
  })
    .limit(Number(limit))
    .lean({ virtuals: true });

  let productCategories;
  if (categorized && productType.length === 0) {
    productCategories = await ProductModel.find({
      vendorId,
    })
      .distinct("productType")
      .lean();

    return {
      categories: productCategories.map((category) => ({
        category: category,
        products: products.filter((p) => p.productType.includes(category)),
        // .map((p) => ({ ...p, images: p.images.map((img) => `${WEBSITE_URL}/images/products/${img}`) })),
      })),
    };
  } else {
    return { products };
  }
};

const getProductDetails = async (productId) => {
  const product = await ProductModel.findOne({ _id: productId });
  if (!product) throw new CustomError("PRODUCT_NOT_FOUND", "المنتج الذي تحاول الوصول اليه غير موجود");

  return product;
};

module.exports = {
  addProduct,
  editProduct,
  listProducts,
  getProductDetails,
};
