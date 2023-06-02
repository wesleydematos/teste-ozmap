const isHttpError = require("http-errors").isHttpError;

const getReasonPhrase = require("http-status-codes").getReasonPhrase;
const StatusCodes = require("http-status-codes").StatusCodes;

const Joi = require("koa-joi-router").Joi;

const errorHandler = async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.status = isHttpError(error)
      ? error.status
      : StatusCodes.INTERNAL_SERVER_ERROR;
    const response = {
      reason: getReasonPhrase(context.status),
      message: error instanceof Error ? error.message : String(error),
      statusCode: context.status,
    };

    if (Joi.isError(error)) {
      const details = {};

      for (const { path, message } of error.details) {
        details[path.join(".")] = message;
      }

      response.details = details;
    }

    context.body = response;
  }
};

module.exports = errorHandler;
