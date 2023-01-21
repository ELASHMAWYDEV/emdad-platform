const admin = require('firebase-admin');
const CustomError = require('../errors/CustomError');

module.exports = async ({
  firebaseToken,
  title,
  body,
  type,
  deviceType,
  data = {}
}) => {
  try {
    if (!firebaseToken) {
      console.log('Firbase token is missing');
      return;
    }

    let typeDescription = '';
    switch (type) {
      case 1:
        typeDescription = 'Dashboard Notification';
        break;
      case 2: // Done
        typeDescription = 'User: Supply Offer';
        break;
      case 3: // Done
        typeDescription = 'User: Transportation Offer';
        break;
      case 4:
        typeDescription = 'User: Order Status Change';
        break;
      case 5:
        typeDescription = 'User: New Vendor Created';
        break;
      case 6:
        typeDescription = 'User: Favourite Vendor Added New Product';
        break;
      case 7: // Done
        typeDescription = 'Vendor: New Price Request';
        break;
      case 8: // Done
        typeDescription = 'Vendor: New Order Request';
        break;
      case 9: // Done
        typeDescription = 'Vendor: Offer Accepted';
        break;
      case 10:
        typeDescription = 'Vendor: Order Status Change';
        break;
      case 11: // Done
        typeDescription = 'Vendor: User Set Favourite';
        break;
      case 12: // Done
        typeDescription = 'Vendor: User Rate Or Comment';
        break;
      case 13: // Done
        typeDescription = 'Transporter: New Price Request';
        break;
      case 14:
        typeDescription = 'Transporter: New Order Request';
        break;
    }

    let payload;
    
    if (deviceType == "android") {
      //Set the data object
      payload = {
        data: {
          title,
          body,
          type: type.toString(),
          typeDescription,
          data: JSON.stringify(data),
        },
      };
    } else {
      payload = {
        data: {
          type: type.toString(),
          typeDescription,
          ...data,
        },
        notification: {
          body,
          title,
          click_action: 'MainActivity',
          android_channel_id: 'notification_channel_id',
        },
      };
    }

    let options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    let result = await admin.messaging().sendToDevice(firebaseToken, payload, options);

    if (result.results[0].error) {
      throw new Error(result.results[0].error.message);
    }
  } catch (e) {
    throw new CustomError("FIREBASE_ADMIN_ERROR",e.message);
  }
};