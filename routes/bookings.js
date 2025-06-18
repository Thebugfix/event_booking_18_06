const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")
const Event = require("../models/Event")
const auth = require("../middleware/auth")

router.get("/user", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event").sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", auth, async (req, res) => {
  try {
    const { eventId } = req.body

    // Check if event exists
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if user has already booked this event
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      event: eventId,
      status: { $ne: "Canceled" },
    })

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this event" })
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      event: eventId,
    })

    const booking = await newBooking.save()

    res.json(booking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update booking status to canceled
    booking.status = "Canceled"
    await booking.save()

    res.json({ message: "Booking canceled" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router