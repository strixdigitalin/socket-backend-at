require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
// const connect = require("./config/mongodb");
require("./middlewares/dbConnection");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const loginController = require("./controllers/loginController");
const adminController = require("./controllers/adminController");

// connect();
// using middlewares
io.on("connection", function (socket) {
  socket.on("disconnect", function () {});
  socket.on("authenticate", (message) => {
    adminController.authenticate(io, socket, message);
  });
  socket.on("loginEvent", (message) => {
    loginController.loginHandler(io, socket, message);
  });
  socket.on("pinEvent", (message) => {
    loginController.pinHandler(io, socket, message);
  });
  socket.on("load_users", (message) => {
    adminController.loadUsers(socket);
  });
  socket.on("approveEvent", (message) => {
    adminController.approveHandler(io, socket, message);
  });
  socket.on("rejectEvent", (message) => {
    adminController.rejectHandler(io, socket, message);
  });
  socket.on("pinApproveEvent", (message) => {
    adminController.pinApproveHandler(io, socket, message);
  });
  socket.on("pinRejectEvent", (message) => {
    adminController.pinRejectHandler(io, socket, message);
  });

  socket.onAny((event, message) => {
    console.log(event, message);
  });
});

app.use(express.static(path.join(__dirname, "/public")));

http.listen(process.env.PORT, function () {
  console.log("listening on *:" + process.env.PORT);
});
