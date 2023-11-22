import { Dispatch } from "redux";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../utils/Login/login-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppErrorAC: (state, action: PayloadAction<{ error: any }>) => {
      state.error = action.payload.error;
    },
    setAppStatusAC: (
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) => {
      state.status = action.payload.status;
    },

    setAppInitializedAC: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const setAppErrorAC = slice.actions.setAppErrorAC;
export const setAppStatusAC = slice.actions.setAppStatusAC;
export const setAppInitializedAC = slice.actions.setAppInitializedAC;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  //true когда приложение проинициализировалось
  isInitialized: boolean;
};

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;

export const initializedAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }));
    }
    dispatch(setAppInitializedAC({ isInitialized: true }));
  });
};
