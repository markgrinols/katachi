import {BoardManager, PuzzleType, CountsType} from '../boardManager';

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
    const puzzle = getBasePuzzle();
    puzzle['shape_counts'] = {1: 1, 2: 2, 3: 3};
    const counts = bm.getShapeCountsInList(puzzle,
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

describe('getShapeCountsPerBox', () => {
  it('should count the number of each shape in a box', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 2];
    puzzle['shape_counts'] = {1: 1, 2: 2, 3: 3};
    const board = [
      0, 1, 3, 1,
      3, 1, 0, 0,
      2, 3, 0, 1,
      2, 3, 1, 2];

    const counts = bm.getShapeCountsPerBox(puzzle, board, 1, 1);
    expect(counts).toEqual({1: 2, 2: 1, 3: 0});
  });
});

describe('getBox', () => {
  it('should get boxrow/col based on cell row/coll', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['box_dimensions'] = [2, 2];
    const result = bm.getBox(puzzle, 3, 5);
    expect(result).toEqual([1, 2]);
  });
});

describe('areCountsLegal', () => {
  it('should report validity of shape counts', async () => {
    const bm = new BoardManager();
    const maxCounts: CountsType = {1: 1, 2: 2, 3: 3};
    const actCounts: CountsType = {1: 1, 2: 3, 3: 3};
    const result = bm.areCountsLegal(maxCounts, actCounts);
    expect(result).toBe(false);
  });
});

describe('areAllShapesConnected', () => {
  it('should detect if all shapes in a box are conected - neg', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      1, 1, 2, 1,
      3, 3, 1, 3,
      2, 3, 1, 1,
      2, 3, 1, 2];

    const result = bm.areAllShapesConnected(puzzle, board, 0, 0);
    expect(result).toEqual(false);
  });
  it('should detect if all shapes in a box are conected - pos', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      3, 1, 2, 1,
      3, 3, 2, 2,
      2, 3, 1, 1,
      2, 3, 1, 2];

    const result = bm.areAllShapesConnected(puzzle, board, 0, 0);
    expect(result).toEqual(true);
  });
  it('should return true if there are any zeros', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      0, 2, 2, 1,
      3, 3, 2, 0,
      2, 3, 0, 1,
      2, 3, 1, 2];

    const result = bm.areAllShapesConnected(puzzle, board, 0, 0);
    expect(result).toEqual(true);
  });
});

//  isLegalMove(puzzle: PuzzleType, board: number[], row: number, col: number) {
describe('isLegalMove', () => {
  it('should detect if a move is legal - neg row count', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 1};
    const board = [
      3, 1, 2, 2,
      3, 2, 3, 2,
      2, 3, 1, 1,
      2, 3, 1, 2];
    const result = bm.isLegalMove(puzzle, board, 1, 2);
    expect(result).toEqual({'badrow': 1});
  });
  it('should detect if a move is legal - neg col count', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      3, 1, 2, 2,
      3, 3, 2, 2,
      2, 3, 1, 2,
      2, 3, 1, 2];
    const result = bm.isLegalMove(puzzle, board, 3, 3);
    expect(result).toEqual({'badcol': 3});
  });
  it('should detect if a move is legal - neg box count', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      3, 1, 2, 2,
      3, 3, 2, 2,
      2, 3, 1, 1,
      2, 3, 1, 2];
    const result = bm.isLegalMove(puzzle, board, 0, 0);
    expect(result).toEqual({'badbox-counts': [0, 0]});
  });
  it('should detect if a move is legal - positive!', async () => {
    const bm = new BoardManager();
    const puzzle = getBasePuzzle();
    puzzle['dimensions'] = [4, 4];
    puzzle['box_dimensions'] = [2, 4];
    puzzle['shape_counts'] = {1: 2, 2: 3, 3: 3};
    const board = [
      3, 1, 2, 2,
      3, 3, 2, 2,
      1, 3, 2, 1,
      3, 3, 2, 2];
    const result = bm.isLegalMove(puzzle, board, 2, 1);
    expect(result).toEqual({});
  });
});
