import dotenv from "dotenv";
import logger from "loglevel";
import { startServer } from "./start";

//load environment variables
dotenv.config({ path: "./config/config.env" });

logger.setLevel("info");

// connect to DB
// startDatabase()

// easier to test with server start func
startServer();
