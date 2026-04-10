import Cookies from "js-cookie";

export function removeToken() {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("expiresIn", { path: "/" });
}
