const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// You can POST to /api/users with form data username to create a new user.
// The returned response from POST /api/users with form data username will be an object with username and _id properties.
app.post("/api/users", async (req, res) => {
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
app.get("/api/users", async (req, res) => {
  const user = await User.find({});
  const userOnly = user.map((elem) => {
    return { _id: elem._id, username: elem.username };
  });
  res.status(200).json(userOnly);
});

// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
// The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.

app.post("/api/users/:_id/exercises", async (req, res) => {
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

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
// A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
// A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.
// Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.
// The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
// The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
// The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.
// You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
app.get("/api/users/:_id/logs", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params._id);
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);

  const limit = req.query.limit;

  try {
    const user = await User.findOne({
      _id: id,
    });
    user.count = user.log.length;
    if (isNaN(Date.parse(from))) return res.send(user);

    const log = user.log
      .filter((elem) => elem.date >= from && elem.date <= to)
      .map((elem) => {
        return {
          description: elem.description,
          duration: elem.duration,
          date: elem.date.toDateString(),
        };
      })
      .slice(0, limit);

    user.log = log;

    res.send(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

const startServer = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI);
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  } catch (err) {
    console.error({ error: err });
  }
};

startServer();
