const { GraphQLObjectType, GraphQLNonNull, GraphQLList } = require("graphql");
const { getAllFood } = require("../database-queries/FoodDBQueries");
const { FoodModel } = require("../graphql-models/FoodGQLModel");

const getAllFoodQuery = {
  type: new GraphQLList(FoodModel),
  resolve(parent, args) {
    return getAllFood();
  },
};

module.exports = { getAllFoodQuery}
