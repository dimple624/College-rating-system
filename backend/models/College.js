const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  ratings: {
    campus: Number,
    placement: Number,
    faculty: Number,
    library: Number,
    hostel: Number,
    food: Number,
    infrastructure: Number,
    culturalEvents: Number,
    sports: Number,
    labs: Number,
  },
  review: { type: String },
});

const CollegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true, unique: true },
  ratings: [RatingSchema],
});

module.exports = mongoose.model("College", CollegeSchema);
