import { supportedLanguages } from "models/constants";

interface Constant {
  [key: string]: string;
}

enum Languages {
  EN = supportedLanguages.EN,
  AR = supportedLanguages.AR,
}

export { Constant, Languages };
