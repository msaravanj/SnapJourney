import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import locationReducer from "./slices/locationSlice";

export const store = configureStore({
  reducer: {
    imageUri: imageReducer,
    location: locationReducer,
  },
});
