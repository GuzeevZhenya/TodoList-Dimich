import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  SetAppStatusActionType,
  setAppErrorAC,
  setAppStatusAC,
} from "../app/app-reducer";
import { ResponseType } from "../api/todolists-api";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>
) => {
  console.log(data);
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("some error"));
  }
  dispatch(setAppStatusAC("failed"));
};

export const handleServerNetworkError = (
  error: any,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>
) => {
  dispatch(setAppErrorAC(error.message ? error.message : "some error"));
  dispatch(setAppStatusAC("failed"));
};
