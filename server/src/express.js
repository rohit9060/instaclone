import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

import { userRoutes } from "./api/rest/routes/index.js";
import { GlobalErrorHandler, logger } from "./utils/index.js";

function configureExpress(PORT, TOKEN_SECRET) {
  // create app
  const app = express();

  // create server
  const server = createServer(app);

  // config socket.io
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    logger.info("a user connected " + socket.id);

    socket.on("disconnect", () => {
      logger.info("a user disconnected " + socket.id);
    });
  });

  // middleware
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(logger.httpExpress);

  // set socket
  app.use((req, _, next) => {
    req.io = io;
    next();
  });

  app.use(helmet());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser(TOKEN_SECRET));

  // routes
  app.use("/api/v1/users", userRoutes);

  // health check
  app.get("/", (_, res, __) => {
    res
      .status(200)
      .json({ message: "server is running", success: true, statusCode: 200 });
  });

  // not found route
  app.all("/", (_, res, __) => {
    res
      .status(404)
      .json({ message: "route not found", success: false, statusCode: 404 });
  });

  // error handler
  app.use(GlobalErrorHandler);

  // listen server
  server.listen(PORT, "0.0.0.0", () => {
    logger.info("server is running on http://localhost:" + PORT);
  });
}

export default configureExpress;
