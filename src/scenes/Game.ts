/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import {BoardManager} from './boardManager';
import store from '../store';
import {setBoard} from '../reducers';

export default class Demo extends Phaser.Scene {
  boardManager: BoardManager;

  constructor() {
    super('GameScene');
    this.boardManager = new BoardManager();
  }

  preload() {
    //    this.load.image('logo', 'assets/phaser3-logo.png');
    store.dispatch(setBoard([1, 2, 3, 3, 2, 1, 2, 2, 2]));
  }

  create() {
    const numRows: integer = 3;
    const numCols: integer = 3;
    const cellWidth: integer = 50;
    const cellHeight: integer = 50;
    const containerX: integer = 400 - (0.5 * numCols * cellWidth);
    const containerY: integer = 300 - (0.5 * numRows * cellHeight);

    const container = this.add.container(containerX, containerY);
    const cells: Array<Phaser.GameObjects.Rectangle> = [];

    for (let i = 0; i < numRows * numCols; i++) {
      const col: integer = i % numCols;
      const row: integer = ~~(i / numCols);
      const x = col * cellWidth;
      const y = row * cellHeight;
      const r = this.add.rectangle(x, y, cellWidth * 0.99,
          cellHeight * 0.99, 0x6666ff);
      r.setData('row', row);
      r.setData('col', col);
      r.setInteractive();
      r.on('clicked', (go: Phaser.GameObjects.Rectangle) => {
        console.log(`row ${row} col ${col}`);
        go.fillColor = Math.random() * 0xFFFFFF;
      }, this);
      cells.push(r);
    }

    container.add(cells);

    this.add.text(0, 0, (new Date()).toString(),
        {fontSize: '16px', color: '#000'});

    this.input.on('gameobjectup', function(pointer: any, gameObject: any) {
      gameObject.emit('clicked', gameObject);
    }, this);
  }
}


/*
Game -
  - sets up redux
BoardLoader
  - downloads, provides puzzle data
BoardManager
  - manages game state
Renderer
  - draws board based on game state
  - detects/forwards input events
  -


todo:
 - add shape shifting logic
 - load up the matrix based onm data to start
 - when cell changes, evaluate good/bad
 - unod

*/
