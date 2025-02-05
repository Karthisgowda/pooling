const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "User must provide a email"],
    unique: true,
    loweracse: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "User must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "User must confirm the password"],
    validate: {
      //works only on save or create
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords dont match",
    },
  },
  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: [Number],
    default: [],
  },
  phNo: {
    type: String,
    required: true,
    unique: true,
  },
  dlNo: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: " ",
  },
  booked: [String],
  created: [String],
});

userSchema.pre("save", async function (next) {
  //only run this function if pas was actually modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
