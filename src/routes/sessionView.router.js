import { Router } from "express";
const router = Router();

router.get("/register", (req, res) => {
  return res.render("register", {});
});

router.get("/login", (req, res) => {
  return res.render("login", {});
});

router.get("/recover", (req, res) => {
  return res.render("recoverPassword", {});
});

router.get("/recoverLanding", (req, res) => {
  return res.render("recoverLanding", {});
});

router.get("/user", (req, res) => {
  const isLogin = req.user ? true : false;
  return isLogin ? res.render("user", {}) : res.redirect("/login");
});

export default router;
