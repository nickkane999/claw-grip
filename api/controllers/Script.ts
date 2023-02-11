import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Script from "../models/Script";
import User from "../models/User";
import Logging from "../library/Logging";

const createScript = (req: Request, res: Response, next: NextFunction) => {
  const { name, script, userId } = req.body;
  const newScript = new Script({
    _id: new mongoose.Types.ObjectId(),
    name,
    script,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: userId,
  });
  newScript
    .save()
    .then((result) => {
      Logging.info(`Saving Script to database: ${script}`);
      res.status(201).json({
        message: "Handling POST requests to /scripts",
        createdScripts: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const readScript = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  return Script.findById(id)
    .then((script) => {
      Logging.info(`Reading Script from database: ${id}`);
      if (script) {
        res.status(200).json(script);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const readAllScripts = (req: Request, res: Response, next: NextFunction) => {
  Script.find()
    .then((scripts) => {
      Logging.info(`Reading all Scripts from database`);
      if (scripts) {
        res.status(200).json(scripts);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const readScriptsByUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  const user = User.findById(id);
  User.findById(id, (err: any, user: any) => {
    if (err || !user) {
      Logging.info(`Could not find any scripts from user: ${id}`);
      res.status(404).json({ message: `Could not find any scripts from user: ${id}` });
      return;
    } else {
      return Script.find({ user: id })
        .sort({ createdDate: -1 })
        .then((scripts) => {
          Logging.info(`Reading all Scripts from user: ${id}`);
          if (scripts) {
            res.status(200).json(scripts);
          } else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
          }
        });
    }
  });
  return;
};

const updateScript = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  console.log(req.body);

  return Script.findById(id).then((script) => {
    if (script) {
      script.set(req.body);
      return script
        .save()
        .then((result) => {
          Logging.info(`Updated script from database: ${script}`);
          res.status(200).json(result);
        })
        .catch((err) => {
          Logging.info(`Error saving the script on the DB: ${err}`);
          res.status(200).json({ error: err });
        });
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    }
  });
};

const deleteScript = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  return Script.findByIdAndDelete(id)
    .then((script) => {
      Logging.info(`Deleting script from database: ${id}`);
      if (script) {
        res.status(201).json({ message: "Script deleted" });
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

export default { createScript, readScript, readAllScripts, readScriptsByUser, updateScript, deleteScript };
