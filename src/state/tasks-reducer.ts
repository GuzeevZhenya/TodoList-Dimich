import { TasksStateType } from "../App";
import { v1 } from "uuid";
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
  todolistsAPI,
} from "../api/todolists-api";
import { Action, Dispatch } from "redux";
import { AppRootStateType } from "./store";
import {
  SetErrorActionType,
  SetStatusActionType,
  setErrorAC,
  setStatusAC,
} from "./app-reducer";

export type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  todolistId: string;
  taskId: string;
};

export type AddTaskActionType = {
  type: "ADD-TASK";
  task: TaskType;
};

export type UpdateTaskAC = {
  type: "UPDATE-TASK";
  todolistId: string;
  taskId: string;
  model: UpdateDomainTaskModelType;
};

export type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE";
  todolistId: string;
  taskId: string;
  title: string;
};

export type SetTasksActionType = {
  type: "SET-TASKS";
  tasks: TaskType[];
  todolistId: string;
};

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskAC
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType;

const initialState: TasksStateType = {
  /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/
};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      const tasks = stateCopy[action.todolistId];
      const newTasks = tasks.filter((t) => t.id !== action.taskId);
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }
    case "ADD-TASK": {
      const stateCopy = { ...state };

      const tasks = stateCopy[action.task.todoListId];
      console.log(action.task);
      const newTasks = [action.task, ...tasks];
      stateCopy[action.task.todoListId] = newTasks;
      return stateCopy;
    }
    case "UPDATE-TASK": {
      let todolistTasks = state[action.todolistId];
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, ...action.model } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "CHANGE-TASK-TITLE": {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, title: action.title } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.todolist.id]: [],
      };
    }
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }

    case "SET-TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = action.tasks;
      return stateCopy;
    }
    default:
      return state;
  }
};

export const removeTaskAC = (
  taskId: string,
  todolistId: string
): RemoveTaskActionType => {
  return { type: "REMOVE-TASK", taskId: taskId, todolistId: todolistId };
};
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return { type: "ADD-TASK", task };
};
export const updateTaskAC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
): UpdateTaskAC => {
  return { type: "UPDATE-TASK", model, todolistId, taskId };
};
export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todolistId: string
): ChangeTaskTitleActionType => {
  return { type: "CHANGE-TASK-TITLE", title, todolistId, taskId };
};
export const setTaskstAC = (
  tasks: TaskType[],
  todolistId: string
): SetTasksActionType => {
  return { type: "SET-TASKS", tasks, todolistId };
};

export const fetchTasksTC = (todolistID: string): any => {
  return (dispatch: Dispatch<ActionsType | SetStatusActionType>) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI.getTasks(todolistID).then((res) => {
      dispatch(setTaskstAC(res.data.items, todolistID));
      dispatch(setStatusAC("succeeded"));
    });
  };
};

export const deleteTaksTC = (taskId: string, todolistID: string): any => {
  return (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistID, taskId).then((res) => {
      const action = removeTaskAC(taskId, todolistID);
      dispatch(action);
    });
  };
};

export const createTaskTC = (title: string, todoListId: string): any => {
  return (
    dispatch: Dispatch<ActionsType | SetErrorActionType | SetStatusActionType>
  ) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI.createTask(todoListId, title).then((res) => {
      if (res.data.resultCode == 0) {
        const task = res.data.data.item;
        const action = addTaskAC(task);
        dispatch(action);
        dispatch(setStatusAC("succeeded"));
      } else {
        if (res.data.messages.length) {
          dispatch(setErrorAC(res.data.messages[0]));
        } else {
          dispatch(setErrorAC("some error"));
        }
        dispatch(setStatusAC("failed"));
      }
    });
  };
};

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export const updateTaskTC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
): any => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    console.log(state);
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      console.warn("no task in state");
      return;
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task?.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...model,
    };

    todolistsAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
      const action = updateTaskAC(taskId, model, todolistId);
      dispatch(action);
    });
  };
};
