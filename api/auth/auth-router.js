const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const User = require("../users/users-model");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcryptjs.hashSync(password, 12);
    const newUser = { username, password: hash };
    const result = await User.add(newUser);
    res.status(201).json({
      message: `Nice to have you, ${result.username}`,
    });
  } catch (err) {
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await User.findBy({ username });
    if (user && bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      res.json({
        message: `Welcome back, ${user.username}`,
      });
    } else {
      next({
        status: 401,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    next(err);
  }
});
router.get("/logout", async (req, res, next) => {
  res.json({
    message: "logout working",
  });
});

module.exports = router;
