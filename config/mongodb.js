const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.njlncgo.mongodb.net/socketLogin?retryWrites=true&w=majority`
  );
};
module.exports = connect;
