const express = require("express")
const aiChatController = require("../controller/ai-chat/ai-chat")
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()

// gửi câu hỏi cho chatbot
router.post("/anlysisquestion", aiChatController.sendQuestion)
module.exports = router;