//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app = require("../src/index.js");

const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiJson = require("chai-json-schema");

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
  title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
  type: "object",
  required: ["name", "email", "age"],
  properties: {
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    age: {
      type: "number",
      minimum: 18,
    },
  },
};

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe("Um simples conjunto de testes", function () {
  it("deveria retornar -1 quando o valor não esta presente", function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

//testes da aplicação
describe("Testes da aplicaçao", () => {
  it("o servidor esta online", function (done) {
    chai
      .request(app)
      .get("/")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("deveria ser uma lista vazia de usuarios", function (done) {
    chai
      .request(app)
      .get("/users")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
      });
  });

  it("deveria criar o usuario raupp", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "raupp", email: "jose.raupp@devoz.com.br", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  //Criando 5 usuários para popular o db
  it("deveria criar o usuario 1", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "usuario1", email: "usuario1@mail.com", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("deveria criar o usuario 2", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "usuario2", email: "usuario2@mail.com", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("deveria criar o usuario 3", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "usuario3", email: "usuario3@mail.com", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("deveria criar o usuario 4", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "usuario4", email: "usuario4@mail.com", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("deveria criar o usuario 5", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "usuario5", email: "usuario5@mail.com", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });
  //

  it("não deveria ser possivel criar o usuario com idade menor que 18", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "menordeidade", email: "menordeidade@mail.com", age: 17 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.jsonSchema({
          mensagem: "O usuário deve ter a idade maior que 18.",
        });
        done();
      });
  });

  it("não deveria ser possivel criar o usuario com nome repetido.", function (done) {
    chai
      .request(app)
      .post("/user")
      .send({ name: "raupp", email: "jose.raupp@devoz.com.br", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(409);
        expect(res.body).to.be.jsonSchema({
          mensagem: "Nome já cadastrado, o campo deve ser único.",
        });
        done();
      });
  });

  it("o usuario naoExiste não existe no sistema", function (done) {
    chai
      .request(app)
      .get("/user/naoExiste")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.body).to.be.jsonSchema({
          mensagem: "Usuário não encontrado.",
        });
        expect(res).to.have.status(404);
        done();
      });
  });

  it("o usuario raupp existe e é valido", function (done) {
    chai
      .request(app)
      .get("/user/raupp")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it("deveria excluir o usuario raupp", function (done) {
    chai
      .request(app)
      .delete("/user/raupp")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        expect(res.body).to.be.jsonSchema({});
        done();
      });
  });

  it("o usuario raupp não deve existir mais no sistema", function (done) {
    chai
      .request(app)
      .get("/user/raupp")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.be.jsonSchema({
          mensagem: "Usuário não encontrado.",
        });
        done();
      });
  });

  it("deveria ser uma lista com pelomenos 5 usuarios", function (done) {
    chai
      .request(app)
      .get("/users")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.total).to.be.at.least(5);
        done();
      });
  });
});
