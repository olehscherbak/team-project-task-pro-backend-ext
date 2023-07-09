const { ctrlWrapper, handleHttpError } = require("../helpers");
const { Board } = require("../models");
const { Column } = require("../models");
const { Task } = require("../models");

const getColumnsByBoardId = async (req, res) => {
  const { boardId } = req.params;

  const userColumns =
    (await Column.find({ board: boardId }, "-createdAt -updatedAt")) || [];

  res.status(201).json(userColumns);
};

const createColumn = async (req, res) => {
  const { boardId } = req.params;
  const result = await Column.create({ ...req.body, board: boardId });

  const { _id: newColumnId } = result;
  let { columnsIds } = await Board.findById(boardId);
  columnsIds.push(newColumnId);
  await Board.findByIdAndUpdate(boardId, { columnsIds });

  res.status(201).json(result);
};

const updateColumn = async (req, res) => {
  const { id } = req.params;

  const updatedColumn = await Column.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedColumn) throw handleHttpError(404, "Column not found");

  res.json(updatedColumn);
};

const moveColumn = async (req, res) => {
  const { id } = req.params;
  const { indexStart, indexFinish } = req.body;

  const updatedColumn = await Column.findById(id);

  if (!updatedColumn) throw handleHttpError(404, "Column not found");
  const { board: boardId } = updatedColumn;

  const { columnsIds } = await Board.findById(boardId);

  columnsIds.splice(indexStart, 1);
  columnsIds.splice(indexFinish, 0, id);

  await Board.findByIdAndUpdate(boardId, { columnsIds });

  res.json("move column success");
};

const deleteColumn = async (req, res) => {
  const { id } = req.params;

  const column = await Column.findById(id);
  if (!column) throw handleHttpError(404, "Column not found");

  const tasks = (await Task.find({ column }, "-createdAt -updatedAt")) || [];

  tasks.forEach(async (task) => {
    await Task.findByIdAndDelete(task._id);
  });

  const { board: boardId } = await Column.findById(id);

  let { columnsIds } = await Board.findById(boardId);
  const columnIndex = columnsIds.indexOf(id);
  if (columnIndex === -1) {
    throw handleHttpError(
      500,
      `Bad column index for removing column from columnsIds list`
    );
  }
  columnsIds.splice(columnIndex, 1);
  await Board.findByIdAndUpdate(boardId, { columnsIds });

  const deletedColumn = await Column.findByIdAndDelete(id);

  res.json({ message: "Column deleted" });
};

module.exports = {
  createColumn: ctrlWrapper(createColumn),
  updateColumn: ctrlWrapper(updateColumn),
  moveColumn: ctrlWrapper(moveColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
  getColumnsByBoardId: ctrlWrapper(getColumnsByBoardId),
};
