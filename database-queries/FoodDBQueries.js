const { FoodModel } = require("../database-models/FoodDBModel");

const createFood = async ({ name, isVegan, type }) => {
  const food = FoodModel.create({ name, isVegan, type });

  return food;
};

const getAllFood = async () => {
  const food = await FoodModel.find({});

  return food;
};

const updateFood = async (foodId) => {
  await FoodModel.updateOne({ _id: foodId });

  return `Operation completed successfully`;
};

const deleteFood = async (foodId) => {
  await FoodModel.deleteOne({ _id: foodId });

  return `Operation completed successfully`;
};

module.exports = { createFood, getAllFood, updateFood, deleteFood };
