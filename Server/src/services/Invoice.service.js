import { ApiError } from "../utils/index.js";
import { User } from "../models/user.model.js";

export const tokenCountVerify = async (userId) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        uploadCount: { $gt: 0 },
      },
      {
        $inc: { uploadCount: -1 },
      },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      throw new ApiError(
        403,
        "Out of tokens. Please purchase more to continue."
      );
    }

    return { UpdatedToken: updatedUser?.uploadCount };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};
