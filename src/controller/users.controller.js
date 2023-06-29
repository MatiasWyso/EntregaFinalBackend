import jwt from "jsonwebtoken";
import ClientUser from "../dao/dto/ClientUser.js";
import moment from 'moment/moment.js';
import config from "../config/config.js";
import { transport } from "../services/mailling.js";
import CustomError from "../errors/CustomError.js";
import { enumErrors } from "../errors/enumErrors.js";
import { createHash } from "../utils.js";
import UserManager from "../dao/classes/dbManager/UserManager.js";
const um = new UserManager();

const dto = new ClientUser();

export default class UsersController {
  getCurrent = async (req, res) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    res.send(dto.getCurrent(req.user.user));
  };

  getAll = async (req, res, next) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    try {
      let dbUsers = await um.getAll();
      let users = [];
    
      if (Array.isArray(dbUsers)) {
        dbUsers.forEach((user) => users.push(dto.getCurrent(user)));
      } else {
        // Manejar el caso en el que dbUsers no sea un array
        throw new Error('dbUsers is not an array');
      }
    
      res.send({ status: "Ok", payload: users });
    } catch (error) {
      next(error);
    } 
  };

  postSwapRoleForced = async (req, res, next) => {
    try {
      let user = await um.getOne({ email: req.params.uid });

      if (!user)
        return res.send({ status: "error", message: "El usuario no existe" });

      if (user.role == "admin")
        return res.send({
          status: "error",
          message: "No se puede modificar el rol de un usuario administrador",
        });

      if (user.role == "user") user.role = "premium";
      else if (user.role == "premium") user.role = "user";

      let result = await um.editOne(user.email, user);

      if (!result.acknowledged)
        return res.send({ status: "error", message: "Ha ocurrido un error" });

      res.send({
        status: "Ok",
        message: `El usuario ${req.params.uid} ha cambiado a ${user.role}`,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteInactive = async (req, res, next) => {
    try {
      let users = await um.getAll();

      let deleteUsers = [];
      const expirationTime = moment().subtract(2, "days");
      let count = 0;

      users.forEach((user) => {
        if (!user.last_connection) {
          count += 1;
          deleteUsers.push(user.email);
          return;
        }
        let userDate = moment(user.last_connection, "DD/MM/YYYY, hh:mm:ss");
        if (userDate.isBefore(expirationTime) && user.role != "admin") {
          try {
            transport.sendMail({
              from: "matiaswyso@gmail.com",
              to: user.email,
              subject: "Se ha eliminado tu cuenta debido a inactividad",
              text: `Tu cuenta ha sido eliminada`,
            });
          } catch (error) {
            req.logger.error("El mail del usuario no es válido");
          }
          count += 1;
          deleteUsers.push(user.email);
        }
      });

      let deleted = await um.deleteMany(deleteUsers);

      if (deleted.length < 1)
        return res.send({
          status: "Ok",
          message: `${count} cuentas fueron eliminadas con los mails ${deleteUsers}`,
        });
      res.send({
        status: "error",
        message: `Las cuentas con los mails ${deleted} no han podido eliminarse`,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    let user = await um.getOne({ email: req.params.uid });

    if (!user)
      return res.send({ status: "error", message: "El usuario no existe" });

    if (user.role == "admin")
      return res.send({
        status: "error",
        message: "No se puede eliminar a un administrador",
      });

    let result = await um.deleteOne(user.email);

    if (result.acknowledged) {
      try {
        transport.sendMail({
          from: "matiaswyso@gmail.com",
          to: user.email,
          subject: "Se ha eliminado tu cuenta debido a inactividad",
          html: `Tu cuenta ha sido eliminada`,
        });
      } catch (error) {
        req.logger.error("El mail del usuario no es válido");
      }

      return res.send({
        status: "Ok",
        message: `El usuario ${req.params.uid} fue eliminado`,
      });
    }

    res.send({ status: "error", message: "El usuario no fue eliminado" });
  };
}
