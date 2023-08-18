import React, { useState } from "react";
import "./App.css";
import { Todolist } from "./Todolist";
import { TaskType } from "./Todolist";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";

export type FilterValuesType = "all" | "completed" | "active";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

function App() {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let [tasks, setTask] = useState<TasksStateType>({
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

  let [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ]);

  const removeTask = (taskId: string, todolistID: string) => {
    // let filteredTasks = tasks.filter((item) => item.id !== taskId);
    setTask({
      ...tasks,
      [todolistID]: tasks[todolistID].filter((el) => el.id !== taskId),
    });
  };

  const addTasks = (title: string, todolistID: string) => {
    let newTask = { id: v1(), title: title, isDone: false };
    // // let newTasks = [newTask, ...tasks];
    // setTask([newTask, ...tasks]);
    setTask({ ...tasks, [todolistID]: [...tasks[todolistID], newTask] });
  };

  const changeFilter = (filterValue: FilterValuesType, todolistID: string) => {
    // setFilter(filterValue);
    setTodolists(
      todolists.map((el) =>
        el.id === todolistID ? { ...el, filter: filterValue } : el
      )
    );
  };

  const changeTaskStatus = (
    taskId: string,
    isDone: boolean,
    todolistID: string
  ) => {
    // console.log(taskId, isDone);
    // let task = tasks.find((t) => t.id === taskId);
    // if (task) {
    //   task.isDone = isDone;
    // }
    // setTask([...tasks]);
    setTask({
      ...tasks,
      [todolistID]: [
        ...tasks[todolistID].map((el) =>
          el.id === taskId ? { ...el, isDone } : el
        ),
      ],
    });
  };

  const removeTodoList = (todolistID: string) => {
    setTodolists(todolists.filter((el) => el.id !== todolistID));
    delete tasks[todolistID];
    setTask({ ...tasks });
  };

  const changeTodolistTitle = (id: string, title: string) => {
    setTodolists(todolists.map((el) => (el.id === id ? { ...el, title } : el)));
  };

  const addTodolist = (title: string) => {
    let newTodolistId = v1();
    let newTodolist: TodolistType = {
      id: newTodolistId,
      title: title,
      filter: "all",
    };
    setTodolists([newTodolist, ...todolists]);
    setTask({ ...tasks, [newTodolistId]: [] });
  };

  const changeTaskTitle = (
    taskId: string,
    title: string,
    todolistID: string
  ) => {
    // console.log(taskId, isDone);
    // let task = tasks.find((t) => t.id === taskId);
    // if (task) {
    //   task.isDone = isDone;
    // }
    // setTask([...tasks]);
    setTask({
      ...tasks,
      [todolistID]: [
        ...tasks[todolistID].map((el) =>
          el.id === taskId ? { ...el, title } : el
        ),
      ],
    });
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

export default App;
