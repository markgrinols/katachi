import {configureStore} from '@reduxjs/toolkit';
import input from './reducers/input';
import app from './reducers/app';
import board from './reducers/board';

const store = configureStore({
  reducer: {
    input,
    app,
    board,
  },
});

export default store;


/*
store usage:

BoardManager:
Listens for:
- load_data_now! action
- user_clicked

dispatches:
- clears load_data_now
- shape_updates (shapeType: number, isCorrect: boolean)
- puzzle_completion_state(inProgress, completed_failed, completed_success)
- clear user clicked

Renderer:
Listens for:
- shape_updates
- puzzle_completion_state

dispatches:
- load_data_now!
- clear_shape_updates
- user_clicked


*/
