import { FieldType } from "@/data/types";
import FieldActions from "./field-actions";
import { useState } from "react";
import Author from "../shared/author";
import useAuth from "@/hooks/use-auth";

type FieldProps = {
  field: FieldType;
};

const Field = ({ field }: FieldProps) => {
  const [flipState, setFlipState] = useState(false);
  const { user, validate } = useAuth();

  const toggleFlip = async () => {
    await validate();
    setFlipState(!flipState);
  };

  const setCardStyleClass = () => {
    if (!flipState) {
      //front of card
      return "mx-auto rounded-lg p-5 border-black border-2 border-solid cursor-pointer";
    } else {
      return "mx-auto rounded-lg p-5 border-gray-250 border-2 border-solid bg-sky-950 cursor-pointer";
    }
  };

  const setTextStyleClass = () => {
    if (!flipState) {
      //front of card
      return "flex items-center justify-center min-h-60";
    } else {
      return "flex items-center justify-center min-h-60 text-white";
    }
  };

  const setActionsStyleClass = () => {
    if (!flipState) {
      //front of field
      return "absolute top-14 right-5";
    } else {
      return "absolute top-14 left-5";
    }
  };

  return (
    <>
      <div className="flex-none p-12 border-b relative">
        <Author author={user} />
        <div className={setCardStyleClass()} onClick={toggleFlip}>
          <div className={setTextStyleClass()}>
            {!flipState && field.front}
            {flipState && field.back}
          </div>
        </div>
        <div className={setActionsStyleClass()}>
          <FieldActions field={field} />
        </div>
      </div>
    </>
  );
};

export default Field;
