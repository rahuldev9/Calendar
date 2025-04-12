const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => res.json(await Event.find()));
router.post("/", async (req, res) =>
  res.json(await new Event(req.body).save())
);
router.put("/:id", async (req, res) =>
  res.json(
    await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
router.delete("/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
