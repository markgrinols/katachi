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
