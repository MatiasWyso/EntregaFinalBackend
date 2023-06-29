import fs from "fs";
import { faker } from "@faker-js/faker";

export default class ProductManager {
  constructor() {
    this.path = "src/dao/classes/fileManager/products.json";
  }

  async getAll(query, limit = 10, page = 1, sort) {
    try {
      const document = await fs.promises.readFile(this.path);
      let products = JSON.parse(document);
      const quantityOfProducts = products.length;
      const totalPages = Math.floor(quantityOfProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page - totalPages ? true : false;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;
      let nextLink;
      let prevLink;
      if (hasNextPage)
        nextLink = `http://localhost:8080/api/products/?${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page + 1)}${
          sort ? "&sort=" + sort : ""
        }`;
      if (hasPrevPage)
        result.prevLink = `http://localhost:8080/api/products/?${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page - 1)}${
          sort ? "&sort=" + sort : ""
        }`;
      if (query) {
        query = JSON.parse(query);
        for (const prop in query) {
          products = products.filter(
            (product) => product[prop] === query[prop]
          );
        }
      }
      if (page > 1) products.splice(0, limit * page - 1);
      if (limit && limit <= products.length) products.length = limit;

      return {
        status: "success",
        payload: products,
        totalDocs: quantityOfProducts,
        limit,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async post(product) {
    try {
      const getResponse = await this.getAll();
      if (getResponse.error) return getResponse;
      const products = getResponse.payload;
      console.log(products);
      const existProduct = products.find(
        (dbProduct) => dbProduct.code === product.code
      );
      if (existProduct)
        return {
          status: 400,
          error: `Product with code ${product.code} already exist`,
        };
      product.id = faker.database.mongodbObjectId();
      products.push(product);
      await this.writeFile(products);
      return {
        status: "success",
        payload: product,
        message: "Product posted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        error: "Error from server",
      };
    }
  }

  async getById(id) {
    try {
      const getResponse = await this.getAll();
      if (getResponse.error) return getResponse;
      const products = getResponse.payload;
      const productFinded = products.find((product) => product.id === id);
      return productFinded
        ? productFinded
        : { status: 404, error: "Product not found" };
    } catch (error) {
      return { status: 500, error: "Error from server" };
    }
  }

  async putById(id, object) {
    try {
      const getResponse = await this.getAll();
      if (getResponse.error) return getResponse;
      const products = getResponse.payload;
      const product = products.find((dbProduct) => dbProduct.id === id);
      if (!product) return { status: 404, error: "Product not found" };
      const productIndex = products.findIndex(
        (dbProduct) => dbProduct.id === id
      );
      for (const prop in object) {
        if (object[prop]) product[prop] = object[prop];
      }
      products.splice(productIndex, 1, product);
      await this.writeFile(products);
      return {
        status: "Ok",
        message: "Product updated successfully",
        payload: product,
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteById(id) {
    try {
      const getResponse = await this.getAll();
      if (getResponse.error) return getResponse;
      const products = getResponse.payload;
      const product = products.find((product) => product.id === id);
      if (!product) return { status: 404, error: "Product not found" };
      const productIndex = products.findIndex(
        (dbProduct) => dbProduct.id === id
      );
      products.splice(productIndex, 1);
      await this.writeFile(products);
      return { status: "Ok", message: "Product deleted successfully" };
    } catch (error) {
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
