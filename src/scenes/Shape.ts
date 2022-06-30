/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import store from '../store';
import {userClicked} from '../reducers/input';
import Renderer from './Renderer';

export enum Direction {
  Circle = 1,
  Square,
  Triange,
  Diamond,
}

export default class Shape {
  scene: Phaser.Scene;
  x;
  y;
  row;
  col;
  cellWidth;
  cellHeight;
  currentChild!: Phaser.GameObjects.GameObject;
  debugLabel: Phaser.GameObjects.Text;

  constructor(scene: Renderer,
      x: number, y: number, row: number, col: number,
      cellWidth: number, cellHeight: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;

    this.debugLabel = scene.add.text(x - 8, y - 5, 'd',
        {fontSize: '16px', color: '#000'});
    this.debugLabel.setDepth(10);
  }

  setShape(dir: Direction) {
    if (this.currentChild) {
      this.currentChild.destroy();
    }

    this.currentChild = this.scene.add.rectangle(this.x, this.y,
        this.cellWidth * 0.99, this.cellHeight * 0.99, 0x6666ff);

    // this.currentChild.setData('row', row);
    // this.currentChild.setData('col', col);
    this.currentChild.setInteractive();
    this.currentChild.on('clicked', (go: Phaser.GameObjects.Rectangle) => {
      // console.log(`row ${row} col ${col}`);
      store.dispatch(userClicked([this.row, this.col]));
    }, this);
  }

  setDebugLabel(s: string) {
    this.debugLabel.text = s;
  }
}
