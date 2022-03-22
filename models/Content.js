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
});

module.exports = mongoose.model("Content", ContentSchema);
