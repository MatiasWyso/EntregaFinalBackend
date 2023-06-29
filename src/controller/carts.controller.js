import { CartsService } from "../dao/repositories/index.js";
import CustomError from "../errors/CustomError.js";
import { enumErrors } from "../errors/enumErrors.js";

export const getAll = async (req, res) => {
  try {
    const getResponse = await CartsService.getAll();
    if (getResponse.error)
      CustomError.create({ code: enumErrors.ERROR_FROM_SERVER });
    return res.send(getResponse);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = req.params.cid;
    const getResponse = await CartsService.getById(id);
    if (getResponse.error)
      CustomError.create(
        getResponse.status === 404
          ? {
              name: `Error al buscar: ${id}`,
              message: `No existe el carrrito buscado`,
              cause: "Cart not found",
              code: enumErrors.NOT_FOUND,
              statusCode: 404,
            }
          : { code: enumErrors.ERROR_FROM_SERVER }
      );

    return res.send(getResponse);
  } catch (error) {
    next(error);
  }
};

export const post = async (req, res, next) => {
  try {
    const postResponse = await CartsService.post();

    if (postResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(postResponse);
  } catch (error) {
    next(error);
  }
};

export const postProductToCart = async (req, res, next) => {
  try {
    const {cid, pid} = req.params;
    const postResponse = await CartsService.postProductToCart(cid, pid);

    if (postResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(postResponse);
  } catch (error) {
    next(error);
  }
};

export const putProducts = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const products = req.body;

    if (!Array.isArray(products))
      CustomError.create({
        name: "Error al actualizar el carrito",
        message: "Se requiere un array de productos",
        cause: "Not array received",
        code: enumErrors.UNEXPECTED_VALUE,
        statusCode: 400,
      });

    const putResponse = await CartsService.putProducts(cid, products);

    if (putResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(putResponse);
  } catch (error) {
    next(error);
  }
};

export const putProductQuantity = async (req, res, next) => {
  try {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    if (typeof quantity !== "number")
      CustomError.create({
        name: "Error al actualizar cantidad en el carrito",
        message: "Se requiere un numero valido de productos",
        cause: "Not number received",
        code: enumErrors.UNEXPECTED_VALUE,
        statusCode: 400,
      });

    const putResponse = await CartsService.putProductQuantity(
      cid,
      pid,
      quantity
    );

    if (putResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(putResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteProductToCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deleteResponse = await CartsService.deleteProductToCart(cid, pid);

    if (deleteResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(deleteResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const deleteResponse = await CartsService.deleteProducts(cid);

    if (deleteResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(deleteResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const deleteResponse = await CartsService.deleteById(cid);

    if (deleteResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(deleteResponse);
  } catch (error) {
    next(error);
  }
};

export const purchase = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const purchaseResponse = await CartsService.purchase(cid);

    if (purchaseResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(purchaseResponse);
  } catch (error) {
    next(error);
  }
};