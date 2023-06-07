require("dotenv/config");
const process = require("node:process");
const envalid = require("envalid");

const secretKey = process.env.SECRET_KEY;

const environment = envalid.cleanEnv(process.env, {
  NODE_ENV: envalid.str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: envalid.port({ default: 3000 }),
  SECRET: envalid.str({
    example: "must-be-a-very-long-string-at-least-32-chars",
    desc: "The secret to sign the JSON Web Tokens",
    default: secretKey,
  }),
});

module.exports = environment;
