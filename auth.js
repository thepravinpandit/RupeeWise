const API_BASE =
  window.location.protocol === "file:"
    ? "http://localhost:3000/api"
    : `${window.location.origin}/api`;
const TOKEN_KEY = "rupeewise-token";

const elements = {
  loginForm: document.querySelector("#login-form"),
  loginEmail: document.querySelector("#login-email"),
  loginPassword: document.querySelector("#login-password"),
  registerForm: document.querySelector("#register-form"),
  registerName: document.querySelector("#register-name"),
  registerEmail: document.querySelector("#register-email"),
  registerPassword: document.querySelector("#register-password"),
  registerConfirm: document.querySelector("#register-confirm"),
  authMessage: document.querySelector("#auth-message"),
  showPasswordToggles: document.querySelectorAll(".show-password-toggle"),
  passwordMeter: document.querySelector("#password-meter"),
  passwordMeterLabel: document.querySelector("#password-meter-label"),
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const fetchJSON = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = "Request failed";
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      message = data?.error || JSON.stringify(data) || message;
    } else {
      message = await response.text();
    }
    throw new Error(message || "Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
};

const setAuthMessage = (type, text) => {
  if (!elements.authMessage) return;
  elements.authMessage.textContent = text;
  elements.authMessage.classList.remove("hidden", "error", "success");
  elements.authMessage.classList.add(type);
};

const clearAuthMessage = () => {
  if (!elements.authMessage) return;
  elements.authMessage.textContent = "";
  elements.authMessage.classList.add("hidden");
  elements.authMessage.classList.remove("error", "success");
};

const setFormLoading = (form, isLoading, label = "Submitting...") => {
  if (!form) return;
  const button = form.querySelector("button[type=\"submit\"]");
  if (!button) return;
  button.disabled = isLoading;
  button.dataset.originalText = button.dataset.originalText || button.textContent;
  button.textContent = isLoading ? label : button.dataset.originalText;
};

const updatePasswordMeter = () => {
  if (!elements.passwordMeter || !elements.passwordMeterLabel || !elements.registerPassword)
    return;
  const value = elements.registerPassword.value || "";
  let strength = 0;
  if (value.length >= 8) strength = 1;
  if (value.length >= 12) strength = 2;
  if (value.length >= 16) strength = 3;
  elements.passwordMeter.dataset.strength = strength.toString();
  if (strength === 0) elements.passwordMeterLabel.textContent = "Use 12+ characters";
  if (strength === 1) elements.passwordMeterLabel.textContent = "Okay";
  if (strength === 2) elements.passwordMeterLabel.textContent = "Strong";
  if (strength === 3) elements.passwordMeterLabel.textContent = "Very strong";
};

const redirectToApp = () => {
  if (window.location.protocol === "file:") {
    window.location.href = "index.html";
  } else {
    window.location.href = "/";
  }
};

const redirectToLogin = () => {
  if (window.location.protocol === "file:") {
    window.location.href = "login.html";
  } else {
    window.location.href = "/login";
  }
};

const handleLogin = async (event) => {
  event.preventDefault();
  clearAuthMessage();
  elements.loginPassword?.classList.remove("input-invalid");

  const email = elements.loginEmail?.value.trim();
  const password = elements.loginPassword?.value || "";
  if (!email || !password) {
    setAuthMessage("error", "Please enter your email and password.");
    return;
  }

  try {
    setFormLoading(elements.loginForm, true, "Signing in...");
    const data = await fetchJSON(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setAuthToken(data.token);
    redirectToApp();
  } catch (error) {
    setAuthMessage("error", "Login failed. Check your email and password.");
    elements.loginPassword?.classList.add("input-invalid");
  } finally {
    setFormLoading(elements.loginForm, false);
  }
};

const handleRegister = async (event) => {
  event.preventDefault();
  clearAuthMessage();
  elements.registerPassword?.classList.remove("input-invalid");
  elements.registerConfirm?.classList.remove("input-invalid");

  const name = elements.registerName?.value.trim();
  const email = elements.registerEmail?.value.trim();
  const password = elements.registerPassword?.value || "";
  const confirm = elements.registerConfirm?.value || "";

  if (!name || !email || !password) {
    setAuthMessage("error", "Please fill in all required fields.");
    return;
  }
  if (password.length < 8) {
    setAuthMessage("error", "Password must be at least 8 characters.");
    elements.registerPassword?.classList.add("input-invalid");
    return;
  }
  if (password !== confirm) {
    setAuthMessage("error", "Passwords do not match.");
    elements.registerConfirm?.classList.add("input-invalid");
    return;
  }

  try {
    setFormLoading(elements.registerForm, true, "Creating account...");
    await fetchJSON(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    redirectToLogin();
  } catch (error) {
    setAuthMessage(
      "error",
      "Unable to create account. Please try a different email or password."
    );
    elements.registerPassword?.classList.add("input-invalid");
  } finally {
    setFormLoading(elements.registerForm, false);
  }
};

const handleTogglePassword = (event) => {
  const control = event.currentTarget;
  const targetIds = (control.dataset.target || "").split(",").map((id) => id.trim());
  const activeElement = document.activeElement;
  const shouldShow = control.checked ?? control.getAttribute("aria-pressed") !== "true";
  const targetInputs = targetIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  targetInputs.forEach((input) => {
    input.type = shouldShow ? "text" : "password";
  });
  if (activeElement && targetInputs.includes(activeElement)) {
    activeElement.focus({ preventScroll: true });
  }
  if (control.type === "checkbox") {
    control.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
    const text = control
      .closest(".show-password")
      ?.querySelector(".show-password-text");
    if (text) text.textContent = shouldShow ? "Hide password" : "Show password";
  }
};

if (elements.loginForm) elements.loginForm.addEventListener("submit", handleLogin);
if (elements.registerForm) elements.registerForm.addEventListener("submit", handleRegister);

elements.showPasswordToggles.forEach((checkbox) =>
  checkbox.addEventListener("change", handleTogglePassword)
);

if (elements.registerPassword) {
  elements.registerPassword.addEventListener("input", updatePasswordMeter);
  updatePasswordMeter();
}
