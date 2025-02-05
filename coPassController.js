const Tour = require("../model/tourModel");
const User = require("../model/userModel");
const CoPass = require("./../model/coPassStatus");

exports.getCoPassDetails = async (req, res) => {
  try {
    const tripList = await CoPass.findOne({ tripId: req.params.id });
    const coPassId = tripList.fellows;
    const coPassInfo = await User.find({ _id: { $in: coPassId } }).select({
      name: 1,
    });

    res.status(201).json({
      status: "success",
      data: {
        coPass: coPassInfo,
      },
    });
  } catch {
    res.status(400).json({
      status: "failed to create",
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const coPassInfo = await CoPass.find({
      $or: [{ creatorId: req.params.id }, { fellows: req.params.id }],
    }).select({
      name: 1,
      source: 1,
      destination: 1,
      _id: 0,
      tripId: 1,
      status: 1,
    });

    res.status(201).json({
      status: "success",
      data: {
        coPass: coPassInfo,
      },
    });
  } catch {
    res.status(400).json({
      status: "failed to create",
    });
  }
};

exports.completeTrip = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    const delcoPass = await CoPass.findOneAndUpdate(
      { tripId: tour._id },
      {
        status: "Completed",
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
