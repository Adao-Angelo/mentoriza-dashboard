import Cookies from "js-cookie";
import { SaveTokenData } from "./types";

export function saveToken({ expiresIn, token }: SaveTokenData) {
  Cookies.set("token", token, { path: "/" });
  Cookies.set("expiresIn", expiresIn ?? "", { path: "/" });
}
