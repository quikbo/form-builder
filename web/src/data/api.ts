import { API_URL } from "@/env.ts";
import { FormType, FieldType, UserType } from "./types";

//FORMS API

export const fetchForms = async (
  page: number = 1,
  limit: number = 10,
  sort: string = "desc",
): Promise<{
  data: FormType[];
  totalForms: number;
  totalPages: number;
  limit: number;
}> => {
  const response = await fetch(
    `${API_URL}/forms?page=${page}&limit=${limit}&sort=${sort}`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(
      `Read Form API request failed with code: ${response.status}`,
    );
  }
  const responseJSON = await response.json();
  const data = responseJSON.data;
  const totalForms = responseJSON.meta.totalCount;
  const totalPages = responseJSON.meta.totalPages;
  return { data, totalForms, totalPages, limit };
};

export const deleteForm = async (id: string): Promise<FormType> => {
  const response = await fetch(`${API_URL}/forms/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const createForm = async (
  title: string,
  numberOfFields: number,
): Promise<FormType> => {
  const response = await fetch(`${API_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      numberOfFields,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const updateForm = async (
  id: string,
  title: string,
): Promise<FormType> => {
  const response = await fetch(`${API_URL}/forms/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

//CARDS API

export const fetchFields = async (
  formId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  data: FieldType[];
  totalFields: number;
  totalPages: number;
  limit: number;
  success: boolean;
}> => {
  const response = await fetch(
    `${API_URL}/forms/${formId}/fields?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  const data = responseJSON.data;
  const totalFields = responseJSON.meta.totalCount;
  const totalPages = responseJSON.meta.totalPages;
  const success = responseJSON.success;
  return { data, totalFields, totalPages, limit, success };
};

export const deleteField = async (
  formId: string,
  fieldId: string,
): Promise<FieldType> => {
  const response = await fetch(`${API_URL}/forms/${formId}/fields/${fieldId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const createField = async (
  formId: string,
  label: string, // Represents the question label
  type: "text" | "multiple_choice" | "checkbox" | "dropdown",
  required: boolean,
  options?: string[],
): Promise<FieldType> => {
  const response = await fetch(`${API_URL}/forms/${formId}/fields`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label,
      type,
      required,
      options,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const updateField = async (
  formId: string,
  fieldId: string,
  label?: string, // Represents the question label
  type?: "text" | "multiple_choice" | "checkbox" | "dropdown",
  required?: boolean,
  options?: string[],
): Promise<FieldType> => {
  const response = await fetch(`${API_URL}/forms/${formId}/fields/${fieldId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label,
      type,
      required,
      options,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

//AUTH API

export const signUp = async (
  name: string,
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      username,
      password,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.user;
};

export const signIn = async (
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { user }: { user: UserType } = await response.json();
  return user;
};

export const signOut = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};

export const validateSession = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/validate-session`, {
    method: "POST",
    credentials: "include",
  });
  const responseJSON = await response.json();
  return responseJSON.success;
};
