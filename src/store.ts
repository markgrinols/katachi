import {configureStore} from '@reduxjs/toolkit';
import input from './reducers/input';
import app from './reducers/app';

const store = configureStore({
  reducer: {
    input,
    app,
  },
});

console.log('store module code ran');

export default store;
