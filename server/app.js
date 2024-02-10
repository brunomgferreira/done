require("dotenv").config();
require("express-async-errors");
const { StatusCodes } = require("http-status-codes");
const pool = require("./db/dbConnect");
const {
  createAllRepeatedTasks,
} = require("./components/tasks/tasksController");

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
const tasksNotificationsRoutes = require("./components/tasks/notifications/notificationsRoutes");
const repeatIntervalsRoutes = require("./components/tasks/repeatIntervals/repeatIntervalsRoutes");
const categoriesRoutes = require("./components/tasks/categories/categoriesRoutes");
const journalRoutes = require("./components/journal/journalRoutes");
const statsRoutes = require("./components/statistics/statsRoutes");
const notificationsRoutes = require("./components/notifications/notificationsRoutes");
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
app.use("/api/v1/journal", authenticateUser, journalRoutes);
app.use(
  "/api/v1/tasksNotifications",
  authenticateUser,
  tasksNotificationsRoutes
);
app.use("/api/v1/tasksRepeat", authenticateUser, repeatIntervalsRoutes);
app.use("/api/v1/tasksCategory", authenticateUser, categoriesRoutes);
app.use("/api/v1/statistics", authenticateUser, statsRoutes);
app.use("/api/v1/notifications", authenticateUser, notificationsRoutes);

app.get("/api/v1/auth", authenticateUser, (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Authentication successful" });
});

const port = process.env.PORT || 3000;

const checkDayChange = async () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const hourBeforeDayChange = 16;

  // Calculate the previous day
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  const previousDay = previousDate.getDate();

  if (
    (currentHour >= hourBeforeDayChange &&
      currentDay !== checkDayChange.lastDay) ||
    (currentDay !== checkDayChange.lastDay &&
      previousDay !== checkDayChange.lastDay)
  ) {
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.execute("SELECT id FROM user");

      for (const user of users) {
        await createAllRepeatedTasks(user.id, previousDay);
      }

      checkDayChange.lastDay = currentDay;
    } catch (error) {
      console.log(error);
    }
  }
};

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    checkDayChange.lastDay = new Date().getDate();
    setInterval(checkDayChange, 60000);
  } catch (error) {
    console.log(error);
  }
};

start();
