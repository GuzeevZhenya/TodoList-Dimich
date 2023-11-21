import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  SetAppStatusActionType,
  setAppStatusAC,
} from "../../app/app-reducer";
import { authAPI, loginParamsType } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../error-utils";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: any) {
      state.isLoggedIn = action.value;
    },
  },
});

export const authReducer = slice.reducer;
const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// actions

export const loginTC = (data: loginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        // dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

type ThunkDispatch = Dispatch<SetAppStatusActionType | SetAppErrorActionType>;
