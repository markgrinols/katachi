/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import store from '../store';
import {userClicked} from '../reducers/input';
import {loadBoardDataNow} from '../reducers/app';
import {updateCells} from '../reducers/board';


export default class Renderer extends Phaser.Scene {
  cells: Array<Phaser.GameObjects.Rectangle> = [];
  labels: Array<Phaser.GameObjects.Text> = [];
  numRows = 0;
  numCols = 0;

  constructor() {
    super('Renderer');
    store.subscribe(() => this.stateUpdated());
  }

  preload() {
  }

  stateUpdated() {
    //  scenarios - full board update, single cell udpate
    const state = store.getState();
    const boardState = state.board;
    if (this.numRows == 0 && boardState.rows > 0) {
      this.numRows = boardState.rows;
      this.numCols = boardState.cols;
    }

    if (boardState.cellUpdates && boardState.cellUpdates.length > 0) {
      boardState.cellUpdates.forEach( (update) => {
        const index = update[0];
        const value = update[1];
        this.labels[index].text = value;
      });
      store.dispatch(updateCells([]));
    }
  }

  create() {
    const numRows: integer = 3;
    const numCols: integer = 3;
    const cellWidth: integer = 50;
    const cellHeight: integer = 50;
    const containerX: integer = 400 - (0.5 * numCols * cellWidth);
    const containerY: integer = 300 - (0.5 * numRows * cellHeight);

    const container = this.add.container(containerX, containerY);

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
        // console.log(`row ${row} col ${col}`);
        go.fillColor = Math.random() * 0xFFFFFF;
        store.dispatch(userClicked([row, col]));
      }, this);

      this.labels.push(this.add.text(x, y, 'x',
          {fontSize: '16px', color: '#000'}));

      this.cells.push(r);
    }

    container.add(this.cells);
    container.add(this.labels);

    this.add.text(0, 0, (new Date()).toString(),
        {fontSize: '16px', color: '#000'});

    this.input.on('gameobjectup', function(pointer: any, gameObject: any) {
      gameObject.emit('clicked', gameObject);
    }, this);

    store.dispatch(loadBoardDataNow(true));
  }
}
