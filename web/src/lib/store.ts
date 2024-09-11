import { DeckType, CardType, UserType } from "@/data/types";
import { atom } from "nanostores";
import { persistentMap } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

const DEBUG = false;

//LAYOUT STATE MANAGEMENT
export const $sessionValid = atom<boolean>(false);
export function setSessionValid(bool: boolean) {
  $sessionValid.set(bool);
}

export const $currentPage = atom(1);
export function setPage(newPage: number) {
  $currentPage.set(newPage);
}

export const $pageLimit = atom(1);
export function setPageLimit(limit: number) {
  $pageLimit.set(limit);
}

export const $totalDeckPages = atom<number>(1);
export function setTotalDeckPages(pages: number) {
  $totalDeckPages.set(pages);
}

export const $totalDeckCount = atom<number>(1);
export function setTotalDeckCount(decks: number) {
  $totalDeckCount.set(decks);
}
export function decrementDeckCount() {
  $totalDeckCount.set($totalDeckCount.get() - 1);
}
export function incrementDeckCount() {
  $totalDeckCount.set($totalDeckCount.get() + 1);
}

export const $totalCardPages = atom<number>(1);
export function setTotalCardPages(pages: number) {
  $totalCardPages.set(pages);
}

export const $totalCardCount = atom<number>(1);
export function setTotalCardCount(cards: number) {
  $totalCardCount.set(cards);
}
export function decrementCardCount() {
  $totalCardCount.set($totalCardCount.get() - 1);
}
export function incrementCardCount() {
  $totalCardCount.set($totalCardCount.get() + 1);
}

//DECKS STATE MANAGEMENT

export const $decks = atom<DeckType[]>([]);

export function setDecks(posts: DeckType[]) {
  $decks.set(posts);
}

export function addDeck(post: DeckType) {
  $decks.set([post, ...$decks.get()]);
}

export function removeDeck(id: string) {
  $decks.set($decks.get().filter((d) => d.id !== id));
}

export function updateDeckTitle(id: string, title: string) {
  $decks.set(
    $decks.get().map((d) => {
      if (d.id === id) {
        return { ...d, title: title };
      }
      return d;
    }),
  );
}

//MIGHT DELETE THESE WELL SEE
export const $deckExists = atom<boolean>(true);
export function setDeckExists(exists: boolean) {
  $deckExists.set(exists);
}

//CARDS STATE MANAGEMENT

export const $cards = atom<CardType[]>([]);

export function setCards(cards: CardType[]) {
  $cards.set(cards);
}

export function addCard(card: CardType) {
  $cards.set([card, ...$cards.get()]);
}

export function removeCard(id: string) {
  $cards.set($cards.get().filter((c) => c.id !== id));
}

export function updateCardContent(id: string, front: string, back: string) {
  $cards.set(
    $cards.get().map((c) => {
      if (c.id === id) {
        return { ...c, front: front, back: back };
      }
      return c;
    }),
  );
}

//AUTH STATE MANAGEMENT

const defaultUser: UserType = {
  id: "",
  name: "",
  username: "",
};
export const $user = persistentMap("user:", defaultUser);

export function setUser(user: UserType) {
  $user.set(user);
}

export function clearUser() {
  $user.set(defaultUser);
}

DEBUG && logger({ $decks, $currentPage, $cards });
