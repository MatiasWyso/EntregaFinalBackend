import { Router } from "express";
import CartManager from "../dao/classes/dbManager/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getById(cid);
  console.log(cart);

  res.render("cart", { cart });
});

export default router;
