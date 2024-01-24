import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { AppRootStateType, AppThunk } from "../../app/store";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk(
  "/tasks/fetchTasks",
  (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    return todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { tasks, todolistId };
    });
  }
);

export const removeTaskTC = createAsyncThunk(
  "/tasks/removeTask",
  (param: { taskId: string; todolistId: string }, thunkAPI) => {
    return todolistsAPI
      .deleteTask(param.todolistId, param.taskId)
      .then((res) => ({
        taskId: param.taskId,
        todolistId: param.todolistId,
      }));
  }
);

const slice = createSlice({
  initialState: {} as TasksStateType,
  name: "tasks",
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasksForTodolist = state[action.payload.task.todoListId];
      tasksForTodolist.unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        domainModel: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) => {},
  },

  extraReducers: (builder) => {
    builder
      .addCase(addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(removeTodolistAC, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(setTodolistsAC, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log(action.payload);
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (index !== -1) {
          tasksForTodolist.splice(index, 1);
        }
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksAction = slice.actions;

export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = tasksAction.addTask({ task });
          dispatch(action);
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = tasksAction.updateTask({
            taskId,
            domainModel: apiModel,
            todolistId,
          });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
