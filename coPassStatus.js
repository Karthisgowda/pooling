const mongoose = require("mongoose");
const coPassSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: [true, "A trip must have a source"],
  },
  tripDate: {
    type: Date,
  },
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
    required: [true, "A trip must have a source"],
  },
  fellows: [String],

  status: {
    type: String,
    default: "Scheduled",
  },
});

const coPass = mongoose.model("CoPass", coPassSchema);

module.exports = coPass;
