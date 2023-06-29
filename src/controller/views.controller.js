import {ProductsService, CartsService} from "../dao/repositories/index.js";

export const home = async (req, res, next) => {
  try {
    const isLogin = req.cookies["coderCookieToken"] ? true : false;
    res.render("home", {isLogin});
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const isLogin = req.cookies["coderCookieToken"] ? true : false;
    res.render("chat", {isLogin});
  } catch (error) {
    next(error);
  }
};

export const products = async (req, res, next) => {
  try {
    const isLogin = req.cookies["coderCookieToken"] ? true : false;
    const user = req.user;
    const {query, limit, page, sort} = req.query;
    const response = await ProductsService.getAll(query, limit, page, sort);
    let {
      payload,
      hasNextPage,
      hasPrevPage,
      nextLink,
      prevLink,
      page: resPage,
    } = response;
    if (hasNextPage)
      nextLink = `http://localhost:8080/products/?${
        query ? "query=" + query + "&" : ""
      }${"limit=" + limit}${"&page=" + (+resPage + 1)}${
        sort ? "&sort=" + sort : ""
      }`;
    if (hasPrevPage)
      prevLink = `http://localhost:8080/products/?${
        query ? "query=" + query + "&" : ""
      }${"limit=" + limit}${"&page=" + (+resPage - 1)}${
        sort ? "&sort=" + sort : ""
      }`;
    return res.render("products", {
      payload,
      hasNextPage,
      hasPrevPage,
      nextLink,
      prevLink,
      resPage,
      isLogin,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const cart = async (req, res, next) => {
  try {
    const id = req.user.cartId;
    const cart = await CartsService.getById(id);
    if (cart.error) return res.status(cart.error).send(cart);
    return res.render("cart", {cart, isLogin: true});
  } catch (error) {
    next(error);
  }
};

export const register = (req, res, next) => {
  try {
    return res.render("register", {});
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  try {
    return res.render("login", {});
  } catch (error) {
    next(error);
  }
};

export const recover = (req, res) => {
  try {
    return res.render("recover", {});
  } catch (error) {
    next(error);
  }
};

export const recoverPassword = (req, res, next) => {
  try {
    return res.render("recoverPassword", {});
  } catch (error) {
    next(error);
  }
};

export const profile = (req, res, next) => {
  try {
    return res.render("profile", {isLogin: true});
  } catch (error) {
    next(error);
  }
};

export const loggerTest = (req, res, next) => {
  try {
    req.logger.fatal("Fatal test");
    req.logger.error("Error test");
    req.logger.warning("Warning test");
    req.logger.info("Info test");
    req.logger.http("Http test");
    req.logger.debug("Debug test");
    return res.send({status: 200, message: "Logger test"});
  } catch (error) {
    next(error);
  }
};
