import { getAuth } from "../shared/actions/get-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const auth = await getAuth();

  if (!auth) {
    window.location.href = "/signin";
    return;
  }

  const h1 = document.querySelector("h1");

  h1.innerHTML = `Welcome back, ${auth.name}!`;
  h1.className = "text-2xl font-bold";
});
