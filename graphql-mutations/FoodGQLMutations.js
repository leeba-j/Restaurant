const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} = require("graphql");
const { createFood } = require("../database-queries/FoodDBQueries");
const { FoodModel } = require("../graphql-models/FoodGQLModel");

const createFoodMutation = {
  type: new GraphQLNonNull(FoodModel),
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    isVegan: { type: new GraphQLNonNull(GraphQLBoolean) },
    type: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return createFood({
      name: args.name,
      isVegan: args.isVegan,
      type: args.type,
    });
  },
};

module.exports = { createFoodMutation };
