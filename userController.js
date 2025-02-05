const User = require("./../model/userModel");

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

exports.getUser = async (req, res) => {
  try {
    const person = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        person,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Bad request",
    });
  }
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Bad request",
    });
  }
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
