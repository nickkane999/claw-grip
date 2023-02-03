const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");

app.use(express.static("public"));
app.use(cors());
//

const PORT = 5000;

mongoose.connect("mongodb://localhost/graphql", { useNewUrlParser: true });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/src/data/*", (req, res) => {
  // extract the file name from the request URL
  const fileName = path.basename(req.url);

  // read the file from the file system
  fs.readFile(`src/data/${fileName}`, "utf8", (err, data) => {
    if (err) {
      res.send(err);
      // handle the error
    } else {
      // set the content type and send the response
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    }
  });
});

app.get("/files", (req, res) => {
  // read the contents of the directory
  fs.readdir("/files", (err, files) => {
    if (err) {
      res.send(err);
      // handle the error
    } else {
      // send the list of files as the response
      res.send(files);
    }
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/node", (req, res) => {
  res.send("hello node");
});
