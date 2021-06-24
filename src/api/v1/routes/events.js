import express from "express";
import { protect, authorize } from "../middlewares/protect";

function getEventRoutes() {
  const router = express.Router();

  router.get("/", protect, authorize("MEMBER"), (req, res, next) => {
    res.send("events");
  });

  return router;
}

export { getEventRoutes };
