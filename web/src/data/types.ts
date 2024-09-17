export type FormType = {
  id: string;
  title: string;
  numberOfFields: string;
  date: string;
  userId: UserType;
};

export type FieldType = {
  id: string;
  front: string;
  back: string;
  date: string;
  formId: string;
};

export type UserType = {
  id: string;
  name: string;
  username: string;
};
