/* eslint-disable require-jsdoc */
import {createSlice} from '@reduxjs/toolkit';

const inputSlice = createSlice({
  name: 'input',
  initialState: {click: []},
  reducers: {
    userClicked(state, action) {
      state.click = action.payload;
    },
    clearUserClicked(state, action) {
      state.click = [];
    },
  },
});

// Extract the action creators object and the reducer
const {actions, reducer} = inputSlice;
// Extract and export each action creator by name
export const {userClicked, clearUserClicked} = actions;
// Export the reducer, either as a default or named export
export default reducer;
