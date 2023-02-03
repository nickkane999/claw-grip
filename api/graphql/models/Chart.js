const { model, Schema } = require("mongoose");

const chartSchema = new Schema({
  name: String,
  type: String,
  createdDate: String,
  updatedDate: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  plugins: String,
  json: String,
});

module.exports = {
  Chart: model("Chart", chartSchema),
};
