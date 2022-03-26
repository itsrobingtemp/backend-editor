const express = require("express");
const router = express.Router();
const Content = require("../models/Content.js");
const verify = require("./jwtVerify.js");

router.post("/", verify, async function (req, res) {
  const data = new Content({
    text: req.body.text,
    name: req.body.name,
    owner: req.user._id,
    sharedWith: req.body.sharedWith,
  });

  try {
    const saveContent = await data.save();
    res.status(200).json("Dokument sparat!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
