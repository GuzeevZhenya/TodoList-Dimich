import React, { useReducer, useState } from "react";
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

export type FilterValuesType = "all" | "completed" | "active";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

function AppWithReducers() {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
    [todolistId1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: "Book", isDone: false },
      { id: v1(), title: "Milk", isDone: false },
      { id: v1(), title: "Cheaps", isDone: true },
    ],
  });

  let [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ]);

  const removeTask = (taskId: string, todolistID: string) => {
    const action = removeTaskAC(taskId, todolistID);
    dispatchToTasksReducer(action);
  };

  const addTasks = (title: string, todolistID: string) => {
    const action = addTaskAC(title, todolistID);
    dispatchToTasksReducer(action);
  };

  const changeFilter = (filterValue: FilterValuesType, todolistID: string) => {
    // const action = changeTask(filterValue, todolistID);
    const action = ChangeTodolistFilterAC(todolistID, filterValue);
    dispatchToTodolistsReducer(action);
  };

  const changeTaskStatus = (
    taskId: string,
    isDone: boolean,
    todolistID: string
  ) => {
    const action = changeTaskStatusAC(taskId, isDone, todolistID);
    dispatchToTasksReducer(action);
  };

  const removeTodoList = (todolistID: string) => {
    const action = RemoveTodolistAC(todolistID);
    dispatchToTasksReducer(action);
    dispatchToTodolistsReducer(action);
  };

  const changeTodolistTitle = (id: string, title: string) => {
    const action = ChangeTodolistTitleAC(id, title);
    dispatchToTodolistsReducer(action);
  };

  const addTodolist = (title: string) => {
    const action = AddTodolistAC(title);
    dispatchToTodolistsReducer(action);
    dispatchToTasksReducer(action);
  };

  const changeTaskTitle = (
    taskId: string,
    title: string,
    todolistID: string
  ) => {
    const action = changeTitleTaskAC(taskId, title, todolistID);
    dispatchToTasksReducer(action);
  };

  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />
      {todolists.map((tl) => {
        let tasksForTodolists = tasks[tl.id];

        if (tl.filter === "completed") {
          tasksForTodolists = tasksForTodolists.filter(
            (t) => t.isDone === true
          );
        }
        if (tl.filter === "active") {
          tasksForTodolists = tasksForTodolists.filter(
            (t) => t.isDone === false
          );
        }
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
}

export default AppWithReducers;
