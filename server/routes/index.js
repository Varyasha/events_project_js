const Router = require("express");
const router = new Router();
const eventRouter = require("./eventRouter");
const userRouter = require("./userRouter");
const invitationRouter = require("./invitationRouter");

router.use("/user", userRouter);
router.use("/event", eventRouter);
router.use("/invitation", invitationRouter);

module.exports = router;