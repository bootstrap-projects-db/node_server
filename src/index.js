import dotenv from "dotenv";
import logger from "loglevel";
import { startServer } from "./start";
import { startDB } from "./db";
import "colors";

//load environment variables
dotenv.config({ path: "./config/config.env" });

logger.setLevel("info");

// connect to DB
startDB();

// easier to test with server start func
startServer();
