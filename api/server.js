const path = require("path");
const express = require("express");
const session = require("express-session");
const authRouter = require("./auth/auth-router.js");
const morgan = require("morgan");

const usersRouter = require("./users/users-router.js");

const server = express();

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.json());
server.use(
  session({
    name: "monkey",
    secret: "keep it secret",
    cookie: {
      maxge: 1000 * 60 * 60,
      secure: false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false
  })
);
server.use(morgan("dev"));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

server.use("*", (req, res, next) => {
  next({ status: 404, message: "not found!" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
