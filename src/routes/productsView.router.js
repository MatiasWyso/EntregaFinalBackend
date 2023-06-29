import { Router } from "express";
import ProductManager from "../dao/classes/dbManager/ProductManager.js";

const router = Router();
const productManager = new ProductManager();
const url = "http://localhost:8080/products/?";

router.get("/", async (req, res) => {
  const { query, limit = 10, page = 1, sort } = req.query;
  const response = await productManager.getAll(query, limit, page, sort);
  const isLogin = req.session.user ? true : false;
  const user = req.session.user;
  console.log(response);
  let {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    page: resPage,
    totalPages,
  } = response;

  if (hasNextPage)
    nextLink = `${url}${query ? "query=" + query + "&" : ""}${
      "limit=" + limit
    }${"&page=" + (+page + 1)}${sort ? "&sort=" + sort : ""}`;
  if (hasPrevPage)
    prevLink = `${url}${query ? "query=" + query + "&" : ""}${
      "limit=" + limit
    }${"&page=" + (+page - 1)}${sort ? "&sort=" + sort : ""}`;
  if (resPage > totalPages) {
    res.render("products", {
      payload: false,
    });
  } else {
    res.render("products", {
      payload,
      hasNextPage,
      hasPrevPage,
      nextLink,
      prevLink,
      resPage,
      totalPages,
      isLogin,
      user,
    });
  }
});
export default router;
