import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    value: [45.815399, 15.966568],
    address: "Unknown address",
  },
  reducers: {
    updateLocation: (state, action) => {
      state.value = action.payload;
    },
    updateLocationName: (state, action) => {
      state.address = action.payload;
    },
    resetLocation: (state) => {
      state.value = [45.815399, 15.966568];
      state.address = "Unknown address";
    },
  },
});

export const updateLocation = locationSlice.actions.updateLocation;
export const updateLocationName = locationSlice.actions.updateLocationName;
export const resetLocation = locationSlice.actions.resetLocation;
export default locationSlice.reducer;
