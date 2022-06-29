/* eslint-disable require-jsdoc */

import {createReducer, createAction, Action} from '@reduxjs/toolkit';


// board state/actions
//   {
//      values: []
//   }


export const setBoard = createAction<number[]>('board/setBoard');

export const boardReducer = createReducer({}, (builder) => {
  builder.addCase(setBoard, (state, action) => {
    if (setBoard.match(action)) {
      return action.payload;
    }
  });
});


/* playground below here */

const increment = createAction<string>('counter/increment');
export const counterReducer = createReducer('x', (builder) => {
  builder.addCase(increment, (state, action) => action.payload.toUpperCase());
//  builder.addCase(decrement, (state, action) => state - action.payload);
});

// another example
type todoType = {text: string, completed?: boolean}
export const addToDoCreator = createAction<{text: string}>('ADD_TO_DO');
const toggleToDoCreator = createAction<{index: number}>('TOGGLE_TO_DO');
const removeToDoCreator = createAction<{index: number}>('REMOVE_TO_DO');

export const todoReducer = createReducer([] as todoType[], (builder) => {
  builder
      .addCase(addToDoCreator, (state, action: Action) => {
      // "mutate" the array by calling push()
        if (addToDoCreator.match(action)) {
          state.push(action.payload);
        }
      })
      .addCase(toggleToDoCreator, (state, action: Action) => {
        if (toggleToDoCreator.match(action)) {
          const todo = state[action.payload.index];
          // "mutate" the object by overwriting a field
          todo.completed = !todo.completed;
        }
      })
      .addCase(removeToDoCreator, (state, action: Action) => {
        if (removeToDoCreator.match(action)) {
          // Can still return an immutably-updated value if we want to
          return state.filter((todo, i) => i !== action.payload.index);
        }
      });
});
