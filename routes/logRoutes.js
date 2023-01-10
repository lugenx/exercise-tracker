const express = require("express");
const logRouter = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userModel");

logRouter.get("/:_id/logs", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params._id);
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const limit = req.query.limit;

  // console.log("id", id);
  // console.log("from", from);
  // console.log("to", to);
  // console.log("limit", limit);

  try {
    const user = await User.findOne({
      _id: id,
    });

    user.count = user.log.length;

    let userLog;
    const withQueries = !isNaN(Date.parse(from));
    console.log("withqueries?", withQueries);
    if (withQueries) {
      userLog = user.log
        .filter((elem) => elem.date >= from && elem.date <= to)
        .slice(0, limit)
        .map((elem) => {
          return {
            description: elem.description ? elem.description : "",
            duration: elem.duration ? elem.duration : 0,
            date: elem.date.toDateString(),
          };
        });
    } else {
      userLog = user.log.map((elem) => {
        return {
          description: elem.description ? elem.description : "",
          duration: elem.duration ? elem.duration : 0,
          date: elem.date.toDateString(),
        };
      });
    }

    user.log = userLog;
    console.log("user here", user);
    res.send(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = logRouter;
