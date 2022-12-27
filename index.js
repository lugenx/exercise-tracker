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

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params._id);
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);

  const limit = req.query.limit;

  try {
    const user = await User.findOne({
      _id: id,
    });

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
    user.count = log.length;
    user.log = log;

    res.send(user);
  } catch (error) {
    console.error("catched error", error);
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
