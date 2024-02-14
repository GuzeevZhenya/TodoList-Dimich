import { Dispatch } from "redux";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  authAPI,
  FieldsErrorType,
  LoginParamsType,
} from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AxiosError } from "axios";

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: {
      errors: Array<string>;
      fieldsErrors?: Array<FieldsErrorType>;
    };
  }
>("auth/login", async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.login(param);

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (err) {
    const error: AxiosError = err;
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({
      errors: [error.message],
      fieldsErrors: undefined,
    });
  }
});

export const logoutTC = createAsyncThunk(
  "auth/logout",
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));

    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  }
);

const slice = createSlice({
  initialState: {
    isLoggedIn: false,
  },
  name: "auth",
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers(builder) {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;
