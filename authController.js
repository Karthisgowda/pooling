const catchAsync = require("../Util/catchAsync");
const User = require("./../model/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    imageUrl: req.body.imageUrl,
    dlNo: req.body.dlNo,
    address: req.body.address,
    gender: req.body.gender,
    occupation: req.body.occupation,
    phNo: req.body.phNo,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "user login error",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  //  if(await bcrypt.compare(user.password,password))
  //     {
  //         return res.status(400).json({
  //             message:"user login error"
  //         });
  //     }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      message: "Incorrect email or password",
    });
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token: token,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.token) {
    return res.status(400).json({
      status: "fail",
      message: "Authorization revaoked",
    });
  }

  const token = req.headers.token;
  const verified = await jwt.verify(token, process.env.JWT_SECRET);

  // const user = Tour.fincOne({verified.})
  next();
});
