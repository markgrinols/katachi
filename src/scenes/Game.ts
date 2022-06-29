import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
//    this.load.image('logo', 'assets/phaser3-logo.png');
  }

  create() {
    const numRows: integer = 3
    const numCols: integer = 3
    const cellWidth: integer = 50
    const cellHeight: integer = 50
    const containerX: integer = 400 - (0.5 * numCols * cellWidth)
    const containerY: integer = 300 - (0.5 * numRows * cellHeight)

    const container = this.add.container(containerX, containerY)
    const cells: Array<Phaser.GameObjects.Rectangle> = []

    for(let i = 0; i < numRows * numCols; i++) {
      const col: integer = i % numCols
      const row: integer = ~~(i / numCols)
      const x = col * cellWidth
      const y = row * cellHeight
      const r = this.add.rectangle(x, y, cellWidth * 0.99, cellHeight * 0.99, 0x6666ff)
      r.setData('row', row)
      r.setData('col', col)
      r.setInteractive()
      r.on('clicked', (go:Phaser.GameObjects.Rectangle) => {
        console.log(`row ${row} col ${col}`)
        go.fillColor = Math.random() * 0xFFFFFF
      }, this)
      cells.push(r)
    }

    container.add(cells)

    let t = this.add.text(0,0,(new Date()).toString(), { fontSize: '16px', color:"#000" })

    this.input.on('gameobjectup', function (pointer: any, gameObject: any)
    {
        gameObject.emit('clicked', gameObject);
    }, this);
  }
}

