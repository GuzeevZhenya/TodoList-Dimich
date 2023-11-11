import { Dispatch } from "redux";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../utils/Login/login-reducer";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-IS-INITIALIZED":
      return { ...state, isInitialized: action.value };
    default:
      return { ...state };
  }
};

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  //true когда приложение проинициализировалось
  isInitialized: boolean;
};

export const setAppErrorAC = (error: string | null) =>
  ({ type: "APP/SET-ERROR", error } as const);
export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: "APP/SET-STATUS", status } as const);

export const setAppInitializedAC = (value: boolean) =>
  ({ type: "APP/SET-IS-INITIALIZED", value } as const);

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;

export const initializedAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    console.log(res);
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    }
    dispatch(setAppInitializedAC(true));
  });
};

type ActionsType =
  | SetAppErrorActionType
  | SetAppStatusActionType
  | ReturnType<typeof setAppInitializedAC>;
