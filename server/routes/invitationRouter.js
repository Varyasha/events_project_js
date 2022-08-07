const Router = require("express");
const router = new Router();
const invitationController = require("../controllers/invitationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, invitationController.create);
router.put("/answer", authMiddleware, invitationController.answer);
router.get("/", authMiddleware, invitationController.getAll);

module.exports = router;