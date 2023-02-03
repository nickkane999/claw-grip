const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdDate: String,
  updatedDate: String,
});

const authSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
});

module.exports = {
  User: model("User", userSchema),
  Auth: model("AuthUser", authSchema),
};
