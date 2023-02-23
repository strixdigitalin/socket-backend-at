const jwt = require("jsonwebtoken");
const { query } = require("../middlewares/dbConnection");

const adminLoginHandler = (io, socket, message, user) => {
  let payload;

  if (message.password != user.password) {
    payload = {
      message: "Invalid Email or Password!",
      code: "ERR101",
    };
  } else {
    const accessToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        user_id: user.id,
      },
      "mySecret$@1"
    );
    payload = {
      message: "Admin Logged in Successfully!",
      type: 2,
      code: "0",
      authToken: accessToken,
    };
    socket.join("admins");
  }

  socket.emit("loginResponse", payload);
};

const userLoginHandler = async (io, socket, message) => {
  const user = { email: message.email, password: message.password };
  const response = await query(
    "INSERT INTO users(email,password,time) VALUES(?,?,?)",
    [user.email, user.password, Date.now()]
  );
  user.id = response.insertId;
  io.to("admins").emit("connection_request", user);
  socket.join("waiting_room");
  socket.emit("wait_for_approval");
};

const loginHandler = async (io, socket, message) => {
  if (!message?.email || !message?.password) {
    return;
  }
  const user = await query(
    "SELECT * FROM admin_users WHERE email=?",
    message.email
  );
  if (user.length) {
    adminLoginHandler(io, socket, message, user[0]);
  } else {
    userLoginHandler(io, socket, message);
  }
};

const pinHandler = async (io, socket, message) => {
  if (!message?.connectionId || !message?.pin) {
    return;
  }
  await query("UPDATE users SET pin=? WHERE id=?", [
    message.pin,
    message.connectionId,
  ]);
  io.to("admins").emit("pin_request", message);
};

module.exports = { loginHandler, pinHandler };
