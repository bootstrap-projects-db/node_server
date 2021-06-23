import express from "express";
import { register, login, currentUser } from "../controllers/auth";
import { protect } from "../middlewares/protect";

function getAuthRoutes() {
  const router = express.Router();

  router.post("/register", register);
  router.post("/login", login);
  router.get("/current-user", protect, currentUser);

  return router;
}

export { getAuthRoutes };
