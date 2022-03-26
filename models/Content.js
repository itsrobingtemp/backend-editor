const mongoose = require("mongoose");

const ContentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  sharedWith: {
    type: String,
    required: true,
    default: "",
  },
});

module.exports = mongoose.model("Content", ContentSchema);
