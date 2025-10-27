const mongoose = require("mongoose");

const BeatSchema = new mongoose.Schema({
  area: { type: String, required: true },
});

const SalesmanSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String },
  city: { type: String },
  address: { type: String },
  alternateMobile: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  beat: { type: [BeatSchema], default: [] },
  photo: { type: String },
});

module.exports = mongoose.model("Salesman", SalesmanSchema);



 