import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshToken = async (userId, _, next) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found for token generation."));
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Something went wrong while generating access or refresh token.",
        [error.message]
      )
    );
  }
};

export const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    return next(new ApiError(404, "All fields are required."));
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return next(new ApiError(409, "User with this email already exists."));
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return next(
      new ApiError(500, "Something went while registering the user.")
    );
  }

  return res.json(
    new ApiResponse(200, createdUser, "User registered successfully.")
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required."));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(404, "User doesn't exists."));
  }

  if (!password) {
    return next(new ApiError(400, "password is required."));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new ApiError(401, "Password is invalid."));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User loggedIn Successfully."
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "After",
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged Out successfully."));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json(
    new ApiResponse(200, req.user, "Current user fetched successfully.")
  );
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    (await req.cookies.refreshToken) || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new ApiError(401, "Unauthorized request."));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return next(new ApiError(401, "Invalid refresh token."));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(new ApiError(401, "Refresh token is expired or used."));
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed."
        )
      );
  } catch (error) {
    return next(new ApiError(401, "Invalid refresh token.", [error.message]));
  }
});
