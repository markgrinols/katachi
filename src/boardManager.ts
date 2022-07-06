/* eslint-disable require-jsdoc */
import {clearUserClicked} from './reducers/input';
import {loadBoardDataNow} from './reducers/app';
import {updateCells, updateError, setRowsCols} from './reducers/board';
import {PuzzleLoader} from './PuzzleLoader';
import store from './store';

export type CountsType = { [key: number]: number };
export type PuzzleType = {
  box_dimensions: number[],
  dimensions: number[],
  shape_counts: CountsType,
  id: number,
  solution: number[],
  givens: number[]
};

export class BoardManager {
  puzzle!: PuzzleType;

  constructor() {
    store.subscribe(() => this.onStateUpdated());
  }

  loadBoardData() {
    store.dispatch(loadBoardDataNow(false));
    const loader = new PuzzleLoader();
    this.puzzle = loader.getPuzzle();
    const rows = this.puzzle.dimensions[0];
    const cols = this.puzzle.dimensions[1];
    const regionWidth = this.puzzle.box_dimensions[0];
    const regionHeight = this.puzzle.box_dimensions[1];

    store.dispatch(setRowsCols([rows, cols, regionWidth, regionHeight]));

    const cellUpdates = this.puzzle.solution.map((v, i) => {
      const val = (this.puzzle.givens.includes(i)) ? v : 0;
      return [i, val, true];
    });
    store.dispatch(updateCells({cellUpdates}));
  }

  // todo: move this to the view layer
  async delay(ms: number, func: { (): void; (): any; }) {
    await new Promise<void>( (resolve) => setTimeout(()=>resolve(), ms))
        .then(() => func());
  }
  // cal this from an async message
  //         await this.delay(1000, () => this.checkBoard(index));

  getShapeCountsInList(puzzle: PuzzleType, data: number[]) {
    const numShapes = Object.keys(puzzle['shape_counts']).length;
    const counts: CountsType = {};
    for (let i:number = 1; i < numShapes + 1; i++) {
      const count = data.filter( (d) => d === i).length;
      counts[i] = count;
    }
    return counts;
  }

  getShapeCountsPerRow(puzzle: PuzzleType, board: number[], rowIndex: number) {
    const cols = puzzle.dimensions[1];
    const start = cols * rowIndex;
    const rowData = board.slice(start, start + cols);
    return this.getShapeCountsInList(puzzle, rowData);
  }

  getShapeCountsPerCol(puzzle: PuzzleType, board: number[], colIndex: number) {
    const cols = puzzle.dimensions[1];
    const start = colIndex;
    const colData = [];
    for (let i = start; i < board.length; i = i + cols) {
      colData.push(board[i]);
    }
    return this.getShapeCountsInList(puzzle, colData);
  }

  getShapeCountsPerBox(puzzle: PuzzleType, board: number[],
      boxRow: number, boxCol: number) {
    const cols = puzzle.dimensions[1];
    const rowsInBox = puzzle['box_dimensions'][0];
    const colsInBox = puzzle['box_dimensions'][1];
    const boxStartRow = boxRow * rowsInBox;
    const boxStartCol = boxCol * colsInBox;

    const boxData = [];
    for (let r = boxStartRow; r < boxStartRow + rowsInBox; r++) {
      for (let c = boxStartCol; c < boxStartCol + colsInBox; c++) {
        const i = r * cols + c;
        boxData.push(board[i]);
      }
    }

    return this.getShapeCountsInList(puzzle, boxData);
  }

  areCountsLegal(maxShapeCounts: CountsType, shapeCounts: CountsType) {
    const c = Object.keys(maxShapeCounts).length;
    for ( let s = 1; s < c + 1; s++) {
      if (shapeCounts[s] > maxShapeCounts[s]) {
        return false;
      }
    }
    return true;
  }

  areAllShapesConnected(puzzle: PuzzleType, board: number[],
      boxRow: number, boxCol: number) {
  // get list of locations of each non circle shape
  // go through each and find any cell that shares row or col
  // && other dim is only 1 away
    const cols = puzzle.dimensions[1];
    const rowsInBox = puzzle['box_dimensions'][0];
    const colsInBox = puzzle['box_dimensions'][1];
    const boxStartRow = boxRow * rowsInBox;
    const boxStartCol = boxCol * colsInBox;

    for (let s = 1; s < Object.keys(puzzle['shape_counts']).length + 1; s++) {
      if (s === 1) {
        continue; // skip circles
      }

      for (let baseR = boxStartRow; baseR < boxStartRow + rowsInBox; baseR++) {
        for (let baseC = boxStartCol;
          baseC < boxStartCol + colsInBox; baseC++) {
          const i = baseR * cols + baseC;
          if (board[i] == 0) {
            return true; // don't do this evaluation of the box has blanks
          }
          if (board[i] !== s) {
            continue;
          }
          let thisBaseHasAtLeastOneMatchingConnector = false;
          for (let r = boxStartRow; r < boxStartRow + rowsInBox; r++) {
            for (let c = boxStartCol; c < boxStartCol + colsInBox; c++) {
              const j = r * cols + c;
              if (board[j] !== s || (baseR == r && baseC == c)) {
                continue;
              }
              if ((baseR == r && Math.abs(c - baseC) == 1) ||
                  (baseC == c && Math.abs(r - baseR) == 1)) {
                thisBaseHasAtLeastOneMatchingConnector = true;
              }
            }
          }
          if (!thisBaseHasAtLeastOneMatchingConnector) {
            return false;
          }
        }
      }
    }
    return true;
  }

  getRowCol(index: number, cols: number) {
    return [~~(index / cols), index % cols];
  }

  getBox(puzzle: PuzzleType, row: number, col: number) {
    const boxRows = puzzle['box_dimensions'][0];
    const boxCols = puzzle['box_dimensions'][1];
    const boxRow = ~~(row / boxRows);
    const boxCol = ~~(col / boxCols);
    return [boxRow, boxCol];
  }

  isLegalMove(puzzle: PuzzleType, board: number[], row: number, col: number) {
    let counts = this.getShapeCountsPerRow(puzzle, board, row);
    if (!this.areCountsLegal(puzzle['shape_counts'], counts)) {
      return {issue: 'badrow', data: [row]};
    }

    counts = this.getShapeCountsPerCol(puzzle, board, col);
    if (!this.areCountsLegal(puzzle['shape_counts'], counts)) {
      return {issue: 'badcol', data: [col]};
    }

    const [boxRow, boxCol] = this.getBox(puzzle, row, col);
    counts = this.getShapeCountsPerBox(puzzle, board, boxRow, boxCol);
    if (!this.areCountsLegal(puzzle['shape_counts'], counts)) {
      return {issue: 'badbox-count', data: [boxRow, boxCol]};
    }

    if (!this.areAllShapesConnected(puzzle, board, boxRow, boxCol)) {
      return {issue: 'badbox-connection', data: [boxRow, boxCol]};
    }

    return {issue: '', data: []};
  }

  checkBoard(puzzle: PuzzleType, board: number[], index: number) {
    const [row, col] = this.getRowCol(index, puzzle['dimensions'][1]);
    const result = this.isLegalMove(puzzle, board, row, col);
    store.dispatch(updateError({result}));
  }

  async handleIncrementShape() {
    const state = store.getState();
    const inputState = state.input;
    if (inputState.click.length === 2) {
      store.dispatch(clearUserClicked(null));
      const row = inputState.click[0];
      const col = inputState.click[1];
      console.log(`User clicked at: ${row} ${col}`);

      const index = state.board.cols * row + col;
      if (!this.puzzle.givens.includes(index)) {
        const currVal = state.board.cells[index];
        const newVal = (currVal + 1) %
            (Object.keys(this.puzzle.shape_counts).length + 1);
        const payload = [index, newVal];
        if (this.puzzle.solution[index] === newVal) {
          console.log('nice');
        }

        const cellUpdates = [payload];
        store.dispatch(updateCells({cellUpdates}));
        await this.delay(1000, () => this
            .checkBoard(this.puzzle, state.board.cells, index));
      }
    }
  }

  onStateUpdated() {
    this.handleIncrementShape();

    const state = store.getState();
    const appState = state.app;
    if (appState.loadBoardDataNow) {
      this.loadBoardData();
    }
  }
}
