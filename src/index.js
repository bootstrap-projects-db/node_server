import logger from "loglevel";

import { startServer } from "./start";

logger.setLevel("info");

// easier to test with server start func
startServer();
