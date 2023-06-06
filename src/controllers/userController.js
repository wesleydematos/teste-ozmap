const Router = require("koa-router");
const StatusCodes = require("http-status-codes").StatusCodes;
const { koaBody } = require("koa-body");

const dataSource = require("../config/orm");
const User = require("../entities/user");

var router = new Router();

router
  .get("/", async (ctx) => {
    ctx.body = "Olá mundo!";
  })
  .post("/user", koaBody(), async (ctx) => {
    const { age, name, email } = ctx.request.body;

    if (!age || !name || !email) {
      ctx.throw(
        StatusCodes.BAD_REQUEST,
        "'age', 'email' e 'name' são campos obrigatórios."
      );
    }

    if (age < 18) {
      ctx.throw(
        StatusCodes.BAD_REQUEST,
        "O usuário deve ter a idade maior que 18."
      );
    }

    const userRepository = dataSource.getRepository(User);
    const nameExists = await userRepository.findOneBy({ name: name });

    if (nameExists) {
      ctx.throw(
        StatusCodes.CONFLICT,
        "Nome já cadastrado, o campo deve ser único."
      );
    }

    const user = userRepository.create({
      name: name,
      age: age,
      email: email,
    });

    await userRepository.save(user);

    ctx.body = user;
    ctx.status = StatusCodes.CREATED;
  })
  .get("/users", async (ctx) => {
    const page = Number(ctx.request.query.page) || 1;
    const pageSize = 5;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const userRepository = dataSource.getRepository(User);
    const allUsers = await userRepository.findAndCount();

    let totalPage = allUsers[1] / pageSize;
    totalPage = Math.ceil(totalPage);

    const nextPage =
      page + 1 > totalPage
        ? null
        : `http://localhost:3000/users/?page=${page + 1}`;

    const paginatedUsers = allUsers[0].slice(startIndex, endIndex);

    ctx.status = StatusCodes.OK;
    ctx.body = {
      total: allUsers[1],
      count: page * pageSize > allUsers[1] ? allUsers[1] : page * pageSize,
      nextPage: nextPage,
      rows: paginatedUsers,
    };
  })
  .get("/user/:name", async (ctx) => {
    const name = ctx.params.name;

    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ name: name });

    if (!user) {
      ctx.throw(StatusCodes.NOT_FOUND, "Usuário não encontrado.");
    }

    ctx.body = user;
    ctx.status = StatusCodes.OK;
  })
  .delete("/user/:name", async (ctx) => {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ name: ctx.params.name });

    if (!user) {
      ctx.throw(StatusCodes.NOT_FOUND, "Usuário não encontrado.");
    }

    await userRepository.remove(user);

    ctx.status = StatusCodes.NO_CONTENT;
    ctx.body = null;
  })
  .patch("/user/:name", koaBody(), async (ctx) => {
    const { age, name } = ctx.request.body;

    const userRepository = dataSource.getRepository(User);
    const user = await userRepository
      .findOneByOrFail({ name: ctx.params.name })
      .catch(() => {
        ctx.throw(StatusCodes.NOT_FOUND, "Usuário não encontrado.");
      });

    if (name) {
      const nameExists = await userRepository.findOneBy({
        name: ctx.request.body.name,
      });

      if (nameExists) {
        ctx.throw(
          StatusCodes.CONFLICT,
          "Nome já cadastrado, o campo deve ser único."
        );
      }
    }

    if (age < 18) {
      ctx.throw(
        StatusCodes.BAD_REQUEST,
        "O usuário deve ter a idade maior que 18."
      );
    }

    userRepository.merge(user, ctx.request.body);
    await userRepository.save(user);

    ctx.body = user;
  });

module.exports = router;
