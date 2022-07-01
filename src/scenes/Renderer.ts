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
  cellWidth = 0;
  cellHeight = 0;
  regionWidth = 0;
  regionHeight = 0;
  canvasCenter!: {x: number, y: number};

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
      this.cellWidth = 50; // todo: calc this based on row/cols
      this.cellHeight = 50;
      this.regionWidth = boardState.regionWidth;
      this.regionHeight = boardState.regionHeight;
      this.canvasCenter = {x: this.sys.game.canvas.width / 2,
        y: this.sys.game.canvas.height / 2};
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
    this.add.circle(400, 300, 2, 0xFF0000).setDepth(2); // for debug
    store.dispatch(loadBoardDataNow(true));
  }

  drawGrid() {
    const darkAlpha = 0.4;
    const lightAlpha = 0.1;
    const boardWidth = this.cellWidth * this.numCols;
    const boardHeight = this.cellHeight * this.numRows;
    const border = this.add.rectangle(this.canvasCenter.x, this.canvasCenter.y,
        boardWidth, boardHeight, 0x0, 0.0);
    border.setStrokeStyle(2, 0x0, darkAlpha);
    border.isStroked = true;

    // vertical lines
    for (let col = 1; col < this.numCols; col++) {
      const x = this.cellWidth * (col - this.numCols / 2) +
            this.canvasCenter.x;
      const alpha = col % this.regionHeight == 0 ? darkAlpha : lightAlpha;
      this.add.line(x, this.canvasCenter.y, 0, -0, 0, boardHeight, 0x0, alpha);
    }
    // horizontal lines
    for (let row = 1; row < this.numRows; row++) {
      const y = this.cellHeight * (row - this.numRows / 2) +
            this.canvasCenter.y;
      const alpha = row % this.regionWidth == 0 ? darkAlpha : lightAlpha;
      this.add.line(this.canvasCenter.x, y, 0, 0, boardWidth, 0, 0x0, alpha);
    }
  }

  customCreate() {
    this.drawGrid();

    for (let i = 0; i < this.numRows * this.numCols; i++) {
      const col: integer = i % this.numCols;
      const row: integer = ~~(i / this.numCols);

      const x = this.cellWidth * (col - ~~(this.numCols / 2)) +
            this.sys.game.canvas.width / 2;
      const y = this.cellHeight * (row - ~~(this.numRows / 2)) +
            this.sys.game.canvas.height / 2;

      const shape: Shape = new Shape(this, x, y, row, col,
          this.cellWidth, this.cellHeight);
      this.cells.push(shape);
    }

    this.add.text(0, 0, (new Date()).toString(),
        {fontSize: '12px', color: '#000'});

    this.input.on('gameobjectup', function(pointer: any, gameObject: any) {
      gameObject.emit('clicked', gameObject);
    }, this);
  }
}
