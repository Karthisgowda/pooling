const coPass = require("../model/coPassStatus");
const User = require("../model/userModel");
const Tour = require("./../model/tourModel");
const APIFeatures = require("./../util/APIfeature");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
exports.getBookedTours = async (req, res) => {
  try {
    // EXECUTE QUERY

    const user = await User.findById(req.params.id);
    const tourId = user.booked;

    const tours = await Tour.find({ _id: { $in: tourId } });

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.tripId,
      { $inc: { seatsLeft: +1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    const newCopass = await coPass.findOneAndUpdate(
      { tripId: req.params.tripId },
      {
        $pull: { fellows: req.params.userId },
      }
    );
    const upUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $pull: { booked: req.params.tripId },
      },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: {
        tour,
        upUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Bad request",
    });
  }
};

exports.getCreatedTours = async (req, res) => {
  try {
    // EXECUTE QUERY

    const user = await User.findById(req.params.id);
    const tourId = user.created;

    const tours = await Tour.find({ _id: { $in: tourId } });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failes",
      message: "Bad request",
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    const upUser = await User.findByIdAndUpdate(
      req.body.creatorId,
      {
        $push: { created: newTour._id },
      },
      { new: true }
    );

    const newcoPass = await coPass.create({
      tripId: newTour._id,
      creatorId: newTour.creatorId,
      source: newTour.source,
      destination: newTour.destination,
      tripDtae: newTour.startDate,
    });

    res.status(201).json({
      status: "succcess",
      data: {
        tour: newTour,
        Copass: newcoPass,
        upUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $inc: { seatsLeft: -1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    const newCopass = await coPass.findOneAndUpdate(
      { tripId: tour._id },
      {
        $push: { fellows: req.body.userId },
      }
    );
    const upUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { booked: tour._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: {
        tour,
        upUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Bad request",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    const delcoPass = await coPass.findOneAndUpdate(
      { tripId: tour._id },
      {
        status: "Cancelled",
      }
    );
    await User.updateMany(
      { booked: tour._id },
      {
        $pull: { booked: tour._id },
      }
    );

    const upUser = await User.findOneAndUpdate(
      { created: tour._id },
      { $pull: { created: tour._id } },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        tour,
        delcoPass,
        upUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Bad requesr",
    });
  }
};
