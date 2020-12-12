import React, {useEffect, useState} from 'react';
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

const completedTaskType = 'completed'
const inProcessTaskType = 'in process'


type tasksType = typeof completedTaskType | typeof inProcessTaskType


export default function ToDoList() {
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
        axios.get('https://5fd21a6eb485ea0016eef6eb.mockapi.io/v1/tasksList')
            .then((result: Response) => {
                setListOfToDo(result.data.filter(i => !i.completed))
                setListOfCompletedToDo(result.data.filter(i => i.completed))
                message.success('data fetched')
            }, () => {
                message.error('error on fetch data from the server, call your system administrator', 1000)
            })
    }, [])

    function handleChangeTaskStatus(toDo: { id: string; completed: boolean }) {
        axios.put('https://5fd21a6eb485ea0016eef6eb.mockapi.io/v1/tasksList/' + toDo.id, {
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

    function handleChangeWhichTasksWeGonnaToSe(e: any) {
        setWhichTasksWeGonnaToSe(whichTasksWeGonnaToSe === completedTaskType ? inProcessTaskType : completedTaskType)
    }

    function deleteTask(id: string, taskType: tasksType) {
        axios.delete('https://5fd21a6eb485ea0016eef6eb.mockapi.io/v1/tasksList/' + id)
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

    function handleChangeTaskName(e: { target: { value: string } }) {
        setTask({...task, taskName: e.target.value})
    }

    function handleChangeTaskDescription(e: { target: { value: string } }) {
        setTask({...task, description: e.target.value})
    }

    function handleAddNewTask() {
        axios.post('https://5fd21a6eb485ea0016eef6eb.mockapi.io/v1/tasksList/', task)
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

    function handleViewDescriptionChange(task: Task) {
        const {taskName, description} = task;
        setTaskDescription({
            taskName, description
        })
    }

    const menu = (
        <Menu>
            <Item onClick={handleChangeWhichTasksWeGonnaToSe}>
                {whichTasksWeGonnaToSe === completedTaskType ? inProcessTaskType : completedTaskType}
            </Item>
        </Menu>
    );

    return (
        <div className='main'>
            <span className='header'>  to do list</span>
            <Input size='large'
                   addonAfter={<Button disabled={!task.taskName} onClick={handleAddNewTask}>add</Button>}
                   addonBefore=' add to do '
                   placeholder='what do you gonna do ?' className={'input'}
                   value={task.taskName}
                   onChange={handleChangeTaskName}
            />
            <Dropdown className={'change-view'} overlay={menu} arrow={true} trigger={["click"]}>
                <Button>{whichTasksWeGonnaToSe === completedTaskType ? completedTaskType : inProcessTaskType} </Button>
            </Dropdown>

            <div className={"to-do"}>
                {task.taskName && <TextArea value={task.description} onChange={handleChangeTaskDescription}
                                            placeholder={'add here your description for new task'}/>}
                {whichTasksWeGonnaToSe === inProcessTaskType ? listOfToDo.map(toDo => {
                    const {id, taskName} = toDo;
                    return (
                        <div
                            key={id}
                            className={'task'}
                        >
                            {taskName}
                            <Button
                                className={'task-button'}
                                onClick={handleChangeTaskStatus.bind({}, toDo,)}
                            >
                                task complete
                            </Button>

                            <Link to={'/description/tasks/' + taskName}>
                                <Button
                                    className={'task-button'}
                                    onClick={handleViewDescriptionChange.bind({}, toDo)}
                                >
                                    view description
                                </Button>
                            </Link>

                            <Button
                                onClick={deleteTask.bind({}, id, inProcessTaskType)}
                                className={'task-button'}
                            >
                                delete
                            </Button>
                        </div>)
                }) : listOfCompletedToDo.map(toDo => {
                    const {id, taskName} = toDo;
                    return (
                        <div key={id}
                             className={'task'}>
                            {taskName}

                            <Button
                                onClick={handleChangeTaskStatus.bind({}, toDo,)}
                                className={'task-button'}
                            >
                                move in incomplete
                            </Button>
                            <Link to={'/description/tasks/' + taskName}>
                                <Button
                                    className={'task-button'}
                                    onClick={handleViewDescriptionChange.bind({}, toDo)}
                                >
                                    view description
                                </Button>
                            </Link>
                            <Button
                                onClick={deleteTask.bind({}, id, completedTaskType)}
                                className={'task-button'}
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

