import {configureStore} from '@reduxjs/toolkit';
import {todoReducer, boardReducer} from './reducers';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    board: boardReducer,
  },
});
console.log('store construcgtor ran');

export default store;
