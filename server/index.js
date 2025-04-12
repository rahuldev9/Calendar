const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const goalRoutes = require("./routes/goalRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
}));
app.use(bodyParser.json());

connectDB();

app.use("/events", eventRoutes);
app.use("/goals", goalRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
