import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Script from "../models/Script";
import Logging from "../library/Logging";

const createScripts = (req: Request, res: Response, next: NextFunction) => {
  const { name, script } = req.body;
  const scripts = new Script({
    _id: new mongoose.Types.ObjectId(),
    name,
    script,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  scripts
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
      Logging.info(`Reading Script from database: ${script}`);
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
      Logging.info(`Reading all Scripts from database: ${scripts}`);
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

const updateScript = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.scriptId;
  return Script.findById(id).then((script) => {
    Logging.info(`Updating script from database: ${script}`);
    if (script) {
      script.set(req.body);
      return script
        .save()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
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
      Logging.info(`Deleting script from database: ${script}`);
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

export default { createScripts, readScript, readAllScripts, updateScript, deleteScript };
