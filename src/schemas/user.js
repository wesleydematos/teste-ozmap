const Joi = require("koa-joi-router").Joi;

const name = Joi.string()
  .required()
  .description("Nome do usuário.")
  .example("Wesley Matos");

const email = Joi.string()
  .email()
  .lowercase()
  .required()
  .description("Email do usuário.")
  .example("wesley@mail.com");

const age = Joi.number().required().description("Idade do usuário").example(18);

const createUser = Joi.object({
  name,
  email,
  age,
}).description("Cria um novo usuário.");

const user = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .description("Identificador do usuário.")
    .example(1),
  name,
  email,
  age,
})
  .options({ stripUnknown: true })
  .description("Dados do usuário.");

const updateUser = Joi.object({
  name,
  email,
  age,
}).description("Dados atualizados do usuário.");

module.exports = { createUser, user, updateUser };
