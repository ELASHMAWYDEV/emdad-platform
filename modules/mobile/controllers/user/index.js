const {
  listVendors,
  getFavouriteVendors
} = require("../../services/user");
const {
  listFeaturedVendors
} = require("../../services/settings");


const getHomeData = async (req, res, next) => {
  try {
    const vendors = await listVendors({
      fullData: true
    });
    const favouriteVendors = await getFavouriteVendors(req.user._id);
    const featuredVendors = await listFeaturedVendors();

    return res.json({
      status: true,
      message: "تم استرجاع البيانات بنجاح",
      data: {
        vendors,
        favouriteVendors,
        featuredVendors
      },
    });
  } catch (e) {
    next(e);
  }
}

const getListOfVendors = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await listVendors(filters);

    return res.json({
      status: true,
      message: "تم استرجاع الموردين بنجاح",
      data: {
        vendors: result
      },
    });
  } catch (e) {
    next(e);
  }
}


module.exports = {
  getListOfVendors,
  getHomeData
}