/* eslint-disable require-jsdoc */
import store from './store';
import {clearUserClicked} from './reducers/input';
import {loadBoardDataNow} from './reducers/app';
import {updateCells, setRowsCols} from './reducers/board';
import {PuzzleLoader} from './PuzzleLoader';

export class BoardManager {
  puzzle!: {boxSize: number[], dimensions: number[], circles: number,
      otherShapes: number[], id: number, vals: number[], givens: number[]};

  constructor() {
    store.subscribe(() => this.onStateUpdated());
  }

  loadBoardData() {
    store.dispatch(loadBoardDataNow(false));
    const loader = new PuzzleLoader();
    this.puzzle = loader.getPuzzle();
    const rows = this.puzzle.dimensions[0];
    const cols = this.puzzle.dimensions[1];
    const regionWidth = this.puzzle.boxSize[0];
    const regionHeight = this.puzzle.boxSize[1];

    store.dispatch(setRowsCols([rows, cols, regionWidth, regionHeight]));

    const cellUpdates = this.puzzle.vals.map((v, i) => {
      const val = (this.puzzle.givens.includes(i)) ? v : 0;
      return [i, val, true];
    });
    store.dispatch(updateCells({cellUpdates}));
  }

  onStateUpdated() {
    const state = store.getState();

    const inputState = state.input;
    if (inputState.click.length === 2) {
      const row = inputState.click[0];
      const col = inputState.click[1];
      console.log(`User clicked at: ${row} ${col}`);
      store.dispatch(clearUserClicked(null));

      const index = state.board.cols * row + col;
      if (!this.puzzle.givens.includes(index)) {
        const currVal = state.board.cells[index];
        const newVal = (currVal + 1) % (this.puzzle.otherShapes.length + 2);
        const payload = [index, newVal];
        if (this.puzzle.vals[index] === newVal) {
          console.log('nice');
        }
        const cellUpdates = [payload];
        store.dispatch(updateCells({cellUpdates}));
      }
    }

    const appState = state.app;
    if (appState.loadBoardDataNow) {
      this.loadBoardData();
    }
  }
}
