const { Schema, model } = require("mongoose");
const Joi = require("joi");
const moment = require("moment");
const { handleMongooseError, errorMessages } = require("../helpers");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task`s title is required"],
    },
    description: {
      type: String,
      required: [true, "Task`s description is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "without"],
      required: [true, "Task`s priority is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Task`s deadline is required"],
      min: new Date().toISOString(0, 0, 0, 0),
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

const Task = model("task", taskSchema);
taskSchema.post("save", handleMongooseError);

const taskSchemaJoi = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high", "without").required(),
  deadline: Joi.date().min(moment().startOf("day").toDate()).required(),
  board: Joi.string(), //passing by res.params, without it route dont work, validateSchema takes only rew.body
  column: Joi.string(), //passing by res.params, without it route dont work, validateSchema takes only rew.body
}).options({ abortEarly: false });

const taskUpdateSchemaJoi = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.string().valid("low", "medium", "high", "without"),
  deadline: Joi.date().min(moment().startOf("day").toDate()),
  board: Joi.string(),
  column: Joi.string(),
}).options({ abortEarly: false });

const taskMoveSchemaJoi = Joi.object({
  columnStart: Joi.string().required(),
  columnFinish: Joi.string().required(),
  indexFinish: Joi.number().integer().allow(null),
}).options({ abortEarly: false });

module.exports = {
  Task,
  taskSchemaJoi,
  taskUpdateSchemaJoi,
  taskMoveSchemaJoi,
};
