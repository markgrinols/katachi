/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import store from '../store';
import {loadBoardDataNow} from '../reducers/app';
import {updateCells} from '../reducers/board';
import Shape, {Direction} from './Shape';

export default class Renderer extends Phaser.Scene {
  cells: Array<Shape> = [];
  numRows = 0;
  numCols = 0;

  constructor() {
    super('Renderer');
    store.subscribe(() => this.onStateUpdated());
  }

  preload() {
    this.load.image('diamond', 'assets/diamond.png');
  }

  onStateUpdated() {
    const state = store.getState();
    const boardState = state.board;
    if (this.numRows == 0 && boardState.rows > 0) {
      this.numRows = boardState.rows;
      this.numCols = boardState.cols;
      this.customCreate();
    }

    if (boardState.cellUpdates && boardState.cellUpdates.length > 0) {
      boardState.cellUpdates.forEach( (update) => {
        const index = update[0];
        const value = update[1];
        const shape = this.cells[index];
        shape.setDebugLabel(value);
        shape.setShape(value as Direction); // only do this when data updates
      });
      store.dispatch(updateCells([]));
    }
  }

  create() {
    this.add.circle(400, 300, 2, 0xFF0000).setDepth(2);
    store.dispatch(loadBoardDataNow(true));
  }

  customCreate() {
    const cellWidth: integer = 50; // todo: calc this based on row/cols
    const cellHeight: integer = 50;

    const boardWidth = cellWidth * this.numCols;
    const boardHeight = cellHeight * this.numRows;

    // const containerX: integer = 400 - (0.5 * numCols * cellWidth);
    // const containerY: integer = 300 - (0.5 * numRows * cellHeight);

    for (let i = 0; i < this.numRows * this.numCols; i++) {
      const col: integer = i % this.numCols;
      const row: integer = ~~(i / this.numCols);

      const x = cellWidth * (col - ~~(this.numCols / 2)) +
            this.sys.game.canvas.width / 2;
      const y = cellHeight * (row - ~~(this.numRows / 2)) +
            this.sys.game.canvas.height / 2;

      const shape: Shape = new Shape(this, x, y, row, col,
          cellWidth, cellHeight);
      this.cells.push(shape);
    }

    this.add.text(0, 0, (new Date()).toString(),
        {fontSize: '12px', color: '#000'});

    this.input.on('gameobjectup', function(pointer: any, gameObject: any) {
      gameObject.emit('clicked', gameObject);
    }, this);
  }
}
