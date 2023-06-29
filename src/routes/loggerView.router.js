import {Router} from "express";

const router = Router();

router.get("/", (req, res) => {
  req.logger.fatal("Fatal test");
  req.logger.error("Error test");
  req.logger.warning("Warning test");
  req.logger.info("Info test");
  req.logger.http("Http test");
  req.logger.debug("Debug test");
  return res.send({status: 200, message: "Logger test"});
});

export default router;