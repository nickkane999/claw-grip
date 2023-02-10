import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Logging from "../library/Logging";
import { generateToken } from "../library/token";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, passwordConfirm } = req.body;
  const newUser = await User.findOne({ username });
  if (newUser) {
    Logging.error("User provided a duplicate user name, will not create the account");
    res.status(404).json({ error: "You provided a duplicate username, please try again with a different username" });
    return;
  }
  if (password === passwordConfirm) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDate = new Date().toISOString();
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdDate: newDate,
      updatedDate: newDate,
    });
    const user = await newUser.save();
    Logging.info(`Saving user to database: ${user}`);
    res.status(201).json({
      user,
      token: generateToken(user),
    });
    return;
  } else {
    res.status(500).json({ error: "passwords do not match" });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user: any = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }
  console.log(user);

  const passwordIsValid = await bcrypt.compare(password, user.password);

  console.log(passwordIsValid);
  if (!passwordIsValid) {
    throw new Error("Invalid credentials");
  }

  res.status(201).json({
    user,
    token: generateToken(user),
  });
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;

  return User.findById(id)
    .then((user) => {
      Logging.info(`Reading user from database: ${user}`);
      if (user) {
        res.status(200).json(user);
        return;
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
      return;
    });
};

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((user) => {
      Logging.info(`Reading all users from database: ${user}`);
      if (user) {
        res.status(200).json(user);
        return;
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id).then((user) => {
    Logging.info(`Updating user from database: ${user}`);
    if (user) {
      user.set(req.body);
      return user
        .save()
        .then((user) => {
          res.status(200).json(user);
          return;
        })
        .catch((err) => {
          res.status(500).json({ error: err });
          return;
        });
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
      return;
    }
  });
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        Logging.info(`Deleting user from database: ${user}`);
        res.status(201).json({ message: "User deleted" });
      } else {
        Logging.info(`ID provided was not valid for a user: ${id}`);
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

export default { createUser, readUser, readAllUsers, updateUser, deleteUser, loginUser };
