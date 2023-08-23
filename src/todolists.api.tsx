import axios from "axios";
const settings = {
  withCredentials: true,
};

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
});

export type TodolistsType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type CreateTodolistsType = {
  resultCode: number;
  messages: Array<string>;
  data: {
    item: TodolistsType;
  };
};

export type _DeleteUpdateTodolistsType = {
  resultCode: number;
  messages: Array<string>;
  data: {};
};
export type _UpdateTodolistsType = {
  resultCode: number;
  messages: Array<string>;
  data: {};
};

type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};

export type TaskType = {};

type GetTasksResponseType = {
  error: string | null;
  totalCount: number;
};

export const todolistsAPI = {
  getTodolists() {
    return instance.get<Array<TodolistsType>>("todo-lists");
  },
  createTodolists(title: string) {
    return instance.post<ResponseType<{ item: TodolistsType }>>("todo-lists", {
      title: title,
    });
  },
  removeTodolist(id: string) {
    return instance.delete<ResponseType<{}>>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType<{}>>(`todo-lists/${id}`, {
      title: title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get(`todo-lists/${todolistId}/tasks`);
  },
  createTasks(todolistId: string, title: string) {
    return instance.post(`todo-lists/${todolistId}/tasks`, { title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string, title: string) {
    return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`, {
      title: title,
    });
  },
};
