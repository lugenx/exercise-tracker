const express = require("express");
const userRouter = express.Router();
const User = require("../models/userModel");

userRouter.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.create({
      username: username,
    });

    res.status(200).json({ username: user.username, _id: user._id });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

userRouter.get("/", async (req, res) => {
  const user = await User.find({});
  const userOnly = user.map((elem) => {
    return { _id: elem._id, username: elem.username };
  });
  res.status(200).json(userOnly);
});

module.exports = userRouter;
