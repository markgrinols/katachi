/* eslint-disable require-jsdoc */
import {clearUserClicked} from './reducers/input';
import {loadBoardDataNow} from './reducers/app';
import {updateCells, setRowsCols} from './reducers/board';
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

  // *********************

  getShapeCountsInList(numShapes: number, data: number[]) {
    const counts: CountsType = {};
    for (let i:number = 1; i < numShapes + 1; i++) {
      const count = data.filter( (d) => d === i).length;
      counts[i] = count;
    }
    return counts;
  }

  getShapeCountsPerRow(puzzle: PuzzleType, board: number[], rowIndex: number) {
    const numShapes = Object.keys(puzzle['shape_counts']).length;
    const cols = puzzle.dimensions[1];
    const start = cols * rowIndex;
    const rowData = board.slice(start, start + cols);
    return this.getShapeCountsInList(numShapes, rowData);
  }

  getShapeCountsPerCol(puzzle: PuzzleType, board: number[], colIndex: number) {
    const numShapes = Object.keys(puzzle['shape_counts']).length;
    const cols = puzzle.dimensions[1];
    const start = colIndex;
    const colData = [];
    for (let i = start; i < board.length; i = i + cols) {
      colData.push(board[i]);
    }
    return this.getShapeCountsInList(numShapes, colData);
  }

// def get_shape_counts_per_box(puzzle, board, box_row, box_col):
//   rows_in_box = puzzle['box_dimensions'][0]
//   cols_in_box = puzzle['box_dimensions'][1]
//   box_start_row = box_row * rows_in_box
//   box_end_row = box_start_row + rows_in_box
//   box_start_col = box_col * cols_in_box
//   box_end_col = box_start_col + cols_in_box
//   box_matrix = board[box_start_row:box_end_row, box_start_col:box_end_col]
//   return get_shape_counts_in_list(get_shape_count(puzzle), box_matrix.flatten())


// def are_counts_legal(puzzle, counts):
//   c = get_shape_count(puzzle)
//   for s in range(1, c + 1):
//       if counts[s] > puzzle['shape_counts'][s]:
//           return False
//   return True

// def are_all_shapes_connected(box_matrix, shape_counts):
//   # get list of locations of each non circle shape
//   # go through each and find any cell that shares row or col && other dim is only 1 away
//   for s in shape_counts:
//       if s == 1:
//           continue  # skip circles
//       matches = list(zip(*np.where(box_matrix==s)))
//       for r0, c0 in matches:
//           this_r0c0_has_at_least_one_matching_connector = False
//           for r, c in matches:
//               if (r0 == r and c0 == c):
//                   continue
//               if (r0 == r and abs(c0 - c) == 1) or \
//                  (c0 == c and abs(r0 - r) == 1):
//                   this_r0c0_has_at_least_one_matching_connector = True
//           if not this_r0c0_has_at_least_one_matching_connector:
//               return False
//   return True

// def are_connections_valid(puzzle, board, box_row, box_col):
//   rows_in_box = puzzle['box_dimensions'][0]
//   cols_in_box = puzzle['box_dimensions'][1]
//   box_start_row = box_row * rows_in_box
//   box_end_row = box_start_row + rows_in_box
//   box_start_col = box_col * cols_in_box
//   box_end_col = box_start_col + cols_in_box
//   box_matrix = board[box_start_row:box_end_row, box_start_col:box_end_col]
//   if len(np.where(box_matrix==0)[0]) > 0:
//       return True  # can't do next test if there are blank cells
//   return are_all_shapes_connected(box_matrix, puzzle['shape_counts'])

// def is_legal_move(puzzle, board, row, col):
//   counts = get_shape_counts_per_row(puzzle, board, row)
//   if not are_counts_legal(puzzle, counts):
//       return {'badrow': row }

//   counts = get_shape_counts_per_col(puzzle, board, col)
//   if not are_counts_legal(puzzle, counts):
//       return { 'badcol': col }

//   box_row, box_col = get_box(puzzle, row, col)
//   counts = get_shape_counts_per_box(puzzle, board, box_row, box_col)
//   if not are_counts_legal(puzzle, counts):
//       return { 'badbox': [box_row, box_col] }

//   if not are_connections_valid(puzzle, board, box_row, box_col):
//       return { 'badbox-connections': [box_row, box_col] }

//   return {}

  // *********************


  checkBoard(index: number) {
    console.log(`checkBoard fired ${index}`);
    // check row
    // check col
    // check box
    // in case of trouble, dispatch - boardError message
    // if no trouble, send the clear messsage
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
        await this.delay(1000, () => this.checkBoard(index));
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
