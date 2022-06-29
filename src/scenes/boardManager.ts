/* eslint-disable require-jsdoc */

/*

- stores/publishes board state
- subscribes to user input and updates board state

 */

export class BoardManager {
  x = 1;

  receiveInput() {
    // what cell was tapped
    // array of what needs to change
  }

  get boardState() {
    return this.x;
  }
}

