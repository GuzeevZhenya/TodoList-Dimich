import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

export const initializeAppTC = createAsyncThunk(
  "app/initializeApp",
  async (param, { dispatch }) => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }));
    } else {
    }
  }
);

const slice = createSlice({
  initialState: initialState,
  name: "app",
  reducers: {
    setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatusAC: (
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) => {
      state.status = action.payload.status;
    },
  },
  extraReducers(builder) {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      console.log(state.isInitialized);
      state.isInitialized = true;
    });
  },
});

export const { setAppErrorAC, setAppStatusAC } = slice.actions;

export const appReducer = slice.reducer;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean;
};
