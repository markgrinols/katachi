/* eslint-disable require-jsdoc */
import {createSlice} from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    cellUpdates: [], // e.g. [[0,3]] (cell 0, value 3)
    cells: [] as number[],
    rows: 0,
    cols: 0,
  },
  reducers: {
    setRowsCols(state, action) {
      state.rows = action.payload[0];
      state.cols = action.payload[1];
    },
    updateCells(state, action) {
      state.cellUpdates = action.payload.cellUpdates;
      action.payload.cellUpdates?.forEach( (c: number[]) => {
        state.cells[c[0]] = c[1];
      });
    },
  },
});

const {actions, reducer} = boardSlice;
export const {updateCells, setRowsCols} = actions;
export default reducer;
