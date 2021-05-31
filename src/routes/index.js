import express from "express";

// any other routes imports would go here

import { getUsersRoutes } from "./users";

function getRoutes() {
  // create a router for all the routes of our app

  const router = express.Router();

  router.use("/users", getUsersRoutes());

  // any additional routes would go here

  return router;
}

export { getRoutes };
