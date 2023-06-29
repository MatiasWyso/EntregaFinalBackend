import { Router } from "express";
import * as cartsController from "../controller/carts.controller.js";
import passport from "passport";

const router = Router();

router.get("/", cartsController.getAll);

router.get("/:cid", cartsController.getById);

router.post("/", cartsController.post);

router.post("/:cid/products/:pid", cartsController.postProductToCart);

router.post("/:cid/purchase", passport.authenticate('jwt', {session: false}),cartsController.purchase);

router.put("/:cid/products", cartsController.putProducts);

router.put("/:cid/products/:pid", cartsController.putProductQuantity);

router.delete("/:cid/products/:pid", cartsController.deleteProductToCart);

router.delete("/:cid/products", cartsController.deleteProducts);

router.delete("/:cid", cartsController.deleteById);

export default router;
