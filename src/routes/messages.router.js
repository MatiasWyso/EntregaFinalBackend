import { Router } from "express";

const router = Router();

//La ruta renderiza la vista del chat por medio de handlebars
router.get("/", async (req, res) => {
  res.render("chat");
});

export default router;
