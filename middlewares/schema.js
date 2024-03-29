const Ajv = require("ajv");
const AjvError = require("../errors/AjvError");
const localize = require("ajv-i18n");
const addFormat = require("ajv-formats");
const { supportedLanguages } = require("../models/constants");

const ajv = new Ajv({
  allErrors: true,
  messages: false,
  strict: false,
});
addFormat(ajv);

const validateSchema =
  (schema, lang = supportedLanguages.AR) =>
  (func) =>
  async (args) => {
    const validate = ajv.compile(schema);
    const valid = validate(args);

    if (!valid) {
      localize[lang](validate.errors);
      throw new AjvError(validate.errors);
    }
    return func(args);
  };

module.exports = {
  validateSchema,
};
