import { API_URL } from "@/env.ts";
import { FormType, FieldType, UserType, ResponsesType } from "./types";

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


// Function to create a share link for a specific form
export const createShareLink = async (formId: string): Promise<{ shareId: string }> => {
  const response = await fetch(`${API_URL}/share/form/${formId}`, {
    method: "POST",
    credentials: "include", // Include credentials if required by authGuard
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

// Function to fetch a form using the share link
export const fetchFormByShareLink = async (shareId: string): Promise<FormType> => {
  const response = await fetch(`${API_URL}/share/${shareId}`, {
    credentials: "include", // Optional: if you have public access, remove this
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

// Function to delete a share link for a specific form
export const deleteShareLink = async (shareId: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/share/${shareId}`, {
    method: "DELETE",
    credentials: "include", // Include credentials if required by authGuard
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return true;
};

// Function to check if a share link already exists for a specific form
export const checkExistingShareLink = async (
  formId: string
): Promise<{ shareId: string } | null> => {
  const response = await fetch(`${API_URL}/share/form/${formId}`, {
    credentials: "include", // Include credentials if needed
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};


// Create a new response for a form
export const createResponse = async (
  formId: string,
  fieldResponses: { fieldId: string; response?: any }[],
  userId?: string // Optional if you want to track who submitted
): Promise<ResponsesType> => {
  const response = await fetch(`${API_URL}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formId,
      fieldResponses,
      userId,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

// Fetch all responses for a specific form
export const fetchResponsesByFormId = async (
  formId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  data: ResponsesType[];
  totalResponses: number;
  totalPages: number;
  limit: number;
}> => {
  const response = await fetch(
    `${API_URL}/responses/form/${formId}?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`Fetch Responses API request failed with code: ${response.status}`);
  }
  const responseJSON = await response.json();
  const data = responseJSON.data;
  const totalResponses = responseJSON.meta.totalCount;
  const totalPages = responseJSON.meta.totalPages;
  return { data, totalResponses, totalPages, limit };
};

// Update an existing response
export const updateResponseFields = async (
  responseId: string,
  fieldResponses: { fieldId: string; response?: any }[]
): Promise<ResponsesType> => {
  const response = await fetch(`${API_URL}/responses/${responseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fieldResponses,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

// Delete a response by its ID
export const deleteResponse = async (responseId: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/responses/${responseId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return true;
};