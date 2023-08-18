import React, { useState, ChangeEvent } from "react";

type EditableSpanPropsType = {
  title: string;
  onChange: (title: string) => void;
};

export const EditableSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.title);
  };

  const activateViewMode = () => {
    setEditMode(false);
  };

  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    props.onChange(title);
  };

  return editMode ? (
    <input
      onChange={onChangeTitleHandler}
      onBlur={activateViewMode}
      value={title}
      autoFocus
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.title}</span>
  );
};
