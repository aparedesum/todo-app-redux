import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const expect = require('expect.js');
const deepFreeze = require('deep-freeze');

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { id: action.id, text: action.text, completed: false };
    case 'TOGGLE_TODO':
        if (action.id === state.id) {
          return { ...state, completed: !state.completed };
        }
        return state;
    default: return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default: return state;
  }
};

const toggleTodo = (todo) => {
  return Object.assign({}, todo, { completed: !todo.completed });
  //return {...todo, completed: !todo.completed}
};

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: "ADD_TODO",
    id: 0,
    text: "Learn Redux"
  };

  const stateAfter = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(stateAfter);

  expect(todos(stateBefore, action)).to.eql(stateAfter);

};

const testToggleTodo = () => {
  const stateBefore = [
    { id: 0, text: "Learn Redux", completed: false },
    { id: 1, text: "Go Shopping", completed: false }

  ];

  const action = {
    type: "TOGGLE_TODO",
    id: 1
  };

  const stateAfter = [
    { id: 0, text: "Learn Redux", completed: false },
    { id: 1, text: "Go Shopping", completed: true }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action)).to.eql(stateAfter);

};


it('test toggletodo before eq after', () => {
  testToggleTodo();
});

it('test add toggle_todo before eq after', () => {
  testAddTodo();
});