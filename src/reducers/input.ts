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

const {actions, reducer} = inputSlice;
export const {userClicked, clearUserClicked} = actions;
export default reducer;
