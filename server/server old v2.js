const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const resolvers = require("./graphql/resolver/resolver");

const SECRET_KEY = "secret key";
const MONGODB = "mongodb+srv://mango_master:eAccDVYqsTYUgvYe@cluster0.zhcfvbb.mongodb.net/?retryWrites=true&w=majority";

app.use(express.static("public"));
app.use(cors());

const PORT = 5000;

mongoose.connect("mongodb://localhost/graphql", { useNewUrlParser: true });

app.use(
  "/graphql",
  graphqlHTTP((req, res, graphQLParams) => {
    // Get token from headers
    const token = req.headers["authorization"];
    let authenticated = true;

    // use the verifyToken function as a middleware before executing any mutation or query:
    // app.use((req, res, next) => {
    // const verified = verifyToken(req);
    // if (!verified.authenticated) {
    // throw new Error("Unauthenticated!");
    // }
    // req.user = verified.user;
    // next();
    // });

    // If token exists, verify it
    if (token) {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          authenticated = false;
        }
      });
    } else {
      authenticated = false;
    }

    // If token is valid, add user to graphQLParams
    if (authenticated) {
      const decoded = jwt.decode(token);
      graphQLParams.context = { user: decoded.user };
    }

    return {
      schema,
      rootValue: resolvers,
      graphiql: true,
      context: graphQLParams.context,
    };
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
