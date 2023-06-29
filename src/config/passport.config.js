import userService from "passport-github2";
import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import { UsersService } from "../dao/repositories/index.js";
import { CartsService } from "../dao/repositories/index.js";
import nodemailer from "nodemailer";
import config from "./config.js";
import {transport} from "../services/mailling.js";

const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const localStrategy = local.Strategy;
const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UsersService.getBy({ _id: id });
    done(null, user);
  });

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          let user = await UsersService.getBy({ email });
          console.log(user);
          if (user != null) {
            console.log("El usuario ya existe");
            return done(null, false, {
              status: "Error",
              message: "El usuario ya existe",
            });
          }
          let cartObj = await CartsService.post();
          console.log(cartObj);

          let cart = cartObj._id;
          const result = {
            first_name,
            last_name,
            age,
            cart,
            email,
            password: createHash(password),
          };

          await transport.sendMail({
            from: "matiaswyso@gmail.com",
            to: `${email}`,
            subject: "prueba",
            text: `Usuario registrado correctamente. \n Credenciales: \n Email:${email} \n Password: ${password}`,
          });

          const newUser = await UsersService.post(result);
          return done(null, newUser, { message: "Usuario creado con exito" });
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, pass, done) => {
        const { email, password } = req.body;
        try {
          if (
            email === config.adminEmail &&
            password === config.adminPassword
          ) {
            const user = {
              email,
              password,
              role: "admin",
            };
            return done(null, user);
          }
          const user = await UsersService.getBy({ email });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false, {
              status: "Error",
              message: "El usuario no existe",
            });
          }

          if (!isValidPassword(user, password))
            return done(null, false, {
              status: "Error",
              message: "La contraseña no es válida",
            });

          return done(null, user);
        } catch (error) {
          return done("Error al obtener el ususario" + error);
        }
      }
    )
  );

  passport.use(
    "github",
    new userService(
      {
        clientID: "Iv1.b57ce4834930ef38",
        clientSecret: "4b0a958f568b83454f97cc8496949c81bbb5147d",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await UsersService.getBy({ email: profile._json.email });
          if (!user) {
            let cartObj = await CartsService.post();
            console.log(cartObj);

            let cart = cartObj._id;

            const result = {
              first_name: profile._json.name,
              last_name: profile._json.name,
              email: profile._json.email,
              age: 0,
              password: " ",
              cart,
            };
            let newUser = await UsersService.addUser(result);
            return done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

passport.use(
  "jwt",
  new jwtStrategy(
    {
      jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: "coderSecret",
    },
    async (jwt_payload, done) => {
      try {
        console.log(jwt_payload);
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default initPassport;
