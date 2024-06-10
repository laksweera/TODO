import taskController from  "../controllers/task.controller.js";
import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";

const router = express.Router();


router.post("/createTask",userAuthentication,taskController.addTask);
router.get("/getTask/:id",taskController.getTaskById);
router.put("/updateStatus/:id",taskController.updateStatus);
router.get("/getAllTasks",userAuthentication,taskController.getAllTasks);
router.put ("/updateTask/:id",taskController.updateTaskById);
router.delete ("/deleteTask/:id",taskController.deleteById);
export default router;  