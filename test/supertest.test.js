import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";

import cartModel from "../src/dao/models/cart.model.js";
import userModel from "../src/dao/models/users.model.js";
import productsModel from "../src/dao/models/products.model.js";

import config from "../src/config/config.js";


const expect = chai.expect;
const PORT = config.port;
const requester = supertest(`http://localhost:${PORT}`);

const user = {
  first_name: "Gustavo",
  last_name: "Colombini",
  email: "ga.colombini@gmail.com",
  password: "1111",
};

describe("Pruebas con supertest", () => {
  const user = {
    first_name: "Gustavo",
    last_name: "Colombini",
    email: "ga.colombini@gmail.com",
    password: "1111",
  };

  const product = {
    title: "Producto2",
    description: "Segundo producto",
    price: 200,
    stock: 20,
    code: "abc2",
  };

  let coderCookie;
  let oldUser;
  let pid;
  let cid;

  before(async function () {
    await mongoose.connect(config.mongoUrl);
    await cartModel.deleteMany({});
    await productsModel.deleteMany({});
    await userModel.deleteMany({});
  });

  describe("Pruebas para cart", () => {
    // GET Add product Delete product
    it(`Testing de obtencion de carrito por ID - ${requester}/api/cart/:cid`, async () => {
        const {statusCode, ok, _body} = await requester.get(
          `/api/cart/${cartId}`
        );
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body.payload).to.be.an.instanceof(Array);
      });
    it("1.1. GET /api/cart", async () => {
      const response = await requester.get("/api/cart");
      expect(response._body).to.have.property("status").to.be.eql("Ok");
      expect(response._body).to.have.property("payload").to.be.a("array");
    });

    it("1.2. PUT /api/cart/:cid", async () => {
      await productsModel.updateOne(
        { _id: pid },
        { $set: { owner: "123@gmail.com" } }
      );

      const response = await requester
        .put(`/api/cart/${cid}`)
        .send([{ _id: pid, quantity: 1 }])
        .set("Cookie", [coderCookie]);

      expect(response._body).to.have.property("acknowledged").to.be.true;
      expect(response._body).to.have.property("modifiedCount").to.be.eql(1);
    });

    it("1.3. DELETE /api/cart/:cid/products/:pid", async () => {
      const response = await requester
        .delete(`/api/cart/${cid}/product/${pid}`)
        .set("Cookie", [coderCookie]);

      expect(response._body).to.have.property("status").to.be.eql("Ok");
      expect(response._body)
        .to.have.property("payload")
        .to.have.property("acknowledged").to.be.true;
      expect(response._body)
        .to.have.property("payload")
        .to.have.property("modifiedCount")
        .to.be.eql(1);
    });
  });

  describe("Pruebas para products", () => {
    it("2.1. GET /api/products", async () => {
      const response = await requester.get("/api/products");

      expect(response._body).to.have.property("status").to.be.eql("Ok");
      expect(response._body)
        .to.have.property("totalPages")
        .to.be.greaterThanOrEqual(1);
    });

    it("2.2. POST /api/products/", async () => {
      const response = await requester
        .post("/api/products/")
        .send(product)
        .set("Cookie", []);

      expect(response._body).to.have.property("status").to.be.eql("error");
      expect(response._body).to.not.have.property("payload");
    });

    it("2.3. DELETE /api/products/:pid", async () => {
      const response = await requester
        .del(`/api/products/${pid}`)
        .set("Cookie", [coderCookie]);

      expect(response._body.status).to.be.eql("Ok");
      expect(response._body.payload).to.have.property("acknowledged").to.be
        .true;
      expect(response._body.payload)
        .to.have.property("deletedCount")
        .to.be.eql(1);
    });

    describe("Pruebas para session", () => {
      it("3.1. POST /api/session/register", async () => {
        const response = await requester
          .post("/api/session/register")
          .send(user);

        expect(response._body.status).to.eql("Ok");
        expect(response._body.message)
          .to.have.property("cart")
          .to.have.length(24);
      });

      it("3.2. POST /api/session/login", async () => {
        const response = await requester
          .post("/api/session/login")
          .send({ email: user.email, password: user.password });

        coderCookie = response.headers["set-cookie"][0];

        expect(response._body.status).to.eql("Ok");
        expect(response.headers)
          .to.have.property("set-cookie")
          .to.have.length(1);

        cid = response._body.payload.cart[0];
      });

      it("3.3. GET /api/session/current", async () => {
        const response = await requester
          .get("/api/session/current")
          .set("Cookie", [coderCookie]);

        expect(response._body).to.have.property("first_name");
        expect(response._body).to.have.property("last_name");
        expect(response._body).to.have.property("email");
        expect(response._body).to.have.property("role");

        oldUser = response._body;
      });
    });
  });
});
