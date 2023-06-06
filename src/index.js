const createServer = require("node:http").createServer;
const gracefulShutdown = require("http-graceful-shutdown");
const Koa = require("koa");
const yamljs = require("yamljs");
const { koaSwagger } = require("koa2-swagger-ui");

const env = require("./config/environment");
const dataSource = require("./config/orm");
const router = require("./controllers/userController");

const app = new Koa();
const server = createServer(app.callback());
const spec = yamljs.load("api.yaml");

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

app.use(router.routes()).use(router.allowedMethods());
app.use(
  koaSwagger({
    routePrefix: "/swagger",
    swaggerOptions: {
      url: "http://localhost:3000/swagger/",
      spec: spec,
    },
  })
);

module.exports = server;
