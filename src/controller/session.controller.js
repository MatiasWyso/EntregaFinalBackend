import jwt from "jsonwebtoken";
import ClientUser from "../dao/dto/ClientUser.js";

import config from "../config/config.js";
import { transport } from "../services/mailling.js";
import CustomError from "../errors/CustomError.js";
import { enumErrors } from "../errors/enumErrors.js";
import { createHash } from "../utils.js";
import userManager from "../dao/classes/dbManager/UserManager.js";
const um = new userManager();

const dto = new ClientUser();

export default class SessionController {
  getCurrent = async (req, res) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    res.send(dto.getCurrent(req.user.user));
  };

  postRegister = async (req, res, next) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    try {
      try {
        await transport.sendMail({
          from: "matiaswyso@gmail.com",
          to: req.user.email,
          subject: "Se ha creado una cuenta en Ecommerce Coder",
          text: `Bienvenido a Ecommerce Coder`,
        });
      } catch {}

      return res.status(200).send({ status: "Ok", message: req.newUser });
    } catch (error) {
      next(error);
    }
  };

  postLogin = async (req, res, next) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    try {
      const user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
        email: req.user.email,
        cart: req.user.cart,
      };

      let token = jwt.sign({ user }, config.cookieSecret, { expiresIn: "24h" });

      await um.editLastConnection(user, new Date().toLocaleString());

      return res
        .cookie("coderCookieToken", token, {
          maxAge: 1000 * 60 * 24,
          httpOnly: true,
        })
        .send({ status: "Ok", message: "Logged in", payload: user });
    } catch (error) {
      next(error);
    }
  };

  postLogout = async (req, res, next) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    try {
      res.clearCookie("coderCookieToken");
      return res.send({ status: "Ok", message: "Logged out" });
    } catch (error) {
      next(error);
    }
  };

  postRecover = async (req, res, next) => {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );
    req.logger.debug("Entre al recover");
    try {
      let email = req.user.email;
      let token = jwt.sign({ email }, config.cookieSecret, { expiresIn: "1h" });
      req.logger.debug("Pre nodemailer");
      try {
        transport.sendMail({
          from: "matiaswyso@gmail.com",
          to: email,
          subject: "Reestablece tu contraseña",
          html: `
                <div>
                <h1>Para reestablecer tu contraseña haz click <a href="http://localhost:8080/recoverLanding/${token}">aqui</a></h1>
                </div>
                `,
        });
      } catch (error) {
        return res.send({ status: "error", message: "El email es inválido" });
      }
      res.send({ status: "Ok", message: "email enviado" });
    } catch (error) {
      next(error);
    }
  };

  postRecoverPassword = async (req, res, next) => {
    try {
      req.logger.http(
        `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
      );

      let account = req.account;
      let password = req.password;

      account.password = createHash(password);

      let result = await um.editOne(account.email, account);

      if (result.acknowledged)
        res.send({ status: "Ok", message: "Contraseña cambiada" });
    } catch (error) {
      next(error);
    }
  };

  postSwapUserClass = async (req, res, next) => {
    try {
      req.logger.http(
        `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
      );

      let reqEmail = req.user.user.email;

      let email = req.params.uid;

      if (reqEmail != email)
        CustomError.createError({
          statusCode: 401,
          name: "Admin users cant swap roles",
          code: 6,
        });

      let dbUser = await um.getOne({ email });
      req.logger.debug("Consegui los datos del usuario");

      let user = {
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        role: dbUser.role,
        email: dbUser.email,
        cart: dbUser.cart,
      };

      if (dbUser.role == "admin")
        CustomError.createError({
          statusCode: 401,
          name: "Admin users cant swap roles",
          code: 6,
        });
      if (dbUser.role == "user") {
        dbUser.role = "premium";
        let result = await um.editOne(email, dbUser);

        user.role = dbUser.role;
        let print = await um.getOne({ email });
        req.logger.debug(print);

        let token = jwt.sign({ user }, config.cookieSecret, {
          expiresIn: "24h",
        });
        if (result.acknowledged)
          return res
            .cookie("coderCookieToken", token, {
              maxAge: 1000 * 60 * 24,
              httpOnly: true,
            })
            .send({ status: "Ok", message: "Rol actualizado" });

        CustomError.createError({
          statusCode: 500,
          name: "Couldn't swap roles",
          code: 3,
        });
      }
      if (dbUser.role == "premium") {
        dbUser.role = "user";
        let result = await um.editOne(email, dbUser);

        user.role = dbUser.role;
        let print = await um.getOne({ email });
        req.logger.debug(print);

        let token = jwt.sign({ user }, config.cookieSecret, {
          expiresIn: "24h",
        });
        if (result.acknowledged)
          return res
            .cookie("coderCookieToken", token, {
              maxAge: 1000 * 60 * 24,
              httpOnly: true,
            })
            .send({ status: "Ok", message: "Rol actualizado" });

        CustomError.createError({
          statusCode: 500,
          name: "Couldn't swap roles",
          code: 3,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  postAreDocumentsRepeated = async (req, res, next) => {
    try {
      req.logger.http(
        `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
      );

      let email = req.params.uid;

      let user = await um.getOne({ email });

      // console.log(user.documents);
      // console.log(req.files);

      user.documents.push({ name: "identification" });

      let isValid = true;
      let repeatedDocs = [];

      user.documents.forEach((element) => {
        if (req.files[element.name]) {
          repeatedDocs.push(element.name);
          isValid = false;
        }
      });

      if (!isValid)
        return res.send({
          status: "error",
          message: `Los campos repetidos son ${repeatedDocs}`,
        });

      res.send({ status: "Ok", message: "All documents are new" });
    } catch (error) {
      next(error);
    }
  };

  postDocuments = async (req, res, next) => {
    try {
      req.logger.http(
        `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
      );

      console.log(req.files);
      console.log("Llegue al postDocuments");

      res.send({ status: "Ok", message: "Archivos guardados correctamente" });
    } catch (error) {
      next(error);
    }
  };
}
