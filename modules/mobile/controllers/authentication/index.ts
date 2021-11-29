const login = (req, res, next) => {
  try {
    throw Error("Something wrong happened");
  } catch (e) {
    next(e);
  }
};

const register = (req, res, next) => {};

export { login, register };
