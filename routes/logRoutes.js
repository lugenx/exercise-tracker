const express = require("express");
const logRouter = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userModel");
// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
// A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
// A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.
// Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.
// The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
// The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
// The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.
// You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
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
            description: elem.description.toString(),
            duration: elem.duration,
            date: elem.date.toDateString(),
          };
        });
      console.log("inside if");
    } else {
      console.log("inside else");
      userLog = user.log.map((elem) => {
        return {
          description: elem.description ? elem.description : "",
          duration: elem.duration ? elem.duration : 0,
          date: elem.date.toDateString(),
        };
      });
    }

    user.log = userLog;

    res.send(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = logRouter;
