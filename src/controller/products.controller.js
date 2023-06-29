import { ProductsService } from "../dao/repositories/index.js";
import CustomError from "../errors/CustomError.js";
import { enumErrors } from "../errors/enumErrors.js";

export const post = async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    )
      CustomError.create({
        name: "Error al cargar producto",
        message: "Complete toda la informacion requerida",
        cause: "Incomplete required inputs",
        code: enumErrors.MISSING_VALUES,
        statusCode: 400,
      });

    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    const postResponse = await ProductsService.post(product);
    if (postResponse.error)
      CustomError.create({ code: enumErrors.ERROR_FROM_SERVER });

    return res.status(201).send(postResponse);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    let { query, limit, page, sort } = req.query;
    if (limit) limit = +limit;
    if (page) page = +page;
    if (sort) sort = +sort;

    const getResponse = await ProductsService.getAll(query, limit, page, sort);
    if (getResponse.error)
      CustomError.create({ code: enumErrors.ERROR_FROM_SERVER });

    return res.status(200).json(getResponse);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const getResponse = await ProductsService.getById(id);

    if (getResponse.error)
      CustomError.create(
        getResponse.status === 404
          ? {
              name: `Error al obtener el producto: ${id}`,
              message: `No existe el Producto`,
              cause: "Product not found",
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

export const putById = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (
      !title &&
      !description &&
      !code &&
      !price &&
      !status &&
      !category &&
      !thumbnails
    )
      CustomError.create({
        name: "Error al cargar el producto",
        message: "Complete los parametros requeridos",
        cause: "Incomplete required inputs",
        code: enumErrors.MISSING_VALUES,
        statusCode: 400,
      });
    const object = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    const putResponse = await ProductsService.putById(id, object);
    if (putResponse.error)
      CustomError.create({ code: enumErrors.ERROR_FROM_SERVER });

    return res.send(putResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const deleteResponse = await ProductsService.deleteById(id);
    if (deleteResponse.error)
      CustomError.create({ code: enumErrors.ERROR_FROM_SERVER });

    return res.send(deleteResponse);
  } catch (error) {
    next(error);
  }
};
