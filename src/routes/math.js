import express from "express";
import { add, subtract } from "../controllers/math";

function getMathRoutes() {
  const router = express.Router();

  router.get("/add", add);

  router.get("/subtract", subtract);

  return router;
}

export { getMathRoutes };
