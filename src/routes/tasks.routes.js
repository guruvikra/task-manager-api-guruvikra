import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  getTaskById,
  deleteTaskById,
  getTaskByPriority
} from "../controllers/tasks.controller.js";

const router = Router();

router.route("/").get(getAllTasks).post(createTask);
router.get("/priority/:level", getTaskByPriority);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTaskById);

export default router;
