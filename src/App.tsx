import { useCallback, useEffect } from "react";
import "./App.css";
import { Todolist } from "./Todolist";
import { AddItemForm } from "./AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Menu } from "@mui/icons-material";
import {
  changeTodoliskTitleTC,
  changeTodolistFilterAC,
  createTodoliskTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
} from "./state/todolists-reducer";
import {
  createTaskTC,
  deleteTaksTC,
  updateTaskTC,
} from "./state/tasks-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./state/store";
import { TaskStatuses, TaskType } from "./api/todolists-api";
import { CustomizedSnackbars } from "./ErrorSnackBar/ErrorSnackBar";
import { LinearProgress } from "@mui/material";
import { RequestStatusType } from "./state/app-reducer";

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const thunk = deleteTaksTC(id, todolistId);
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = createTaskTC(title, todolistId);
    dispatch(thunk);
  }, []);

  const changeStatus = useCallback(function (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) {
    const thunk = updateTaskTC(id, { status }, todolistId);
    dispatch(thunk);
  },
  []);

  const changeTaskTitle = useCallback(function (
    id: string,
    newTitle: string,
    todolistId: string
  ) {
    const thunk = updateTaskTC(id, { title: newTitle }, todolistId);
    dispatch(thunk);
  },
  []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string
  ) {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
  },
  []);

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodoliskTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = createTodoliskTC(title);
      dispatch(thunk);
    },
    [dispatch]
  );

  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  console.log(status);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <CustomizedSnackbars />
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map((tl) => {
            let allTodolistTasks = tasks[tl.id];

            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    todolist={tl}
                    id={tl.id}
                    title={tl.title}
                    tasks={allTodolistTasks}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
