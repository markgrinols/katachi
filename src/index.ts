/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import config from './config';
import Renderer from './scenes/Renderer';
import {BoardManager} from './boardManager';

class Controller {
  boardManager;

  constructor() {
    this.boardManager = new BoardManager();

    new Phaser.Game(
        Object.assign(config, {
          scene: [Renderer],
        }),
    );
  }
}

new Controller();

/*

todo:
 - load board data from file on remote endpoint
 - when cell changes (after short delay), evaluate
      - does this row/col/box have any violations?
      - is puzzle completed?
 - convert all shapes to sprites - with transparent background
   - uniform size will simplify creation
      (just need a mapping from shape name to sprite name)
      this will also fix the hit area problem
   - hollow the shapes
 - count determines number of shapes so - 2 is 'plus',
     3 is triangle, 4 is square, 5 is star
 - stick with pastel colors for sure
 - button to reset the puzzle
 - visualization when box, col or row is not working
 - visualization when the puzzle is completed

*/
