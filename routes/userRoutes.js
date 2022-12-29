const express = require("express");
const userRouter = express.Router();
const User = require("../models/userModel");
// You can POST to /api/users with form data username to create a new user.
// The returned response from POST /api/users with form data username will be an object with username and _id properties.
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

// You can make a GET request to /api/users to get a list of all users.
// The GET request to /api/users returns an array.
// Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
userRouter.get("/", async (req, res) => {
  const user = await User.find({});
  const userOnly = user.map((elem) => {
    return { _id: elem._id, username: elem.username };
  });
  res.status(200).json(userOnly);
});

module.exports = userRouter;
