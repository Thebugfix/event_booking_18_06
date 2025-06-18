const express = require("express")
const router = express.Router()
const Event = require("../models/Event")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    console.error(error)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Event not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, description, date, price } = req.body

    const newEvent = new Event({
      title,
      description,
      date,
      price: price || 0,
    })

    const event = await newEvent.save()
    res.json(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const { title, description, date, price } = req.body

    const eventFields = {}
    if (title) eventFields.title = title
    if (description) eventFields.description = description
    if (date) eventFields.date = date
    if (price !== undefined) eventFields.price = price

    let event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    event = await Event.findByIdAndUpdate(req.params.id, { $set: eventFields }, { new: true })

    res.json(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    await Event.findByIdAndRemove(req.params.id)

    res.json({ message: "Event removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router