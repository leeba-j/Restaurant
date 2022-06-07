const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { createFoodMutation } = require("./graphql-mutations/FoodGQLMutations");
const { getAllFoodQuery } = require("./graphql-queries/FoodGQLQueries");

const Query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllFood: getAllFoodQuery,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createFood: createFoodMutation,
  },
});

module.exports = new GraphQLSchema({ query: Query, mutation: Mutation });
