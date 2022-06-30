/* eslint-disable require-jsdoc */
import store from './store';
import {clearUserClicked} from './reducers/input';
import {loadBoardDataNow} from './reducers/app';

export class BoardManager {
  constructor() {
    store.subscribe(() => this.stateUpdated());
  }

  stateUpdated() {
    const state = store.getState();
    // console.log('boardmanager stateupdated');
    // console.log(state);
    const inputState = state.input;
    if (inputState.click.length === 2) {
      const row = inputState.click[0];
      const col = inputState.click[1];
      console.log(`User clicked at: ${row} ${col}`);
      store.dispatch(clearUserClicked(null));
    }

    const appState = state.app;
    if (appState.loadBoardDataNow) {
      console.log(`load data now: ${appState.loadBoardDataNow}`);
      store.dispatch(loadBoardDataNow(false));
    }

    // console.log('state updated in board manager');
    // console.log(store.getState().board);
  }
}

/*
store usage:

BoardManager:
Listens for:
- load_data_now! action
- user_clicked

dispatches:
- clears load_data_now
- shape_updates (shapeType: number, isCorrect: boolean)
- puzzle_completion_state(inProgress, completed_failed, completed_success)
- clear user clicked

Renderer:
Listens for:
- shape_updates
- puzzle_completion_state

dispatches:
- load_data_now!
- clear_shape_updates
- user_clicked


*/
