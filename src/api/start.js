import express from "express";
import morgan from "morgan";
import errorMiddleware from "./v1/middlewares/errorMiddleware";

// this is all it takes to enable async/await for express middleware
import "express-async-errors";
import logger from "loglevel";
import cookieParser from "cookie-parser";

// all the routes for my app are retrieved from the src/api/v1/routes/index.js module
import { getRoutes } from "./v1/routes";

function startServer({ port = process.env.PORT } = {}) {
  const app = express();

  //Body parser
  app.use(express.json());

  // cookie parser
  app.use(cookieParser());

  //DEVELOPMENT logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // mount entire app to the /api route
  app.use("/api/v1", getRoutes());

  // add the generic error handler just in case errors are missed by middleware
  app.use(errorMiddleware);

  // So this block of code allows me to start the express app and resolve the
  // promise with the express server
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`);

      // this block of code turns `server.close` into a promise API
      const originalClose = server.close.bind(server);

      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };

      // this ensures that we properly close the server when the program exists
      setupCloseOnExit(server);

      // resolve the whole promise with the express server
      resolve(server);
    });
  });
}

// ensures we close the server in the event of an error.
function setupCloseOnExit(server) {
  // https://stackoverflow.com/a/14032965/971592

  async function exitHandler(options = {}) {
    await server
      .close()
      .then(() => {
        logger.info("Server successfully closed");
      })
      .catch((e) => {
        logger.warn("Something went wrong closing the server", e.stack);
      });

    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on("exit", exitHandler);

  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

export { startServer };
