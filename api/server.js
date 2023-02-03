const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const cors = require("cors");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolver");
require("dotenv").config();

const MONGODB = process.env.MONGODB_CONNECTION_STRING;
const PORT = 5000;
const origin = "http://localhost:3000";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
