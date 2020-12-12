import React from 'react';
import {BrowserRouter as Router, Route, Link,Switch} from "react-router-dom";
import './App.css';

import ToDoList from "./components/ToDoList";




function App() {

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
