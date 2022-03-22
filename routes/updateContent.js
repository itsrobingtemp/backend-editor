const express = require("express");
const router = express.Router();
const Content = require("../models/Content.js");

router.patch("/:id", async function (req, res) {
  try {
    const update = await Content.updateOne(
      { _id: req.params.id },
      { $set: { text: req.body.text, name: req.body.name } }
    );
    res.status(200).json("Dokument uppdaterat!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
