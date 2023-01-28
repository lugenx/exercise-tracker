const express = require("express");
const exerciseRouter = express.Router();
const User = require("../models/userModel");

exerciseRouter.post("/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const exercise = {
    date: new Date(req.body.date),
    duration: Number(req.body.duration),
    description: req.body.description,
  };

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          log: exercise,
        },
      },
      { new: true }
    );
    const lastAddedExercise = user.log[user.log.length - 1];
    lastAddedExercise.date = lastAddedExercise.date.toDateString();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      ...lastAddedExercise,
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = exerciseRouter;
