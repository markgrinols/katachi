/* eslint-disable require-jsdoc */
import {createSlice} from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {loadBoardDataNow: false},
  reducers: {
    loadBoardDataNow(state, action) {
      state.loadBoardDataNow = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const {actions, reducer} = appSlice;
// Extract and export each action creator by name
export const {loadBoardDataNow} = actions;
// Export the reducer, either as a default or named export
export default reducer;
