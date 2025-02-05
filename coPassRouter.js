const express = require("express");
const router = express.Router();
const coPassController = require("../controllers/coPassController");
const authController = require("./../controllers/authController");

router
  .route("/:id")
  .get(authController.protect, coPassController.getCoPassDetails)
  .delete(authController.protect, coPassController.completeTrip);

router
  .route("/status/:id")
  .get(authController.protect, coPassController.getStatus);

module.exports = router;
