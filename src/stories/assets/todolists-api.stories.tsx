import axios from "axios";
import React, { useEffect, useState } from "react";

export default {
  title: "API",
};

const settings = {
  withCredentials: true,
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>({ name: "vasia" });
  useEffect(() => {
    // здесь мы будем делать запрос и ответ закидывать в стейт.
    // который в виде строки будем отображать в div-ке
    let promise = axios.get(
      "https://social-network.samuraijs.com/api/1.1/todo-lists",
      settings
    );
    promise.then((res) => setState(res.data));
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {}, []);

  return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {}, []);

  return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {}, []);

  return <div>{JSON.stringify(state)}</div>;
};
