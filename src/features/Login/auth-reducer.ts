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
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AxiosError } from "axios";

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
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
      return { isLoggedIn: true };
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

// export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }));
//   authAPI
//     .login(data)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({ value: true }));
//         dispatch(setAppStatusAC({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch);
//     });
// };

const slice = createSlice({
  initialState: {
    isLoggedIn: false,
  },
  name: "auth",
  reducers: {
    setIsLoggedInAC(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers(builder) {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;

// actions

// thunks

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ isLoggedIn: false }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types

// type ThunkDispatch = Dispatch<
//   ActionsType | SetAppStatusActionType | SetAppErrorActionType
// >;
