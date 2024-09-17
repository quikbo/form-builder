import { FormType, FieldType, UserType } from "@/data/types";
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

export const $totalFormPages = atom<number>(1);
export function setTotalFormPages(pages: number) {
  $totalFormPages.set(pages);
}

export const $totalFormCount = atom<number>(1);
export function setTotalFormCount(forms: number) {
  $totalFormCount.set(forms);
}
export function decrementFormCount() {
  $totalFormCount.set($totalFormCount.get() - 1);
}
export function incrementFormCount() {
  $totalFormCount.set($totalFormCount.get() + 1);
}

export const $totalFieldPages = atom<number>(1);
export function setTotalFieldPages(pages: number) {
  $totalFieldPages.set(pages);
}

export const $totalFieldCount = atom<number>(1);
export function setTotalFieldCount(fields: number) {
  $totalFieldCount.set(fields);
}
export function decrementFieldCount() {
  $totalFieldCount.set($totalFieldCount.get() - 1);
}
export function incrementFieldCount() {
  $totalFieldCount.set($totalFieldCount.get() + 1);
}

//DECKS STATE MANAGEMENT

export const $forms = atom<FormType[]>([]);

export function setForms(forms: FormType[]) {
  $forms.set(forms);
}

export function addForm(form: FormType) {
  $forms.set([form, ...$forms.get()]);
}

export function removeForm(id: string) {
  $forms.set($forms.get().filter((f) => f.id !== id));
}

export function updateFormTitle(id: string, title: string) {
  $forms.set(
    $forms.get().map((f) => {
      if (f.id === id) {
        return { ...f, title: title };
      }
      return f;
    }),
  );
}

//MIGHT DELETE THESE WELL SEE
export const $deckExists = atom<boolean>(true);
export function setDeckExists(exists: boolean) {
  $deckExists.set(exists);
}

//CARDS STATE MANAGEMENT

export const $fields = atom<FieldType[]>([]);

export function setFields(fields: FieldType[]) {
  console.log(fields)
  $fields.set(fields);
}

export function addField(field: FieldType) {
  $fields.set([field, ...$fields.get()]);
}

export function removeField(id: string) {
  $fields.set($fields.get().filter((i) => i.id !== id));
}

export function updateFieldContent(id: string, front: string, back: string) {
  $fields.set(
    $fields.get().map((i) => {
      if (i.id === id) {
        return { ...i, front: front, back: back };
      }
      return i;
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

DEBUG && logger({ $forms, $currentPage, $fields });
