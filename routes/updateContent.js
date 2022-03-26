const express = require("express");
const router = express.Router();
const Content = require("../models/Content.js");
const verify = require("./jwtVerify.js");

router.patch("/:id", verify, async function (req, res) {
  try {
    const update = await Content.updateOne(
      { _id: req.params.id },
      {
        $set: {
          text: req.body.text,
          name: req.body.name,
          owner: req.user._id,
        },
      }
    );
    res.status(200).json("Dokument uppdaterat!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
