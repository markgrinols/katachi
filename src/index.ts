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
 - draw a shape
 - update shape based on data values

 - load board data from file on remote endpoint
 - add shape shifting logic
 - when cell changes, evaluate good/bad
 - build out board in renderer after cols/rows has been set
*/
