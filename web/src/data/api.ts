import { API_URL } from "@/env.ts";
import { DeckType, CardType, UserType } from "./types";

//DECKS API

export const fetchDecks = async (
  page: number = 1,
  limit: number = 10,
  sort: string = "desc",
): Promise<{
  data: DeckType[];
  totalDecks: number;
  totalPages: number;
  limit: number;
}> => {
  const response = await fetch(
    `${API_URL}/decks?page=${page}&limit=${limit}&sort=${sort}`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(
      `Read Deck API request failed with code: ${response.status}`,
    );
  }
  const responseJSON = await response.json();
  const data = responseJSON.data;
  const totalDecks = responseJSON.meta.totalCount;
  const totalPages = responseJSON.meta.totalPages;
  return { data, totalDecks, totalPages, limit };
};

export const deleteDeck = async (id: string): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const createDeck = async (
  title: string,
  numberOfCards: number,
): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      numberOfCards,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const updateDeck = async (
  id: string,
  title: string,
): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks/${id}`, {
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

export const fetchCards = async (
  deckId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  data: CardType[];
  totalCards: number;
  totalPages: number;
  limit: number;
  success: boolean;
}> => {
  const response = await fetch(
    `${API_URL}/decks/${deckId}/cards?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  const data = responseJSON.data;
  const totalCards = responseJSON.meta.totalCount;
  const totalPages = responseJSON.meta.totalPages;
  const success = responseJSON.success;
  return { data, totalCards, totalPages, limit, success };
};

export const deleteCard = async (
  deckId: string,
  cardId: string,
): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const createCard = async (
  deckId: string,
  front: string,
  back: string,
): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      front,
      back,
    }),
    credentials: "include",
  });
  const responseJSON = await response.json();
  if (!responseJSON.success) {
    throw new Error(`${responseJSON.message}`);
  }
  return responseJSON.data;
};

export const updateCard = async (
  deckId: string,
  cardId: string,
  front: string,
  back: string,
): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      front,
      back,
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
