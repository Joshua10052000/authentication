import { getAuth } from "../shared/actions/get-auth.js";

const form = document.querySelector("form");
const submitButton = form.querySelector("button");
const formResponse = document.querySelector("#form-response");

document.addEventListener("DOMContentLoaded", async () => {
  const auth = await getAuth();

  if (auth) {
    window.location.href = "/";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    renderFormResponse("pending");

    const formData = new FormData(e.target);
    const values = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    try {
      const response = await fetch("./api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();

      renderFormResponse("success", data.message);
    } catch (error) {
      renderFormResponse("error", error.message);
    } finally {
      submitButton.disabled = false;
    }
  });
});

function renderFormResponse(status, message) {
  formResponse.innerHTML = `
    <div class="rounded-md border shadow p-2 text-sm block ${
      status === "success"
        ? "bg-emerald-500/15 text-emerald-500"
        : status === "error"
        ? "bg-destructive/15 text-destructive"
        : "hidden"
    }">
      ${message}
    </div>
  `;
}
