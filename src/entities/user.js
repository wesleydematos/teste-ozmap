var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    name: {
      type: "text",
    },
    email: {
      type: "text",
    },
    age: {
      type: "integer",
    },
  },
});
