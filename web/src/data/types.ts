export type FormType = {
  id: string;
  title: string;
  numberOfFields: string;
  date: string;
  userId: UserType;
};

export type FieldType = {
  id: string;
  label: string; // Represents the question label
  type: "text" | "multiple_choice" | "checkbox" | "dropdown";
  required: boolean;
  options?: string[];
  date: string;
  formId: string;
};

export type UserType = {
  id: string;
  name: string;
  username: string;
};
