import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';

import ToDoList from "./components/ToDoList";




function App():JSX.Element {
    return (
        <Router>
            <Switch>
                <Route path={'/'}>
                    <ToDoList/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
