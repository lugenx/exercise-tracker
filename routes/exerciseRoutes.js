const express = require("express");
const exerciseRouter = express.Router();
const User = require("../models/userModel");
// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
// The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
exerciseRouter.post("/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const exercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: new Date(req.body.date),
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

    res
      .status(200)
      .json({ username: user.username, ...lastAddedExercise, _id: user._id });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = exerciseRouter;
