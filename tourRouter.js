const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route("/booked/:id")
  .get(authController.protect, tourController.getBookedTours);

router
  .route("/created/:id")
  .get(authController.protect, tourController.getCreatedTours);

router
  .route("/cancelBooking/:tripId/:userId")
  .patch(authController.protect, tourController.cancelBooking);

router
  .route("/:id")
  .get(authController.protect, tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
