/* eslint-disable require-jsdoc */

export class PuzzleLoader {
  getPuzzle() {
    return {
      region: [3, 3],
      dimensions: [9, 9],
      circles: 2,
      otherShapes: [3, 4],
      id: 25006,
      vals: '211322333223332131333311222133233122133223312222113333311222333332131223322333211'
        .split('').map( (v) => parseInt(v)),
      givens: [34,52,27,4,50,43,59,75,12,38,47,2,14,76,30,46,16,6,21,8,13,61,66,28,42,22,54,17,32,77,71,64,45,0,40,53,69,29,37,49,26,19,36,20,5,24]
    }
  }
}
