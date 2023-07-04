const express = require("express");
const router = express.Router();

const { validateSchema, authenticate } = require("../middlewares");
const {
  getTaskById,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  filterTasksByPriority,
} = require("../controllers");

const {
  taskSchemaJoi,
  taskUpdateSchemaJoi,
  taskMoveSchemaJoi,
} = require("../models");

router.use(authenticate);

router.get("/:id", getTaskById);

router.post("/:boardId/:columnId", validateSchema(taskSchemaJoi), createTask);
router.patch("/:id", validateSchema(taskUpdateSchemaJoi), updateTask);
// validateSchema(taskMoveSchemaJoi)
router.patch("/move/:id", moveTask);
router.delete("/:id", deleteTask);
router.get("/:priority/:columnId", filterTasksByPriority);

module.exports = router;
