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
  previousError = {issue: '', data: []};
  rowErrorShape!: Phaser.GameObjects.Rectangle;
  colErrorShape!: Phaser.GameObjects.Rectangle;
  boxErrorShape!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('Renderer');
    store.subscribe(() => this.onStateUpdated());
  }

  preload() {
    this.load.image('diamond', 'assets/diamond.png');
    this.load.image('plus', 'assets/plus.png');
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
      this.setupBoard();
    }

    if (boardState.cellUpdates && boardState.cellUpdates.length > 0) {
      boardState.cellUpdates.forEach( (update: number[]) => {
        const index = update[0];
        const value = update[1];
        const shape = this.cells[index];
        const isAGiven = update.length === 3 && update[2] !== undefined;
        shape.setShape(value as Direction, isAGiven);
      });

      store.dispatch(updateCells([]));
    }

    if (boardState.error.issue != this.previousError.issue) {
      console.log(boardState.error);
      const error = boardState.error;
      this.previousError = error;
      if (error.issue == '') {
        this.hideErrorShapes();
      } else if (error.issue == 'badrow') {
        this.setRowError(error.data[0]);
      } else if (error.issue == 'badcol') {
        this.setColError(error.data[0]);
      } else if (error.issue.startsWith('badbox')) {
        this.setBoxError(error.data[0], error.data[1]);
      }
    }
  }

  create() {
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
      const alpha = col % this.regionWidth == 0 ? darkAlpha : lightAlpha;
      this.add.line(x, this.canvasCenter.y, 0, -0, 0, boardHeight, 0x0, alpha);
    }
    // horizontal lines
    for (let row = 1; row < this.numRows; row++) {
      const y = this.cellHeight * (row - this.numRows / 2) +
            this.canvasCenter.y;
      const alpha = row % this.regionHeight == 0 ? darkAlpha : lightAlpha;
      this.add.line(this.canvasCenter.x, y, 0, 0, boardWidth, 0, 0x0, alpha);
    }
  }

  setupErrorShapes() {
    const boardWidth = this.cellWidth * this.numCols;
    const boardHeight = this.cellHeight * this.numRows;
    const margin = 2;
    this.rowErrorShape = this.add.rectangle(this.canvasCenter.x,
        this.canvasCenter.y,
        boardWidth - margin, this.cellHeight - margin, 0x0, 0.0);
    this.rowErrorShape.setStrokeStyle(1, 0xFF0000, 0.5).setDepth(1);
    this.rowErrorShape.setVisible(false);
    this.colErrorShape = this.add.rectangle(this.canvasCenter.x,
        this.canvasCenter.y,
        this.cellWidth - margin, boardHeight - margin, 0x0, 0.0);
    this.colErrorShape.setStrokeStyle(1, 0xFF0000, 0.5).setDepth(1);
    this.colErrorShape.setVisible(false);
    this.boxErrorShape = this.add.rectangle(this.canvasCenter.x,
        this.canvasCenter.y,
        this.cellWidth * this.regionWidth - margin,
        this.cellHeight * this.regionHeight - margin, 0x0, 0.0);
    this.boxErrorShape.setStrokeStyle(1, 0xFF0000, 0.5).setDepth(1);
    this.boxErrorShape.setVisible(false);
  }

  addShapes() {
    for (let i = 0; i < this.numRows * this.numCols; i++) {
      const col: integer = i % this.numCols;
      const row: integer = ~~(i / this.numCols);

      const x = this.cellWidth * (col - this.numCols / 2 + 0.5) +
            this.sys.game.canvas.width / 2;
      const y = this.cellHeight * (row - this.numRows / 2 + 0.5) +
            this.sys.game.canvas.height / 2;

      const shape: Shape = new Shape(this, x, y, row, col,
          this.cellWidth, this.cellHeight);
      this.cells.push(shape);
    }
  }

  setRowError(row: number) {
    const y = this.cellHeight * (row - this.numRows / 2 + 0.5) +
        this.canvasCenter.y;
    this.rowErrorShape.setY(y);
    this.rowErrorShape.setVisible(true);
  }

  setColError(col: number) {
    const x = this.cellWidth * (col - this.numCols / 2 + 0.5) +
        this.canvasCenter.x;
    this.colErrorShape.setX(x);
    this.colErrorShape.setVisible(true);
  }

  setBoxError(boxCol: number, boxRow: number) {
    const x = this.cellWidth * this.regionWidth *
        (boxCol - this.numCols / this.regionWidth / 2 + 0.5) +
        this.canvasCenter.x;
    const y = this.cellHeight * this.regionHeight *
        (boxRow - this.numRows / this.regionHeight / 2 + 0.5) +
        this.canvasCenter.y;
    this.boxErrorShape.setX(x);
    this.boxErrorShape.setY(y);
    this.boxErrorShape.setVisible(true);
  }

  hideErrorShapes() {
    this.rowErrorShape.setVisible(false);
    this.colErrorShape.setVisible(false);
    this.boxErrorShape.setVisible(false);
  }

  setupBoard() {
    this.drawGrid();
    this.addShapes();
    this.setupErrorShapes();
    this.input.on('gameobjectup', function(pointer: any, gameObject: any) {
      gameObject.emit('clicked', gameObject);
    }, this);
  }
}
