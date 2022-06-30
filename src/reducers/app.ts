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

const {actions, reducer} = appSlice;
export const {loadBoardDataNow} = actions;
export default reducer;
