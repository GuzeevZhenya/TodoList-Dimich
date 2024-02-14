import { todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchTodolistsTC = createAsyncThunk(
  "todolist/fetchTodolist",
  async (param, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();

      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));

      return { todolists: res.data };
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const removeTodolistTC = createAsyncThunk(
  "todolist/removeTodolist",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(
      changeTodolistEntityStatusAC({ id: todolistId, status: "loading" })
    );
    const res = await todolistsAPI.deleteTodolist(todolistId);

    //скажем глобально приложению, что асинхронная операция завершена
    thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
    return { id: todolistId };
  }
);

export const addTodolistTC = createAsyncThunk(
  "todolist/removeTodolist",
  async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
    return { todolist: res.data.data.item };
  }
);

export const slice = createSlice({
  initialState: [] as TodolistDomainType[],
  name: "todolists",
  reducers: {
    changeTodolistTitleAC: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    },
    changeTodolistFilterAC: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC: (
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      return state.filter((tl) => tl.id != action.payload.id);
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.push({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    });
  },
});

export const todolistsReducer = slice.reducer;
export const {
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
} = slice.actions;

// thunks

export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitleAC({ id: id, title }));
    });
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
