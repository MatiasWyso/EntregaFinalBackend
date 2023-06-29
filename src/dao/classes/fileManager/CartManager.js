import fs from "fs";
import { faker } from "@faker-js/faker";
import ProductManager from "./ProductManager.js";
const pm = new ProductManager();
export default class CartsManager {
  constructor() {
    this.path = "src/dao/classes/fileManager/carts.json";
  }

  async post() {
    const carts = await this.getAll();
    if (carts.error) return carts;
    const newCart = { id: faker.database.mongodbObjectId(), products: [] };
    carts.push(newCart);
    return await this.writeFile(carts);
  }

  async getAll() {
    try {
      const document = await fs.promises.readFile(this.path);
      const carts = JSON.parse(document);
      return carts;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = carts.find((dbCart) => dbCart.id === id);
      if (!cart) return { status: 404, error: "Cart not found" };
      return cart;
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async postProductToCart(cid, pid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      const productFinded = cart.products.find(
        (dbProduct) => dbProduct.id === pid
      );
      if (productFinded) {
        const productIndex = cart.products.findIndex(
          (dbProduct) => dbProduct.id === pid
        );
        productFinded.quantity++;
        cart.products.splice(productIndex, 1, productFinded);
        carts.splice(cartIndex, 1, cart);
        await this.writeFile(carts);
        return {
          status: "Success",
          message: "Quantity of product icreased successfully",
        };
      }
      const getProduct = await pm.getById(pid);
      if (getProduct.error) return getProduct;
      cart.products.push({ id: pid, quantity: 1 });
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return { status: "success", message: "Product posted successfully" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteProductToCart(cid, pid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.find((dbCart) => dbCart.id === cid);
      const product = cart.products.find((dbProduct) => dbProduct.id === pid);
      if (!product) return { status: 404, error: "Product not found" };
      const productIndex = cart.products.findIndex(
        (dbProduct) => dbProduct.id === pid
      );
      cart.products.splice(productIndex, 1);
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return { status: "Ok", message: "Product removed from cart succesfully" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
      return { status: "Ok", message: "Added successfully" };
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of write the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }
}
