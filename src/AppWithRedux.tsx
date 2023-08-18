import React, { useCallback, useReducer, useState } from "react";
import "./App.css";
import { Todolist } from "./Todolist";
import { TaskType } from "./Todolist";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTitleTaskAC,
  removeTaskAC,
  tasksReducer,
} from "./state/tasks-reducer";
import {
  AddTodolistAC,
  ChangeTodolistFilterAC,
  ChangeTodolistTitleAC,
  RemoveTodolistAC,
  todolistsReducer,
} from "./state/todolists-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./state/store";

export type FilterValuesType = "all" | "completed" | "active";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

const AppWithRedux = () => {
  console.log("App");
  let todolistId1 = v1();
  let todolistId2 = v1();

  const dispatch = useDispatch();

  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  const todolists = useSelector<AppRootStateType, TodolistType[]>(
    (state) => state.todolists
  );

  const removeTask = useCallback(
    (taskId: string, todolistID: string) => {
      const action = removeTaskAC(taskId, todolistID);

      dispatch(action);
    },
    [dispatch]
  );

  const addTasks = useCallback(
    (title: string, todolistID: string) => {
      const action = addTaskAC(title, todolistID);
      dispatch(action);
    },
    [dispatch]
  );

  const changeFilter = useCallback(
    (filterValue: FilterValuesType, todolistID: string) => {
      // const action = changeTask(filterValue, todolistID);
      const action = ChangeTodolistFilterAC(todolistID, filterValue);
      dispatch(action);
    },
    [dispatch]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, isDone: boolean, todolistID: string) => {
      const action = changeTaskStatusAC(taskId, isDone, todolistID);
      dispatch(action);
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todolistID: string) => {
      const action = RemoveTodolistAC(todolistID);
      dispatch(action);
    },
    [dispatch]
  );

  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      const action = ChangeTodolistTitleAC(id, title);
      dispatch(action);
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      const action = AddTodolistAC(title);
      dispatch(action);
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistID: string) => {
      const action = changeTitleTaskAC(taskId, title, todolistID);
      dispatch(action);
    },
    [dispatch]
  );

  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />
      {todolists.map((tl) => {
        let tasksForTodolists = tasks[tl.id];

        return (
          <Todolist
            key={tl.id}
            changeTaskStatus={changeTaskStatus}
            title={tl.title}
            tasks={tasksForTodolists}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTasks={addTasks}
            filter={tl.filter}
            id={tl.id}
            removeTodoList={removeTodoList}
            changeTodolistTitle={changeTodolistTitle}
            addTodolist={addTodolist}
            changeTaskTitle={changeTaskTitle}
          />
        );
      })}
    </div>
  );
};

export default AppWithRedux;
