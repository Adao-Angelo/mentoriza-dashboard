import Cookies from "js-cookie";
import { SaveTokenData } from "./types";

export function saveToken({ expiresIn, token }: SaveTokenData) {
  Cookies.set("token", token);
  Cookies.set("expiresIn", expiresIn ?? "");
}
