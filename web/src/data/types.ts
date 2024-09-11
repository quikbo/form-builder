export type DeckType = {
  id: string;
  title: string;
  numberOfCards: string;
  date: string;
  author: UserType;
};

export type CardType = {
  id: string;
  front: string;
  back: string;
  date: string;
  deckId: string;
  author: UserType;
};

export type UserType = {
  id: string;
  name: string;
  username: string;
};
