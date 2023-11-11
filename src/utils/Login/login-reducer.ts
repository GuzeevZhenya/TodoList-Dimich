import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  SetAppStatusActionType,
  setAppStatusAC,
} from "../../app/app-reducer";
import { authAPI, loginParamsType } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../error-utils";

const initialState: InitialStateType = {
  isLoggedIn: false,
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "LOGIN/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};

// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "LOGIN/SET-IS-LOGGED-IN", value } as const);

export const loginTC =
  (data: loginParamsType) =>
  (
    dispatch: Dispatch<
      ActionsType | SetAppStatusActionType | SetAppErrorActionType
    >
  ) => {
    dispatch(setAppStatusAC("loading"));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC(true));
          dispatch(setAppStatusAC("succeeded"));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

type ActionsType = ReturnType<typeof setIsLoggedInAC>;
// dispatch: Dispatch<ActionsType>;
type InitialStateType = {
  isLoggedIn: boolean;
};
type ThunkDispatch = Dispatch<
  ActionsType | SetAppStatusActionType | SetAppErrorActionType
>;
