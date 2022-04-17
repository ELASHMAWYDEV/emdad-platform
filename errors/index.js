const statuses = {
  OK: 200,
};

const errorCodes = Object.freeze({
  UNKOWN_ERROR: "UNKOWN_ERROR",
  UNAUTHURIZED: "UNAUTHURIZED",
  EMPTY_FIELD: "EMPTY_FIELD",
  WRONG_LOGIN_CREDENTIALS: "WRONG_LOGIN_CREDENTIALS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATION_ERROR: "DUPLICATION_ERROR",
  USER_HAS_NO_PHONE: "USER_HAS_NO_PHONE",
  USER_HAS_NO_EMAIL: "USER_HAS_NO_EMAIL",
  OTP_INCORRECT: "OTP_INCORRECT",
  PROFILE_ALREADY_COMPLETED: "PROFILE_ALREADY_COMPLETED",
  OLD_PASSWORD_INCORRECT: "OLD_PASSWORD_INCORRECT",
  PASSWORD_NOT_MATCH: "PASSWORD_NOT_MATCH",
  PASSWORD_NOT_CORRECT: "PASSWORD_NOT_CORRECT",
  EMAIL_NOT_CORRECT: "EMAIL_NOT_CORRECT",
  EMAIL_DID_NOT_CHANGE: "EMAIL_DID_NOT_CHANGE",
  NO_SUPPLIERS_FOUND: "NO_SUPPLIERS_FOUND",
  NO_SETTINGS_FOUND: "NO_SETTINGS_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  NO_IMAGES_UPLOADED: "NO_IMAGES_UPLOADED",
  IMAGE_TYPE_NOT_SUPPORTED: "IMAGE_TYPE_NOT_SUPPORTED",
});

const errors = Object.freeze({
  [errorCodes.UNKOWN_ERROR]: {
    status: statuses.OK,
    message: "حدث خطأ غير معروف ، يرجي اعادة المحاولة",
  },
  [errorCodes.UNAUTHURIZED]: {
    status: statuses.OK,
    message: "يجب تسجيل الدخول أولا",
  },
  [errorCodes.EMPTY_FIELD]: {
    status: statuses.OK,
    message: "من فضلك لا تترك هذه الحقول فارغة",
  },
  [errorCodes.WRONG_LOGIN_CREDENTIALS]: {
    status: statuses.OK,
    message: "بعض المعلومات التي أدخلتها خاطئة ، يرجي اعادة المحاولة",
  },
  [errorCodes.VALIDATION_ERROR]: {
    status: statuses.OK,
    message: "بعض الحقول التي ارسلتها بها مشاكل ، يرجي اعادة المحاولة",
  },
  [errorCodes.DUPLICATION_ERROR]: {
    status: statuses.OK,
    message: "هذه البيانات مسجلة من قبل",
  },
  [errorCodes.USER_HAS_NO_PHONE]: {
    status: statuses.OK,
    message: "ليس لديك اي ارقام جوال مسجلة لدينا",
  },
  [errorCodes.USER_HAS_NO_EMAIL]: {
    status: statuses.OK,
    message: "ليس لديك اي ايميلات مسجلة لدينا",
  },
  [errorCodes.OTP_INCORRECT]: {
    status: statuses.OK,
    message: "الرقم الذي ادخلته غير صحيح",
  },
  [errorCodes.PROFILE_ALREADY_COMPLETED]: {
    status: statuses.OK,
    message: "لقد اكملت الملف الشخصي من قبل ، قم بتسجيل الدخول مرة أخري",
  },
  [errorCodes.OLD_PASSWORD_INCORRECT]: {
    status: statuses.OK,
    message: "كلمة المرور القديمة غير صحيحة",
  },
  [errorCodes.PASSWORD_NOT_MATCH]: {
    status: statuses.OK,
    message: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
  },
  [errorCodes.PASSWORD_NOT_CORRECT]: {
    status: statuses.OK,
    message: "كلمة المرور غير صحيحة",
  },
  [errorCodes.EMAIL_NOT_CORRECT]: {
    status: statuses.OK,
    message: "البريد الالكتروني الذي ادخلته غير صحيح",
  },
  [errorCodes.EMAIL_DID_NOT_CHANGE]: {
    status: statuses.OK,
    message: "لم تقم بعمل أي تغيير علي البريد الالكتروني القديم",
  },
  [errorCodes.NO_SUPPLIERS_FOUND]: {
    status: statuses.OK,
    message: "لا يوجد موردين",
  },
  [errorCodes.NO_SETTINGS_FOUND]: {
    status: statuses.OK,
    message: "لا يوجد اعدادات في المنصة ، يرجي التواصل مع الدعم الفني",
  },
  [errorCodes.PRODUCT_NOT_FOUND]: {
    status: statuses.OK,
    message: "لم نتمكن من ايجاد المنتج الذي تبحث عنه",
  },
  [errorCodes.NO_IMAGES_UPLOADED]: {
    status: statuses.OK,
    message: "لم تقم برفع اي صور",
  },
  [errorCodes.IMAGE_TYPE_NOT_SUPPORTED]: {
    status: statuses.OK,
    message: "يجب أن يكون امتداد الصور png أو jpeg أو jpg فقط",
  },
});

module.exports = {
  errorCodes,
  errors,
};
