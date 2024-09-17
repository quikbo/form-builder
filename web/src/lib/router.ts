import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, // Home page with a list of posts
  form: `${BASE_URL}forms/:formId`, // Specified deck page with a list of cards
  login: `${BASE_URL}login`,
  register: `${BASE_URL}register`,
  notfound: `${BASE_URL}404`,
});
