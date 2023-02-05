const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
import Logging from "./library/Logging";

import scriptRoutes from "./routes/Script";
import userRoutes from "./routes/User";

// Connect to MongoDB
const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_CONNECTION_STRING;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    Logging.info("MongoDB Connected");
    StartServer();
  })
  .catch((err: any) => {
    Logging.error("Could not connect to MongoDB");
    Logging.error(err);
  });

const app = express();
const StartServer = () => {
  app.use((req: any, res: any, next: any) => {
    Logging.info(`Incoming -> Method: [${req.method} - Url:  ${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
      Logging.info(`Outgoing -> Method: [${req.method} - Url:  ${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });
    next();
  });
};

app.use(bodyParser.json()); // parse incoming request bodies in a middleware
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors());

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/scripts", scriptRoutes);
app.use("/users", userRoutes);

app.get("/ping", (req: any, res: any) => res.status(200).send("pong"));

app.use((req: any, res: any, next: any) => {
  const error = new Error("Not found");
  Logging.error(error);

  return res.status(404).json({ message: error.message });
});

http.createServer(app).listen(process.env.PORT, () => {
  Logging.info(`Server started on port ${process.env.PORT}`);
});
