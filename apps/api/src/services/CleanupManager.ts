import mongoose from "mongoose";
import winston from "winston";

class CleanupManager {
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  /**
   * Close the MongoDB connection.
   */
  private async closeDatabaseConnection(): Promise<void> {
    try {
      await mongoose.connection.close();
    } catch (error) {
      this.logger.error("Error while closing MongoDB connection:", error);
    }
  }

  /**
   * Execute all cleanup tasks.
   */
  private async cleanUp(): Promise<void> {
    await this.closeDatabaseConnection();
    this.logger.close();
  }

  /**
   * Set up signal and error handlers for graceful shutdown.
   */
  public setupShutdownHandlers(): void {
    const handleExit = async (exitCode: number): Promise<void> => {
      await this.cleanUp();
      process.exit(exitCode);
    };

    process.on("SIGINT", () => handleExit(0));
    process.on("SIGTERM", () => handleExit(0));

    process.on("uncaughtException", async (error) => {
      this.logger.error("Uncaught Exception:", error);
      await handleExit(1);
    });

    process.on("unhandledRejection", async (reason, promise) => {
      this.logger.error(`Unhandled Rejection at: ${promise}`);
      if (reason instanceof Error) {
        this.logger.error(reason.stack);
      } else {
        this.logger.error(
          `Non-error rejection reason: ${JSON.stringify(reason)}`,
        );
      }
      await handleExit(1);
    });
  }
}

export default CleanupManager;
