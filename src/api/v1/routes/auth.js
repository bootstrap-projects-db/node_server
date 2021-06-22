import express from "express";

function getAuthRoutes() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.send("auth route");
  });

  return router;
}

export { getAuthRoutes };
