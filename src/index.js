import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider, connect } from "react-redux";
import todoApp from './reducers';
import * as serviceWorker from './serviceWorker';
import { loadState, saveState } from './localStorage';
import {addTodo, setVisibilityFilter, toggleTodo} from './actions';
import throttle from 'loadash/throttle';

const mapStateToLinkProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
});

const mapDispatchToLinkProps = (dispatch, ownProps) => (
    {
        onClick() {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    }
);

const mapStateToTodoListProps = (state) => (
    { todos: getVisibleTodos(state.todos, state.visibilityFilter) }
);

const mapDispatchToTodoListProps = (dispatch) => (
    {
        onTodoClick(id) { 
            dispatch(toggleTodo(id))
        }
    }
);

const Link = ({ active, children, onClick }) => {
    if (active) {
        return <span>{children}</span>
    }

    return (<a href="#" onClick={e => {
        e.preventDefault();
        onClick();
    }}>{children}</a>);

};

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

let AddTodo = ({ dispatch }) => {
    let input;
    return (<div>
        <input ref={node => { input = node; }} />
        <button onClick={() => {
            dispatch(addTodo(input.value));
            input.value = "";
        }}>Add Todo
        </button>
    </div>);
};
AddTodo = connect()(AddTodo);

const Footer = () => (
    <p>
        Show: {' '}
        <FilterLink filter="SHOW_ALL">All</FilterLink>{', '}
        <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>{', '}
        <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
    </p>
);

const Todo = ({ onClick, completed, text }) => (
    <li onClick={onClick} style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {text}
    </li>
);

const TodoList = ({ todos, onTodoClick }) => (
    <ul>
        {todos.map(todo => <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />)}
    </ul>
);

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL': return todos;
        case 'SHOW_COMPLETED': return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE': return todos.filter(t => !t.completed);
        default: return todos;
    }

}

const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

const TodoApp = () => (<div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
</div>);

const persistedState = loadState();

const store = createStore(todoApp, persistedState);

store.subscribe(throttle( () => {
    saveState({
        todos: store.getState().todos
    });
}, 1000));

ReactDOM.render(
    <Provider store={store}>
        <TodoApp />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
