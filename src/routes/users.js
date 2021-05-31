import express from "express";
import { getUsers } from "../controllers/users";

function getUsersRoutes() {
  const router = express.Router();

  router.get("/", getUsers);

  return router;
}

export { getUsersRoutes };
