import { v1 } from "uuid";
import { TodolistType, todolistsAPI } from "../api/todolists-api";
import { Dispatch } from "redux";
import {
  RequestStatusType,
  SetErrorActionType,
  SetStatusActionType,
  setStatusAC,
} from "./app-reducer";

export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST";
  id: string;
};
export type AddTodolistActionType = {
  type: "ADD-TODOLIST";
  todolist: TodolistType;
};
export type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  filter: FilterValuesType;
};

export type SetTodolists = {
  type: "SET-TODOLISTS";
  todolists: TodolistType[];
};

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolists
  | ReturnType<typeof changeTodolistEntityStatusAC>;

const initialState: Array<TodolistDomainType> = [
  /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
];

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      const newTodolist: TodolistDomainType = {
        ...action.todolist,
        filter: "all",
        entityStatus: "idle",
      };
      return [newTodolist, ...state];
    }
    case "CHANGE-TODOLIST-TITLE": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter;
      }
      return [...state];
    }

    case "SET-TODOLISTS": {
      return action.todolists.map((tl) => {
        return {
          ...tl,
          filter: "all",
          entityStatus: "idle",
        };
      });
    }
    case "CHANGE-TODOLIST-ENTITY-STATUS": {
      return state.map((el) =>
        el.id === action.id ? { ...el, entityStatus: action.status } : el
      );
    }
    default:
      return state;
  }
};

export const removeTodolistAC = (
  todolistId: string
): RemoveTodolistActionType => {
  return { type: "REMOVE-TODOLIST", id: todolistId };
};
export const addTodolistAC = (
  todolist: TodolistType
): AddTodolistActionType => {
  return { type: "ADD-TODOLIST", todolist };
};
export const changeTodolistTitleAC = (
  id: string,
  title: string
): ChangeTodolistTitleActionType => {
  return { type: "CHANGE-TODOLIST-TITLE", id: id, title: title };
};
export const changeTodolistFilterAC = (
  id: string,
  filter: FilterValuesType
): ChangeTodolistFilterActionType => {
  return { type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter };
};

export const setTodolistAC = (todolists: TodolistType[]): SetTodolists => {
  return { type: "SET-TODOLISTS", todolists };
};

export const changeTodolistEntityStatusAC = (
  id: string,
  status: RequestStatusType
) => {
  return { type: "CHANGE-TODOLIST-ENTITY-STATUS", id, status } as const;
};

export const fetchTodolistsTC = (): any => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setStatusAC("loading"));

    todolistsAPI.getTodolists().then((res) => {
      dispatch(setTodolistAC(res.data));
      dispatch(setStatusAC("succeeded")); 
    });
  };
};

export const removeTodolistTC = (todolistId: string): any => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setStatusAC("loading"));
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC(todolistId));
      dispatch(setStatusAC("succeeded"));
    });
  };
};

export const createTodoliskTC = (title: string): any => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC(res.data.data.item));
      dispatch(setStatusAC("succeeded"));
    });
  };
};

export const changeTodoliskTitleTC = (id: string, title: string): any => {
  return (dispatch: ThunkDispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitleAC(id, title));
    });
  };
};

export type ThunkDispatch = Dispatch<
  ActionsType | SetStatusActionType | SetErrorActionType
>;
