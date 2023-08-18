import React, { useState, KeyboardEvent, ChangeEvent } from "react";

type AddItemFormPropsType = {
  addItem: (title: string) => void;
};
export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setTitleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value);
  };

  const addTaskHandler = () => {
    if (taskTitle.trim() !== "") {
      props.addItem(taskTitle.trim());
      setTaskTitle("");
    } else {
      setError("Title is requered");
    }
  };

  const onKeyPressHandler = (e: KeyboardEvent) => {
    setError("");
    if (e.charCode === 13) {
      addTaskHandler();
    }
  };

  return (
    <div>
      <input
        value={taskTitle}
        onChange={setTitleValue}
        onKeyPress={onKeyPressHandler}
        className={error ? "error" : ""}
      />
      <button onClick={() => addTaskHandler()}>+</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
});
