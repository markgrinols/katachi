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

      // square3x3,25006,2013-07-12T13:47:59.405Z,1.2173912525177002,25006,true,"<p id=""25006"" lb=""2"" ab=""3,4"">
      // answers: 211322333223332131333311222133233122133223312222113333311222333332131223322333211
      // givens: 34,52,27,4,50,43,59,75,12,38,47,2,14,76,30,46,16,6,21,8,13,61,66,28,42,22,54,17,32,77,71,64,45,0,40,53,69,29,37,49,26,19,36,20,5,24

      const boardData = [0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1,
        0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1,
        0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1, 0, 1, 2, 3, 0, 3, 2, 0, 1,
      ];
      const rows = 9;
      const cols = 9;

      store.dispatch(setRowsCols([rows, cols]));
      const cellUpdates = boardData.map((v, i) => {
        return [i, v];
      });
      store.dispatch(updateCells({cellUpdates}));
    }
  }
}
