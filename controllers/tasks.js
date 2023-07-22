const { Task } = require("../models/task");
const { Column } = require("../models/column");
const {
  ctrlWrapper,
  handleHttpError,
  mongooseObjectIdCheck,
} = require("../helpers");

const getTaskById = async (req, res) => {
  const { id } = req.params;
  if (!mongooseObjectIdCheck(id)) {
    throw handleHttpError(
      400,
      `Bad request, id isn't match ObjectId mongoose type`
    );
  }
  const result = await Task.findById(id, "-createdAt -updatedAt");
  if (!result) {
    throw handleHttpError(404, `Task with id: ${id} is not found`);
  }
  res.json(result);
};

const createTask = async (req, res) => {
  const { boardId, columnId } = req.params;
  if (!mongooseObjectIdCheck(boardId)) {
    throw handleHttpError(
      400,
      `Bad request, boardId isn't match ObjectId mongoose type`
    );
  }
  if (!mongooseObjectIdCheck(columnId)) {
    throw handleHttpError(
      400,
      `Bad request, columnId isn't match ObjectId mongoose type`
    );
  }

  const result = await Task.create({
    ...req.body,
    board: boardId,
    column: columnId,
  });

  const { _id: newTaskId } = result;
  let { tasksIds } = await Column.findById(columnId);
  tasksIds.push(newTaskId);
  await Column.findByIdAndUpdate(columnId, { tasksIds });

  const createdTask = await Task.findById(newTaskId, "-createdAt -updatedAt");

  res.status(201).json(createdTask);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  if (!mongooseObjectIdCheck(id)) {
    throw handleHttpError(
      400,
      `Bad request, id isn't match ObjectId mongoose type`
    );
  }
  const result = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw handleHttpError(404, `Task with id: ${id} is not found`);
  }
  res.json(result);
};

const moveTask = async (req, res) => {
  const { id } = req.params;
  const { columnStart, columnFinish, indexFinish } = req.body;
  if (!mongooseObjectIdCheck(id)) {
    throw handleHttpError(
      400,
      `Bad request, id isn't match ObjectId mongoose type`
    );
  }

  //remove task index from start column task list
  let { tasksIds: taskIdsStart } = await Column.findById(columnStart);
  const indexStart = taskIdsStart.indexOf(id);
  if (indexStart === -1) {
    throw handleHttpError(500, `Bad task index for move task start`);
  }
  taskIdsStart.splice(indexStart, 1);
  await Column.findByIdAndUpdate(columnStart, { tasksIds: taskIdsStart });

  //add task index to finish column task list
  let { tasksIds: taskIdsFinish } = await Column.findById(columnFinish);
  const indexToPaste =
    indexFinish || indexFinish === 0 ? indexFinish : taskIdsFinish.length;

  taskIdsFinish.splice(indexToPaste, 0, id);
  await Column.findByIdAndUpdate(columnFinish, { tasksIds: taskIdsFinish });

  await Task.findByIdAndUpdate(id, { column: columnFinish });

  res.json("task move success");
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!mongooseObjectIdCheck(id)) {
    throw handleHttpError(
      400,
      `Bad request, id isn't match ObjectId mongoose type`
    );
  }

  const { column: columnId } = await Task.findById(id);

  let { tasksIds } = await Column.findById(columnId);
  const taskIndex = tasksIds.indexOf(id);
  if (taskIndex === -1) {
    throw handleHttpError(
      500,
      `Bad task index for removing task from tasksIds list`
    );
  }
  tasksIds.splice(taskIndex, 1);
  await Column.findByIdAndUpdate(columnId, { tasksIds });

  const result = await Task.findByIdAndDelete(id);
  if (!result) {
    throw handleHttpError(404, `Task with id: ${id} is not found`);
  }

  res.status(204).send();
};

const filterTasksByPriority = async (req, res) => {
  const { priority, columnId } = req.params;
  if (!mongooseObjectIdCheck(columnId)) {
    throw handleHttpError(
      400,
      `Bad request, columnId isn't match ObjectId mongoose type`
    );
  }
  const result = await Task.find(
    { column: columnId, priority },
    "-createdAt -updatedAt"
  );
  res.json(result);
};

module.exports = {
  getTaskById: ctrlWrapper(getTaskById),
  createTask: ctrlWrapper(createTask),
  updateTask: ctrlWrapper(updateTask),
  moveTask: ctrlWrapper(moveTask),
  deleteTask: ctrlWrapper(deleteTask),
  filterTasksByPriority: ctrlWrapper(filterTasksByPriority),
};
