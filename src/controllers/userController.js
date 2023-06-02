require("dotenv/config");
const Router = require("koa-router");
const dataSource = require("../config/orm");
const User = require("../entities/user");

const PORT = process.env.PORT || 3000;

var router = new Router();

router.get("/", async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`;
});

router.get("/users", async (ctx) => {
  const userRepository = dataSource.getRepository(User);
  const users = await userRepository.findAndCount();

  ctx.status = 200;
  ctx.body = { users: users[0], rows: users[1] };
});

module.exports = router;
