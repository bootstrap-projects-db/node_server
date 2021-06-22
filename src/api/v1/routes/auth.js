import express from "express";
import { register, login } from "../controllers/auth";

function getAuthRoutes() {
  const router = express.Router();

  router.post("/register", register);
  router.post("/login", login);

  return router;
}

export { getAuthRoutes };
