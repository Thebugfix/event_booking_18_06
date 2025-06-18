const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// Import routes
const userRoutes = require("./routes/users")
const eventRoutes = require("./routes/events")
const bookingRoutes = require("./routes/bookings")

// Initialize express app
const app = express()

const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200,
  }

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/event-booking").then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/bookings", bookingRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// export for vecel deployment
module.exports = app