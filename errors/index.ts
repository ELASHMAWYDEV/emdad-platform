const statuses = {
  OK: 200,
};

const errorCodes = Object.freeze({
  UNKOWN_ERROR: "UNKOWN_ERROR",
  EMPTY_FIELD: "EMPTY_FIELD",
  WRONG_LOGIN_CREDENTIALS: "WRONG_LOGIN_CREDENTIALS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
});

const errors = Object.freeze({
  [errorCodes.UNKOWN_ERROR]: {
    status: statuses.OK,
    message: "حدث خطأ غير معروف ، يرجي اعادة المحاولة",
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
});

export { errorCodes, errors };
