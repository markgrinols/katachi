/* eslint-disable require-jsdoc */
import Phaser from 'phaser';
import store from '../store';
import {userClicked} from '../reducers/input';
import Renderer from './Renderer';

export enum Direction {
  None = 0,
  Circle,
  Square,
  Triangle,
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
  currentChild!: Phaser.GameObjects.GameObject | null;
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

    this.debugLabel = scene.add.text(x - 8, y - 5, '',
        {fontSize: '16px', color: '#000'});
    this.debugLabel.setDepth(10);
  }

  tryRemoveCurrentChild() {
    this.currentChild?.destroy();
    this.currentChild = null;
  }

  setShape(dir: Direction, isGiven: boolean) {
    this.tryRemoveCurrentChild();

    const alpha = isGiven ? 0.7 : 1;
    switch (dir) {
      case Direction.None:
        this.currentChild = this.scene.add.rectangle(this.x, this.y,
            this.cellWidth, this.cellHeight, 0x0).setAlpha(0.01);
        break;
      case Direction.Circle:
        this.currentChild = this.scene.add.circle(this.x, this.y,
            this.cellWidth * 0.30, 0x666600).setAlpha(alpha);
        break;
      case Direction.Triangle:
        const ha = 35;
        this.currentChild = this.scene.add.triangle(this.x, this.y,
            0, ha, ha, ha, ha/2, 0, 0x00FF00).setAlpha(alpha);
        break;
      case Direction.Square:
        this.currentChild = this.scene.add.rectangle(this.x, this.y,
            this.cellWidth, this.cellHeight, 0x6666ff)
            .setScale(0.6).setAlpha(alpha);
        break;
      case Direction.Diamond:
        this.currentChild = this.scene.add.sprite(this.x, this.y, 'diamond')
            .setScale(0.6).setTintFill(0xF0C0FF).setAlpha(alpha);
        break;
      default:
        throw new Error();
    }

    this.currentChild.setInteractive();
    this.currentChild.on('clicked', (go: Phaser.GameObjects.Rectangle) => {
      store.dispatch(userClicked([this.row, this.col]));
    }, this);
  }

  setDebugLabel(s: string) {
    // this.debugLabel.text = s;
  }
}
