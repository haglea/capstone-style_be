const badRequestErrorHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    res.status(400).send(err.errors);
  } else {
    next(err);
  }
};

const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res
      .status(401)
      .send({
        status: "error",
        message: err.message || "Please check if your credentials are correct!",
      });
  } else {
    next(err);
  }
};

const forbiddenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res
      .status(403)
      .send({
        status: "error",
        message:
          err.message || "You are not allowed to perform this operation!",
      });
  } else {
    next(err);
  }
};

const notFoundErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res
      .status(404)
      .send(err.message || "The requested resource was not found!");
  } else {
    next(err);
  }
};

const catchAllErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Generic Server Error");
};

const errorHandlers = {
  badRequest: badRequestErrorHandler,
  unauthorized: unauthorizedHandler,
  forbidden: forbiddenHandler,
  notFound: notFoundErrorHandler,
  server: catchAllErrorHandler,
};

export default errorHandlers;
