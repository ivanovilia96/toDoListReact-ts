import React, {ReactDOM, ReactHTML, ReactInstance, ReactNode, useEffect, useState} from 'react';
import {Route, Link, Switch} from "react-router-dom";
import {Button, Dropdown, Input, Menu, message} from 'antd';
import axios from 'axios';
import Modal from "./Modal";


const {TextArea} = Input;

const {Item} = Menu;

interface Task {
    completed: boolean;
    description: string;
    id: string;
    taskName: string;
}

interface Response {
    data: Array<Task>;
}

const completedTaskType = 'completed';
const inProcessTaskType = 'in process';

const buttonType = {
    delete: 'delete',
    view: 'view',
    complete: 'complete'
}

const baseUrl = 'https://5fd21a6eb485ea0016eef6eb.mockapi.io/v1/tasksList/'
type tasksType = typeof completedTaskType | typeof inProcessTaskType


export default function ToDoList(): JSX.Element {
    const [listOfToDo, setListOfToDo] = useState<Array<Task>>([]);
    const [listOfCompletedToDo, setListOfCompletedToDo] = useState<Array<Task>>([]);
    const [whichTasksWeGonnaToSe, setWhichTasksWeGonnaToSe] = useState<tasksType>(inProcessTaskType)
    const [task, setTask] = useState<Task>({
        completed: false,
        description: '',
        id: '',
        taskName: '',
    })
    const [taskDescription, setTaskDescription] = useState<{ description: string, taskName: string }>({
        description: "",
        taskName: ""
    })

    useEffect(() => {
        axios.get(baseUrl)
            .then((result: Response) => {
                setListOfToDo(result.data.filter(i => !i.completed))
                setListOfCompletedToDo(result.data.filter(i => i.completed))
                message.success('data fetched')
            }, () => {
                message.error('error on fetch data from the server, call your system administrator', 1000)
            })
    }, [])

    function handleChangeTaskStatus(toDo: { id: string; completed: boolean }): void {
        axios.put(`${baseUrl}${toDo.id}`, {
            ...toDo,
            completed: !toDo.completed
        }).then(res => {
                message.success('status changed')
                if (res.data.completed) {
                    setListOfCompletedToDo([...listOfCompletedToDo, res.data])
                    setListOfToDo(listOfToDo.filter(i => i.id !== res.data.id))
                } else {
                    setListOfToDo([...listOfToDo, res.data])
                    setListOfCompletedToDo(listOfCompletedToDo.filter(i => i.id !== res.data.id))
                }
            }, () => message.error('error on change task status, call your system administrator', 10)
        )
    }

    function handleChangeWhichTasksWeGonnaToSe(): void {
        setWhichTasksWeGonnaToSe(whichTasksWeGonnaToSe === completedTaskType ? inProcessTaskType : completedTaskType)
    }

    function deleteTask(id: string, taskType: tasksType): void {
        axios.delete(`${baseUrl}${id}`)
            .then(res => {
                    message.success('task deleted')
                    if (taskType === inProcessTaskType) {
                        setListOfToDo(listOfToDo.filter(i => i.id !== res.data.id))
                    } else {
                        setListOfCompletedToDo(listOfCompletedToDo.filter(i => i.id !== res.data.id))
                    }
                }, () =>
                    message.error('error on delete task, call your system administrator', 10)
            )
    }

    function handleChangeTaskName(e: { target: { value: string } }): void {
        setTask({...task, taskName: e.target.value})
    }

    function handleChangeTaskDescription(e: { target: { value: string } }): void {
        setTask({...task, description: e.target.value})
    }

    function handleAddNewTask(): void {
        axios.post(baseUrl, task)
            .then((res: { data: Task }) => {
                    message.success('task added')
                    setListOfToDo([...listOfToDo, res.data])
                    setTask({
                            completed: false,
                            description: '',
                            id: '',
                            taskName: '',
                        }
                    )
                }, () => message.error('error on add new task, call your system administrator', 10)
            )
    }

    function handleViewDescriptionChange(task: Task): void {
        const {taskName, description} = task;
        setTaskDescription({
            taskName, description
        })
    }

    const menu: JSX.Element = (
        <Menu>
            <Item onClick={handleChangeWhichTasksWeGonnaToSe}>
                {whichTasksWeGonnaToSe === completedTaskType ? inProcessTaskType : completedTaskType}
            </Item>
        </Menu>
    );

    return (
        <div className='main'>
            <span className='header'>to do list</span>
            <Input size='large'
                   addonAfter={
                       <Button
                           disabled={!task.taskName}
                           onClick={handleAddNewTask}
                       >
                           add
                       </Button>
                   }
                   addonBefore=' add to do '
                   placeholder='what do you gonna do ?' className={'input'}
                   value={task.taskName}
                   onChange={handleChangeTaskName}
            />
            <Dropdown
                className={'change-view'}
                overlay={menu}
                arrow={true}
                trigger={["click"]}
            >
                <Button>{whichTasksWeGonnaToSe === completedTaskType ? completedTaskType : inProcessTaskType} </Button>
            </Dropdown>

            <div className={"to-do"}>
                {task.taskName && <TextArea
                  value={task.description}
                  onChange={handleChangeTaskDescription}
                  placeholder={'add here your description for new task'}
                />}
                {whichTasksWeGonnaToSe === inProcessTaskType ? listOfToDo.map(toDo => {
                    const {id, taskName} = toDo;
                    return (
                        <div
                            key={id}
                            className={'task'}
                        >
                            <span className={'task-name'}>  {taskName}</span>
                            <Button
                                className={buttonType.complete}
                                onClick={handleChangeTaskStatus.bind({}, toDo,)}
                            >
                                task complete
                            </Button>

                            <Link to={'/description/tasks/' + taskName} className={buttonType.view}>
                                <Button

                                    onClick={handleViewDescriptionChange.bind({}, toDo)}
                                >
                                    view description
                                </Button>
                            </Link>

                            <Button
                                onClick={deleteTask.bind({}, id, inProcessTaskType)}
                                className={buttonType.delete}
                            >
                                delete
                            </Button>
                        </div>)
                }) : listOfCompletedToDo.map(toDo => {
                    const {id, taskName} = toDo;
                    return (
                        <div key={id}
                             className={'task'}>
                            <span className={'task-name'}>  {taskName}</span>

                            <Button
                                onClick={handleChangeTaskStatus.bind({}, toDo,)}
                                className={buttonType.complete}
                            >
                                move in incomplete
                            </Button>
                            <Link to={'/description/tasks/' + taskName} className={buttonType.view}>
                                <Button
                                    onClick={handleViewDescriptionChange.bind({}, toDo)}
                                >
                                    view description
                                </Button>
                            </Link>
                            <Button
                                onClick={deleteTask.bind({}, id, completedTaskType)}
                                className={buttonType.delete}
                            >
                                delete
                            </Button>
                        </div>
                    )
                })}
            </div>
            <Switch>
                <Route path={`/description/tasks/`}>
                    <Modal
                        title={taskDescription.taskName}
                        description={taskDescription.description}
                    />
                </Route>
            </Switch>
        </div>
    );
}
