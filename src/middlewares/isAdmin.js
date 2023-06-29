import passport from "passport";

export const isAdmin = (req, res, next) => {
  passport.authenticate("jwt", function (error, user, info) {
    req.user = user;
  })(req, res, next);
  if (req.user.role === "admin") return next();
  return res.send({ status: "error", error: "Admin role required" });
};
