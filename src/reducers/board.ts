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

// Extract the action creators object and the reducer
const {actions, reducer} = boardSlice;
// Extract and export each action creator by name
export const {updateCells, setRowsCols} = actions;
// Export the reducer, either as a default or named export
export default reducer;
