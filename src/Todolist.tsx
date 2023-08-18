import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { FilterValuesType } from "./App";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";

type PropsType = {
  title: string;
  tasks: Array<TaskType>;
  removeTask: (taskId: string, todolistID: string) => void;
  changeFilter: (filterValue: FilterValuesType, todolistID: string) => void;
  addTasks: (titleValue: string, todolistID: string) => void;
  changeTaskStatus: (
    taskId: string,
    isDone: boolean,
    todolistID: string
  ) => void;
  filter: string;
  id: string;
  removeTodoList: (todolistID: string) => void;
  changeTodolistTitle: (id: string, title: string) => void;
  addTodolist: (title: string) => void;
  changeTaskTitle: (taskId: string, title: string, todolistID: string) => void;
};

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export const Todolist = React.memo((props: PropsType) => {
  console.log("Todolist");
  const removeTodoListHandler = () => {
    props.removeTodoList(props.id);
  };

  const addTask = useCallback(
    (title: string) => {
      props.addTasks(title, props.id);
    },
    [props.addTasks, props.id]
  );

  const changeTodolistTitle = (title: string) => {
    props.changeTodolistTitle(props.id, title);
  };

  let tasksForTodolists = props.tasks;

  if (props.filter === "completed") {
    tasksForTodolists = props.tasks.filter((t) => t.isDone === true);
  }
  if (props.filter === "active") {
    tasksForTodolists = props.tasks.filter((t) => t.isDone === false);
  }

  return (
    <div>
      <h3>
        <EditableSpan title={props.title} onChange={changeTodolistTitle} />
      </h3>
      <button onClick={removeTodoListHandler}>Remove</button>
      <AddItemForm addItem={addTask} />
      <ul>
        {props.tasks.map((t) => {
          const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked, props.id);
          };

          const onChangeTitleHandler = (newValue: string) => {
            props.changeTaskTitle(t.id, newValue, props.id);
          };
          const onRemoveHandler = () => {
            props.removeTask(t.id, props.id);
          };
          return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
              <input
                onChange={onChangeStatusHandler}
                type="checkbox"
                checked={t.isDone}
              />
              <EditableSpan title={t.title} onChange={onChangeTitleHandler} />
              <button onClick={onRemoveHandler}>X</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button
          className={props.filter === "all" ? "active" : ""}
          onClick={() => props.changeFilter("all", props.id)}
        >
          All
        </button>
        <button
          className={props.filter === "active" ? "active" : ""}
          onClick={() => props.changeFilter("active", props.id)}
        >
          Active
        </button>
        <button
          className={props.filter === "completed" ? "active" : ""}
          onClick={() => props.changeFilter("completed", props.id)}
        >
          Completed
        </button>
      </div>
    </div>
  );
});
