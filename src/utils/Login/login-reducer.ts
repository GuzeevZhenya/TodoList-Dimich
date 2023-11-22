import { Dispatch } from "redux";
// import {
//   SetAppErrorActionType,
//   SetAppStatusActionType,
//   setAppStatusAC,
// } from "../../app/app-reducer";
import { authAPI, loginParamsType } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setAppStatusAC } from "../../app/app-reducer";

const initialState = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// actions

export const loginTC = (data: loginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// type ThunkDispatch = Dispatch<SetAppStatusActionType | SetAppErrorActionType>;
