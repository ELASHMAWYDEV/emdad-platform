import Ajv from "ajv";
import AjvError from "../errors/AjvError";
import localize from "ajv-i18n";
import { Languages } from "types";

const ajv = new Ajv({ allErrors: true, messages: false });

const validateSchema =
  (schema: object, lang: Languages = Languages.AR) =>
  (func: Function) =>
  async (args) => {
    const validate = ajv.compile(schema);
    const valid = validate(args);

    if (!valid) {
      localize[lang](validate.errors);
      console.log(valid, args, validate.errors);
      throw new AjvError(validate.errors);
    }
    return func(args);
  };

export { validateSchema };
