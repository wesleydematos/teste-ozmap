const DataSource = require("typeorm").DataSource;

const env = require("./environment");
const User = require("../entities/user");

const options = {
  type: "sqlite",
  database: env.isTest ? "dbtest.sqlite" : "database.sqlite",
  synchronize: true,
  entities: [User],
};

const dataSource = new DataSource(options);

module.exports = dataSource;
