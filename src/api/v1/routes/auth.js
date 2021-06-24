import express from "express";
import {
  register,
  login,
  currentUser,
  forgotPassword,
} from "../controllers/auth";
import { protect } from "../middlewares/protect";

function getAuthRoutes() {
  const router = express.Router();

  router.post("/register", register);
  router.post("/login", login);
  router.get("/current-user", protect, currentUser);
  router.post("/forgotpassword", forgotPassword);

  return router;
}

export { getAuthRoutes };
