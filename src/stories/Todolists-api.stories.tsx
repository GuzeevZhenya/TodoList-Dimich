import axios from "axios";
import React, { useEffect, useState } from "react";
import { todolistsAPI } from "../todolists.api";

export default {
  title: "API",
};

const settings = {
  withCredentials: true,
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>({ name: "ivan" });

  useEffect(() => {
    todolistsAPI.getTodolists().then((res) => setState(res.data));
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todolistTitle, setTodolistTutle] = useState("");

  const createTodolist = () => {
    todolistsAPI
      .createTodolists(todolistTitle)
      .then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistTitle}
          onChange={(e) => setTodolistTutle(e.currentTarget.value)}
        />
        <button onClick={createTodolist}>delete todolist</button>
      </div>
    </div>
  );
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");

  const deleteTodolist = () => {
    todolistsAPI.removeTodolist(todolistId).then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
        />
        <button onClick={deleteTodolist}>delete todolist</button>
      </div>
    </div>
  );
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");
  const [todolistTitle, setTodolistTitle] = useState("");

  const updateTodolistTitle = () => {
    todolistsAPI
      .updateTodolist(todolistId, todolistTitle)
      .then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
          placeholder="id"
        />
        <input
          value={todolistTitle}
          onChange={(e) => setTodolistTitle(e.currentTarget.value)}
          placeholder="title"
        />
        <button onClick={updateTodolistTitle}>update todolist</button>
      </div>
    </div>
  );
};

export const GetTasks = () => {
  const [state, setState] = useState<any>({ name: "ivan" });
  const [todolistId, setTodolistId] = useState("");

  const getTasks = () => {
    todolistsAPI.getTasks(todolistId).then((res) => setState(res.data));
  };
  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
          placeholder="id"
        />

        <button onClick={getTasks}>get tasks</button>
      </div>
    </div>
  );
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolisId, setTodolistId] = useState("");
  const [taskId, setTaskId] = useState("");

  const deleteTask = () => {
    todolistsAPI
      .deleteTask(todolisId, taskId)
      .then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolisId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
          placeholder="todolistId"
        />
        <input
          value={taskId}
          onChange={(e) => setTaskId(e.currentTarget.value)}
          placeholder="taskId"
        />

        <button onClick={deleteTask}>delete tasks</button>
      </div>
    </div>
  );
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [todolistId, setTodolistId] = useState("");

  const createTask = () => {
    todolistsAPI
      .createTasks(todolistId, taskTitle)
      .then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
          placeholder="id"
        />
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.currentTarget.value)}
          placeholder="title"
        />
        <button onClick={createTask}>create task</button>
      </div>
    </div>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskId, setTaskId] = useState("");
  const [todolistId, setTodolistId] = useState("");

  const createTask = () => {
    todolistsAPI
      .updateTask(todolistId, taskId, taskTitle)
      .then((res) => setState(res.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistId}
          onChange={(e) => setTodolistId(e.currentTarget.value)}
          placeholder="TodolistId"
        />
        <input
          value={taskId}
          onChange={(e) => setTaskId(e.currentTarget.value)}
          placeholder="TaskId"
        />
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.currentTarget.value)}
          placeholder="title"
        />
        <button onClick={createTask}>update task</button>
      </div>
    </div>
  );
};
