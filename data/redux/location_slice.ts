import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  permissionGranted: boolean;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  permissionGranted: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.permissionGranted = true;
    },
    setPermissionDenied: (state) => {
      state.permissionGranted = false;
    },
    setPermissionGranted: (state) => {
      state.permissionGranted = true
    }
  },
});

export const { setLocation, setPermissionDenied, setPermissionGranted } = locationSlice.actions;
export default locationSlice.reducer;