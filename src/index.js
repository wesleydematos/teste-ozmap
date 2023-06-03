//imports necessários para configuração do servidor
const createServer = require("node:http").createServer;
const gracefulShutdown = require("http-graceful-shutdown");
const env = require("./config/environment");
const dataSource = require("./config/orm");

const bodyParser = require("koa-bodyparser");

//importando o Koa
const Koa = require("koa");

//importando as rotas
const router = require("./controllers/userController");

//instanciando o Koa
const app = new Koa();

//criando um servidor
const server = createServer(app.callback());

//inicializando o servidor
void (async (server) => {
  try {
    await dataSource.initialize();

    server.listen(env.PORT, () => {
      console.info(`Listening at http://localhost:${env.PORT || 3000}`);
      console.log("Press Ctrl-C to shutdown");
    });

    gracefulShutdown(server, {
      development: env.isDevelopment,
      onShutdown: async () => {
        await dataSource.destroy();
      },
      finally: () => {
        console.info("Server graceful shut down completed.");
      },
    });
  } catch (error) {
    console.error("Unable to run the server because of the following error:");
    console.error(error);
    process.exitCode = 1;
  }
})(server);

//indicando os metodos e rotas utilizados pela aplicação
app.use(router.routes()).use(router.allowedMethods());

app.use(bodyParser());

// exportando servidor
module.exports = server;
