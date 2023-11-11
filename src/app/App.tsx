import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { AppRootStateType, useAppDispatch, useAppSelector } from "./store";
import { RequestStatusType, initializedAppTC } from "./app-reducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { Menu } from "@mui/icons-material";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { Login } from "../utils/Login/Login";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const initialized = useSelector<AppRootStateType, boolean>(
    (state) => state.app.isInitialized
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializedAppTC());
  }, []);

  if (!initialized) {
    return <CircularProgress />;
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
          {isLoggedIn ? <Button color="inherit">Log Out</Button> : null}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
