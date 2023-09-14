import { Dispatch } from "redux";
import {
  SetErrorActionType,
  SetStatusActionType,
  setErrorAC,
  setStatusAC,
} from "../state/app-reducer";
import { ResponseType } from "../todolists.api";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetErrorActionType | SetStatusActionType>
) => {
  if (data.messages.length) {
    dispatch(setErrorAC(data.messages[0]));
  } else {
    dispatch(setErrorAC("some error"));
  }
  dispatch(setStatusAC("failed"));
};

export const handleServerNetworkError = (
  error: any,
  dispatch: Dispatch<SetErrorActionType | SetStatusActionType>
) => {
  dispatch(setErrorAC(error.message ? error.message : "some error"));
  dispatch(setStatusAC("failed"));
};
