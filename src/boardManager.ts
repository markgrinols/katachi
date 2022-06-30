/* eslint-disable require-jsdoc */
import store from './store';

/*
- stores/publishes board state
- subscribes to user input and updates board state
 */

export class BoardManager {
  constructor() {
    store.subscribe(() => this.stateUpdated());
  }

  stateUpdated() {
    console.log('state updated in board manager');
    console.log(store.getState().board);
  }

  receiveInput() {
    // what cell was tapped
    // array of what needs to change
  }

  get boardState() {
    return 33;
  }
}

