import express from "express";
import { register } from "../controllers/auth";

function getAuthRoutes() {
  const router = express.Router();

  router.post("/register", register);

  return router;
}

export { getAuthRoutes };
