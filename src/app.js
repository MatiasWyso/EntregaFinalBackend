import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import productsRouter from "./routes/products.router.js";
import productsViewRouter from "./routes/productsView.router.js";
import cartsRouter from "./routes/carts.router.js";
import cartsViewRouter from "./routes/cartsView.router.js";
import { Server } from "socket.io";
import "./dbConfig.js";
import messagesRouter from "./routes/messages.router.js";
import { MessageManager } from "./dao/classes/dbManager/MessageManager.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/session.router.js";
import sessionViewRouter from "./routes/sessionView.router.js";
import usersRouter from "./routes/users.router.js";
import usersViewRouter from "./routes/loggerView.router.js";
import loggerViewRouter from "./routes/loggerView.router.js";
import passport from "passport";
import initPassport from "./config/passport.config.js";
import config from "./config/config.js";
import handleError from "./middlewares/handleError.js";
import {addLogger} from "./logger/logger.js";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();
const FileStorage = FileStore(session);

const PORT = config.port;

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

export const socketServer = new Server(httpServer);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(addLogger);
app.use(handleError);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
      config.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 60,
    }),
    secret: "secretCode",
    resave: false,
    saveUninitialized: false,
  })
);

initPassport();

app.use(
  passport.session({
    secret: "secretCoder",
  })
);
app.use(passport.initialize());
app.engine(
  "handlebars",
  handlebars.engine({
    defaulyLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: "Documentacion de las API",
          description: "APIs desarrolladas que conforman parte del proyecto"
      }
  },
  apis: [`./src/docs/**.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/users", usersRouter);
app.use("/messages", messagesRouter);
app.use("/products", productsViewRouter);
app.use("/cart", cartsViewRouter);
app.use("/session", sessionViewRouter);
app.use("/loggerTest", loggerViewRouter);
app.use("/users", usersViewRouter);

const messageManager = new MessageManager();

socketServer.on("connection", async (socket) => {
  console.log(`Cliente conectado. ID: ${socket.id}`);
  socket.emit("bienvenida", {
    message: "Conectado al servidor",
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado. ID: ${socket.id}`);
  });

  socket.on("nuevoIngreso", async (user) => {
    socket.broadcast.emit("nuevoIngreso", user);
    socket.emit("chat", await messageManager.getMessages());
  });

  socket.on("chat", async (msjObj) => {
    const newMessages = await messageManager.savedMessages(msjObj);
    socketServer.emit("chat", newMessages);
  });

  socket.on("clean", async (obj) => {
    const newMessages = await messageManager.cleanHisotry();
    socketServer.emit("chat", newMessages);
  });
});
