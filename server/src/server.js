import express from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

// import files
import { env, logger, connectDB } from "./config/index.js";
import { GlobalErrorHandler } from "./utils/index.js";
import { userRoutes } from "./routes/index.js";

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
  console.log("a user connected " + socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
  });
});

// connect to database
connectDB();

// middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(logger.httpExpress);
app.use((req, res, next) => {
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
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoutes);

// global route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "server is running", success: true, statusCode: 200 });
});

app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: "Route Not found", success: false, statusCode: 404 });
});

// error handler
app.use(GlobalErrorHandler);

// listen server
server.listen(env.PORT, "0.0.0.0", () => {
  logger.info("Server is running on http://localhost:" + env.PORT);
});
