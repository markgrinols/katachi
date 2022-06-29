/* eslint-disable require-jsdoc */

/*

- stores/publishes board state
- subscribes to user input and updates board state

 */
import store from '../store';

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

