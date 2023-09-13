//app-reducer.tsx

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "loading" as RequestStatusType,
  error: null,
};

// type InitialStateType = typeof initialState;

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    default:
      return { ...state };
  }
};

export const setErrorAC = (error: string | null) => {
  return {
    type: "APP/SET-ERROR",
    error,
  } as const;
};

export const setStatusAC = (status: RequestStatusType) => {
  return {
    type: "APP/SET-STATUS",
    status,
  } as const;
};

export type SetErrorActionType = ReturnType<typeof setErrorAC>;
export type SetStatusActionType = ReturnType<typeof setStatusAC>;

type ActionsType = SetErrorActionType | ReturnType<typeof setStatusAC>;
