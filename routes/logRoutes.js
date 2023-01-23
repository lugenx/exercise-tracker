const express = require("express");
const logRouter = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userModel");

logRouter.get("/:_id/logs", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params._id);

  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  try {
    const user = await User.findOne({
      _id: id,
    });

    user.count = user.log.length;
    const responseLogLength = limit || user.log.length;
    let filteredUserLog;

    if (from && to) {
      filteredUserLog = user.log
        .filter(
          (elem) => elem.date >= new Date(from) && elem.date <= new Date(to)
        )
        .slice(0, responseLogLength);
    } else if (from) {
      filteredUserLog = user.log
        .filter((elem) => elem.date >= new Date(from))
        .slice(0, responseLogLength);
    } else if (to) {
      filteredUserLog = user.log
        .filter((elem) => elem.date <= new Date(to))
        .slice(0, responseLogLength);
    } else {
      filteredUserLog = user.log.slice(0, responseLogLength);
    }

    userLog = filteredUserLog.map((elem) => {
      return {
        description: elem.description ? elem.description : "",
        duration: elem.duration ? elem.duration : 0,
        date:
          elem.date !== "" && elem.date !== undefined
            ? elem.date.toDateString()
            : new Date().toDateString(),
      };
    });
    user.log = userLog;

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = logRouter;
