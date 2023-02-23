// const User = require("../models/User");
// const AdminUser = require("../models/AdminUser");
const { query } = require("../middlewares/dbConnection");
const jwt = require("jsonwebtoken");
const loadUsers = async (socket) => {
  const users = await query("SELECT * FROM users");
  socket.emit("users_list", users);
};

const authenticate = async (io, socket, message) => {
  jwt.verify(message, "mySecret$@1", async (err, decoded) => {
    if (err) {
      console.log(err);
      return;
    }
    const user = await query("SELECT * FROM admin_users WHERE id=?", [
      decoded.user_id,
    ]);
    if (user.length) {
      socket.join("admins");
      socket.emit("authenticated");
    }
  });
};
// status: 1 = approve , 2 = reject
const approveHandler = async (io, socket, message) => {
  await query("UPDATE users SET approveTime=?,status=1 WHERE id=?", [
    Date.now(),
    message.id,
  ]);
  io.to("waiting_room").emit("approvalEvent", {
    email: message.email,
    connectionId: message.id,
  });
};

const rejectHandler = async (io, socket, message) => {
  await query("UPDATE users SET approveTime=?,status=2 WHERE id=?", [
    Date.now(),
    message.id,
  ]);
  io.to("waiting_room").emit("rejectionEvent", {
    email: message.email,
  });
};

// status: 1 = approve , 2 = reject
const pinApproveHandler = async (io, socket, message) => {
  await query("UPDATE users SET pin_time=?,pin_status=1 WHERE id=?", [
    Date.now(),
    message.id,
  ]);
  io.to("waiting_room").emit("pinApprovalEvent", {
    connectionId: message.id,
  });
};

const pinRejectHandler = async (io, socket, message) => {
  await query("UPDATE users SET pin_time=?,pin_status=2 WHERE id=?", [
    Date.now(),
    message.id,
  ]);
  io.to("waiting_room").emit("pinRejectionEvent", {
    connectionId: message.id,
  });
};

module.exports = {
  loadUsers,
  authenticate,
  approveHandler,
  rejectHandler,
  pinApproveHandler,
  pinRejectHandler,
};
