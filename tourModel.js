const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, "A trip must have a source"],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, "A trip must have a source"],
    trim: true,
  },
  creatorId: {
    type: String,
    required: [true, "A tour must have a duration"],
  },
  maxSeats: {
    type: Number,
    required: true,
  },
  seatsLeft: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
