const mongoose = require("mongoose");

const ContentSchema = mongoose.Schema({
  text: {
    type: mongoose.SchemaTypes.Mixed,
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
  isCode: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Content", ContentSchema);
