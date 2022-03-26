const express = require("express");
const Content = require("../models/Content.js");
const router = express.Router();
const verify = require("./jwtVerify.js");

// get all content
router.get("/", verify, async function (req, res) {
  try {
    const content = await Content.find({ owner: req.user._id });

    if (content) {
      res.json(content);
    } else {
      res.status(401).json({ error: "No content found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// get ID content
router.get("/:id", verify, async function (req, res) {
  try {
    const content = await Content.findById(req.params.id);
    res.json(content);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
