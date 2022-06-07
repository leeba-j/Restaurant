const { Schema, model } = require("mongoose");

const FoodSchema = new Schema({
  name: { type: String, required: true },
  isVegan: { type: Boolean, default: false },
  type: { type: String, required: true },
});

const FoodModel = model("FoodModel", FoodSchema);
module.exports = { FoodModel };
