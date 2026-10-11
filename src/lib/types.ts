import { type } from "arktype";

export const urlSchema = type({
  url: "string.url.parse",
});
