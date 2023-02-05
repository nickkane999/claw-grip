import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Logging from "../library/Logging";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    password,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  user
    .save()
    .then((result) => {
      Logging.info(`Saving Script to database: ${user}`);
      res.status(201).json({
        message: "Handling POST requests to /scripts",
        createdScripts: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      Logging.info(`Reading Script from database: ${user}`);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((user) => {
      Logging.info(`Reading all Scripts from database: ${user}`);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  return User.findById(id).then((user) => {
    Logging.info(`Updating script from database: ${user}`);
    if (user) {
      user.set(req.body);
      return user
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    }
  });
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  return User.findByIdAndDelete(id)
    .then((user) => {
      Logging.info(`Deleting script from database: ${user}`);
      if (user) {
        res.status(201).json({ message: "Script deleted" });
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

export default { createUser, readUser, readAllUsers, updateUser, deleteUser };
