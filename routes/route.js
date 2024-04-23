const { Router } = require("express")
const { signup, login, addtask, gettask, updateTask, deletetask, retrivetask, activetask } = require("../controllars/logic")
const authenticateJWT = require("../middlewares/middleware")
const { taskSchema } = require("../modals/schema")
const mongoose = require("mongoose")
const router = Router()

router.post("/signup", signup)
router.post("/login", login)

router.post("/addtask", authenticateJWT, addtask)
router.get("/gettask", authenticateJWT, gettask)
router.patch("/updatetask/:id", authenticateJWT, updateTask)
router.delete("/deletetask/:id", authenticateJWT, deletetask)
router.post("/retrivetask", retrivetask)
router.get('/dashboard', activetask);


module.exports = router