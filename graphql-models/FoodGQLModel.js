const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const FoodModel = new GraphQLObjectType({
  name: "Food",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    isVegan: { type: new GraphQLNonNull(GraphQLBoolean) },
    type: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = { FoodModel}