const Router = require("koa-router");
const dataSource = require("../config/orm");
const User = require("../entities/user");
const StatusCodes = require("http-status-codes").StatusCodes;
const { koaBody } = require("koa-body");

var router = new Router();

router
  .get("/", async (ctx) => {
    ctx.body = "Olá mundo!";
  })
  .post("/user", koaBody(), async (ctx) => {
    const userRepository = dataSource.getRepository(User);
    //verificar se é maior de idade
    //verificar se email já foi cadastrado
    const user = userRepository.create({
      ...ctx.request.body,
    });

    await userRepository.save(user);

    ctx.status = StatusCodes.CREATED;
  })
  .get("/users", async (ctx) => {
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.findAndCount();

    ctx.status = 200;
    ctx.body = { users: users[0], rows: users[1] };
  })
  .delete("/user/:id", async (ctx) => {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: ctx.params.id });

    if (!user) {
      ctx.status = StatusCodes.NOT_FOUND;
      ctx.body = { mensagem: "Usuário não encontrado." };

      return;
    }

    await userRepository.remove(user);

    ctx.status = StatusCodes.NO_CONTENT;
    ctx.body = null;
  });

module.exports = router;
