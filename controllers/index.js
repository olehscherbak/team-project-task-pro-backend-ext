const {
  register,
  login,
  logout,
  update,
  avatarUpdate,
  getCurrentUser,
} = require("./auth");
const {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  getCurrentBoard,
  setCurrentBoard,
} = require("./boards");
const {
  createColumn,
  getColumnsByBoardId,
  updateColumn,
  moveColumn,
  deleteColumn,
} = require("./columns");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
  filterTasksByPriority,
} = require("./tasks");

const { sendEmail } = require("./sendEmail");
const { getAllMiniImg, getMiniImgById } = require("./miniImages");
const { getAllBackground, getBackgroundById } = require("./backgrounds");

module.exports = {
  register,
  login,
  logout,
  update,
  avatarUpdate,
  getCurrentUser,
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  createColumn,
  getColumnsByBoardId,
  updateColumn,
  moveColumn,
  deleteColumn,
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
  sendEmail,
  filterTasksByPriority,
  setCurrentBoard,
  getCurrentBoard,
  getAllMiniImg,
  getMiniImgById,
  getAllBackground,
  getBackgroundById,
};
