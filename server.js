const { Server } = require("http");
const { logger, errorLogger } = require("./src/shared/logger");
const { default: mongoose } = require("mongoose");
const config = require("./src/config/config");

async function main() {
  try {
    await mongoose.connect(config.Database_URL);
    console.log(`Database connected Successfully!!`);
    logger.info(`Database connected Successfully!!`);

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info("Server closed");
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error) => {
      errorLogger.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    console.log(`Database connected Failed!! the issue is ${error}`);
    errorLogger.error(`Database connected Failed!! the issue is ${error}`);
  }
}

main();
