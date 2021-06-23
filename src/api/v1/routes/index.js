import express from "express";

// any other routes imports would go here

import { getUsersRoutes } from "./users";
import { getAuthRoutes } from "./auth";
import { getEventRoutes } from "./events";

function getRoutes() {
  // create a router for all the routes of our app

  const router = express.Router();

  router.use("/users", getUsersRoutes());
  router.use("/auth", getAuthRoutes());
  router.use("/events", getEventRoutes());

  // any additional routes would go here

  return router;
}

export { getRoutes };
