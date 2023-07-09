const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, errorMessages } = require("../helpers");

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Board`s title is required"],
      // unique: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
    tasksIds: {
      type: [Schema.Types.ObjectId],
      ref: "task",
    },
  },
  { versionKey: false, timestamps: true }
);

const columnSchemaJoi = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages("title")),
}).options({ abortEarly: false });

const columnUpdateSchemaJoi = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages("title")),
}).options({ abortEarly: false });

const Column = model("column", columnSchema);
columnSchema.post("save", handleMongooseError);

module.exports = {
  Column,
  columnSchemaJoi,
  columnUpdateSchemaJoi,
};
