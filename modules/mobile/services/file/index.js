const { v4: uuid4 } = require("uuid");
const path = require("path");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");

const uploadImages = ({ type, files }) => {
  let { logo, images } = files || { logo: {}, images: {} };

  if (!["users", "products"].includes(type)) throw new Error("`type` must be one of: users, products");
  if (type === "users" && !logo) throw new ApiError(errorCodes.NO_IMAGES_UPLOADED);
  if (type === "products" && !images) throw new ApiError(errorCodes.NO_IMAGES_UPLOADED);

  switch (type) {
    case "users":
      if (Array.isArray(logo)) throw new Error("يجب رفع صورة واحدة فقط");
      logo.extension = logo.name.split(".").pop();
      logo.uniqueName = `${uuid4()}.${logo.extension}`;
      if (!["jpg", "png", "jpeg"].includes(logo.extension)) throw new ApiError(errorCodes.IMAGE_TYPE_NOT_SUPPORTED);

      return { logo: logo.uniqueName };
    case "products":
      if (!Array.isArray(images)) images = [images];
      let imagesToSave = [];

      //add the extension property to the image
      images.forEach((image) => {
        image.extension = image.name.split(".").pop();
        image.uniqueName = `${uuid4()}.${image.extension}`;
        imagesToSave.push(image.uniqueName);
        if (!["jpg", "png", "jpeg"].includes(image.extension)) throw new ApiError(errorCodes.IMAGE_TYPE_NOT_SUPPORTED);
      });

      // Save the images
      for (let image of images) {
        image.mv(path.join(__dirname, "..", "..", "..", "..", "images", "products", image.uniqueName));
      }
      return { images: imagesToSave };
  }
};

module.exports = { uploadImages };
