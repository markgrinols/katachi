/* eslint-disable require-jsdoc */
import store from './store';
import {clearUserClicked} from './reducers/input';
import {loadBoardDataNow} from './reducers/app';
import {updateCells, setRowsCols} from './reducers/board';

export class BoardManager {
  constructor() {
    store.subscribe(() => this.onStateUpdated());
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
      const currVal = state.board.cells[index];
      const payload = [index, (currVal + 1)% 5];
      const cellUpdates = [payload];
      store.dispatch(updateCells({cellUpdates}));
    }

    const appState = state.app;
    if (appState.loadBoardDataNow) {
      store.dispatch(loadBoardDataNow(false));
      console.log(`load data now: ${appState.loadBoardDataNow}`);

      const boardData = [0, 1, 2, 3, 0, 3, 2, 0, 1];
      const rows = 3;
      const cols = 3;

      store.dispatch(setRowsCols([rows, cols]));
      const cellUpdates = boardData.map((v, i) => {
        return [i, v];
      });
      store.dispatch(updateCells({cellUpdates}));
    }
  }
}
