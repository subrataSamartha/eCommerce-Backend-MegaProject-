import Collection from "../models/collection.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";

/*******************************************************************************************************************
 * @CREATE_COLLECTION
 * @route http://localhost:4000/api/collection
 * @description User will be able to reset password based on url token
 * @parameters token from url, password and confirm password
 * @return User object
 *
 *****************************************************************************************************************/
export const createColection = asyncHandler(async (req, res) => {
  //take name from frontend and add this name to database
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  const collection = await Collection.create({
    name,
  });

  //send this response value to frontend
  res.status(200).json({
    success: true,
    message: "Collection created successfully",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  //existing value to be updates
  const { id: collectionId } = req.params;

  //new value to get updated
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let updateCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateCollection) {
    throw new CustomError("Collection name is required", 400);
  }

  //send response to front end
  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    updateCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

  if (!collectionToDelete) {
    throw new CustomError("Collection not found", 400);
  }

  collectionToDelete.remove();

  //send response to front end
  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
    collectionToDelete,
  });
});

export const getAllCollection = asyncHandler(async (req, res) => {
  const collections = await Collection.find();
  if (!collections) {
    throw new CustomError("No Collection found", 400);
  }

  res.status(200).json({
    success: true,
    collections,
  });
});
