const mongoose = require("mongoose");

const AdminUserSchema = mongoose.Schema({
  email: String,
  password: String,
});
const AdminUser = mongoose.model("admin_users", AdminUserSchema);
module.exports = AdminUser;
