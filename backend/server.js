require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
const programRoutes = require("./routes/programs");
app.use("/api", programRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Vantion SmartMatch API is running ✓" });
});

app.listen(PORT, () => {
  console.log(`✓ Vantion SmartMatch backend running at http://localhost:${PORT}`);
});
