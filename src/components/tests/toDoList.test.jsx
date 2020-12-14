import React from "react";
import ToDoList, {baseUrl} from "../ToDoList";
import {render} from "enzyme";
import {BrowserRouter as Router} from "react-router-dom";
import axios from "axios";
import {message} from "antd";


describe('ToDoList', () => {
  it("check render: snapshot test", () => {
    const wrapper = render(
      <Router>
        <ToDoList/>
      </Router>);
    expect(wrapper).toMatchSnapshot()
  });

  it.skip("check render: snapshot test after useEffect", () => {
    const mockUseStateChangeFunc = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementationOnce((arg) => {
      arg()
    })
    const useStateChecker = jest.spyOn(React, 'useState')
      .mockImplementation(initialState => ([initialState, mockUseStateChangeFunc]))

    const successListener = jest.spyOn(message, 'success').mockImplementation(() => {
    })
    const get = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: [
        {
          completed: true,
          description: 'mock-descr-1',
          id: '1',
          taskName: 'mock-task-name1',
        }
      ]
    }))
    const wrapper = render(
      <Router>
        <ToDoList/>
      </Router>);


    expect(wrapper).toMatchSnapshot()
    expect(get).toHaveBeenCalledWith(baseUrl)
    expect(successListener).toHaveBeenCalledWith()
  });

})

