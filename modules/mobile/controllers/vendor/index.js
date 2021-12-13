const {
  addProductForVendor
} = require("../../services/vendor");


const addProduct = async (req, res, next) => {
  try {
    const product = req.query;
    const result = await addProductForVendor({
      ...product,
      vendorId: req.uesr._id
    });

    return res.json({
      status: true,
      message: "تم اضافة المنتج بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
}


module.exports = {
  addProduct
}