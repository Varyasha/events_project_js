const Router = require("express");
const router = new Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, eventController.create);
router.put("/edit", authMiddleware, eventController.edit);
router.delete("/", authMiddleware, eventController.delete);
router.get("/", authMiddleware, eventController.getAll);
router.get("/:id", authMiddleware, eventController.getOne);
module.exports = router;