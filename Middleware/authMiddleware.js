const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Admin = require("../Model/Admin.Model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      req.admin = await Admin.findById(decoded.id);

      if (!req.user && !req.admin) {
        throw new ApiError(401, "Not authorized, token failed");
      }


      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const deleteUnverifiedUsers = asyncHandler(async (req, res, next) => {
  try {

    const oneHourAgo = new Date(Date.now() - 3600000);

    const unverifiedUsers = await Admin.find({
      isVerified: false,
      createdAt: { $lt: oneHourAgo },
    });

    if (unverifiedUsers) {
      await Admin.deleteMany({
        isVerified: false,
        createdAt: { $lt: oneHourAgo },
      });
    }

    next();
  } catch (error) {
    res.status(401);
    throw new ApiError(401, "Not authorized, token failed");

  }
}
);




module.exports = { protect, deleteUnverifiedUsers };
