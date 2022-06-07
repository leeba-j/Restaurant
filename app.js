const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
dotenv.config();
const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const database = require("./database");

const schema = require("./main-graphql-schema");

app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
database(mongoUrl);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = { app };
