require("dotenv").config();
require("express-async-errors");
const { StatusCodes } = require("http-status-codes");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
// xss clean ??
const rateLimiter = require("express-rate-limit");

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

// connectDB
// const connectDB = require("./db/connect");

// routers
const userRoutes = require("./components/user/userRoutes");
const tasksRoutes = require("./components/tasks/tasksRoutes");
const notificationsRoutes = require("./components/tasks/notifications/notificationsRoutes");
const repeatIntervalsRoutes = require("./components/tasks/repeatIntervals/repeatIntervalsRoutes");
const categoriesRoutes = require("./components/tasks/categories/categoriesRoutes");
const authenticateUser = require("./middleware/authenticateUser");
// const taskRoutes = require('./components/task/taskRoutes');

// error handler
// const notFoundMiddleware = require("./middleware/not-found");
// const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.options("/api/v1/auth/", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET");
  res.end();
});

app.use(express.json());

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tasks", authenticateUser, tasksRoutes);
app.use("/api/v1/tasksNotifications", authenticateUser, notificationsRoutes);
app.use("/api/v1/tasksRepeat", authenticateUser, repeatIntervalsRoutes);
app.use("/api/v1/tasksCategory", authenticateUser, categoriesRoutes);
app.get("/api/v1/auth", authenticateUser, (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Authentication successful" });
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
