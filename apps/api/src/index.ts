import "@/config/envConfig.js";

import CleanupManager from "@/services/CleanupManager.js";
import Server from "@/server.js";
import logger from "@/config/logger.js";

const server = new Server();
const cleanupManager = new CleanupManager(logger);

// Setup signal and error handlers for graceful shutdown
cleanupManager.setupShutdownHandlers();

server.start();

logger.info("START");
