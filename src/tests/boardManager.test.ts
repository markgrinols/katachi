import {BoardManager, PuzzleType} from '../boardManager';

const getBasePuzzle = () => {
  return {
    'dimensions': [],
    'shape_counts': {},
    'box_dimensions': [],
    'id': 0,
    'solution': [],
    'givens': [],
  } as PuzzleType;
};

describe('getShapeCountsInList', () => {
  it('should count the number of each shape value in data', async () => {
    const bm = new BoardManager();
    const counts = bm.getShapeCountsInList(3,
        [1, 1, 1, 2, 2, 3, 3, 3, 3]);
    expect(counts).toEqual({1: 3, 2: 2, 3: 4});
  });
});

describe('getShapeCountsPerRow', () => {
  it('should count the number of each shape in a row', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['shape_counts'] = {1: 1, 2: 2, 3: 3};
    const board = [
      0, 1, 3, 1,
      3, 1, 0, 0,
      2, 3, 0, 1,
      2, 3, 1, 2];

    const counts = bm.getShapeCountsPerRow(puzzle, board, 0);
    expect(counts).toEqual({1: 2, 2: 0, 3: 1});
  });
});

describe('getShapeCountsPerCol', () => {
  it('should count the number of each shape in a row', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['shape_counts'] = {1: 1, 2: 2, 3: 3};
    const board = [
      0, 1, 3, 1,
      3, 1, 0, 0,
      2, 3, 0, 1,
      2, 3, 1, 2];

    const counts = bm.getShapeCountsPerCol(puzzle, board, 1);
    expect(counts).toEqual({1: 2, 2: 0, 3: 2});
  });
});

/*
  box_dimensions: number[],
  dimensions: number[],
  shape_counts: CountsType,
  id: number,
  solution: number[],
  givens: number[]
*/