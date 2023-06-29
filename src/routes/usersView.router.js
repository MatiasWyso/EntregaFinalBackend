import { Router } from "express";
import userManager from '../dao/classes/dbManagers/UserManager.js'
import { isAdmin } from "../middlewares/isAdmin.js";

const um = new userManager();
const router = Router();

router.get("/users", isAdmin, async (req, res) => {
  req.logger.http(
    `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
  );

  try {
    let dbUsers = await um.getAll();

    let users = [];

    dbUsers.forEach((user) => {
      if (user.role != "admin") {
        users.push(dto.getDetailed(user));
      }
    });

    res.render("viewUsers", { title: "Controlar usuarios", users });
  } catch (error) {
    req.logger.error(error);
    res.render("error");
  }
});

export default router;
