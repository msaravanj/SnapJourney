import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "imageUri",
  initialState: {
    value: null,
  },
  reducers: {
    updateImageUri: (state, action) => {
      state.value = action.payload;
    },
    removeImageUri: (state) => {
      state.value = null;
    },
  },
});

export const updateImageUri = imageSlice.actions.updateImageUri;
export const removeImageUri = imageSlice.actions.removeImageUri;
export default imageSlice.reducer;
