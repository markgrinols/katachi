import {configureStore} from '@reduxjs/toolkit';
import {todoReducer, boardReducer} from './reducers';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    board: boardReducer,
  },
});
console.log('store module code ran');

export default store;
