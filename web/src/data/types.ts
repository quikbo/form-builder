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


// Type for a single field response within a response
export type FieldResponseType = {
  fieldId: string; // ID of the field being responded to
  label: string;
  response?: any; // The actual response, could be string, number, etc.
};

// Type for Response
export type ResponsesType = {
  id: string; // ID of the response
  formId: string; // ID of the form the response belongs to
  fieldResponses: FieldResponseType[]; // Array of responses to each field
  userId?: string; // Optional: ID of the user who submitted the response, if applicable
  submittedAt: string; // Date the response was submitted
};
