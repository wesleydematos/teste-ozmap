const ReasonPhrases = require("http-status-codes").ReasonPhrases;
const StatusCodes = require("http-status-codes").StatusCodes;

const Joi = require("koa-joi-router").Joi;

const errorResponse = Joi.object({
  reason: Joi.string()
    .required()
    .example(ReasonPhrases.BAD_REQUEST)
    .description("Razão pela qual a request falhou."),
  statusCode: Joi.number()
    .min(400)
    .max(599)
    .required()
    .example(StatusCodes.BAD_REQUEST)
    .description("HTTP status code."),
  message: Joi.string()
    .required()
    .description("Mensagem de erro explicando a falha."),
  details: Joi.object()
    .optional()
    .description(
      "Em caso de erro de validação, este objeto mostrará o erro por campo."
    ),
})
  .strict()
  .description("Resposta de erro.");

module.exports = errorResponse;
