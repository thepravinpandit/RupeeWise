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
  registerOtp: document.querySelector("#register-otp"),
  otpSection: document.querySelector("#otp-section"),
  registerBtn: document.querySelector("#register-btn"),
  verifyBtn: document.querySelector("#verify-btn"),
  forgotPasswordLink: document.querySelector("#forgot-password-link"),
  forgotPasswordSection: document.querySelector("#forgot-password-section"),
  loginBtn: document.querySelector("#login-btn"),
  loginFooter: document.querySelector("#login-footer"),
  sendResetOtpBtn: document.querySelector("#send-reset-otp-btn"),
  resetStep1: document.querySelector("#reset-step-1"),
  resetStep2: document.querySelector("#reset-step-2"),
  resetOtp: document.querySelector("#reset-otp"),
  resetNewPassword: document.querySelector("#reset-new-password"),
  resetConfirmPassword: document.querySelector("#reset-confirm-password"),
  resetPasswordBtn: document.querySelector("#reset-password-btn"),
  backToLoginBtn: document.querySelector("#back-to-login-btn"),
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

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character.";
  return null;
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

  // If OTP section is visible, handle verification instead of requesting new OTP
  if (!elements.otpSection?.classList.contains("hidden")) {
    return handleVerifyAndRegister(event);
  }



  if (!name || !email || !password) {
    setAuthMessage("error", "Please fill in all required fields.");
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    setAuthMessage("error", passwordError);
    elements.registerPassword?.classList.add("input-invalid");
    return;
  }

  if (password !== confirm) {
    setAuthMessage("error", "Passwords do not match.");
    elements.registerConfirm?.classList.add("input-invalid");
    return;
  }


  try {
    setFormLoading(elements.registerForm, true, "Sending OTP...");
    await fetchJSON(`${API_BASE}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setAuthMessage("success", "Verification code sent to your email.");
    elements.otpSection?.classList.remove("hidden");
    elements.registerBtn?.classList.add("hidden");
    elements.verifyBtn?.classList.remove("hidden");
  } catch (error) {
    setAuthMessage("error", error.message || "Failed to send verification code.");
  } finally {
    setFormLoading(elements.registerForm, false);
  }
};

let isVerifying = false;
const handleVerifyAndRegister = async (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (isVerifying) return;

  
  clearAuthMessage();
  const name = elements.registerName?.value.trim();
  const email = elements.registerEmail?.value.trim();
  const password = elements.registerPassword?.value || "";
  const otp = elements.registerOtp?.value.trim();

  if (!otp) {
    setAuthMessage("error", "Please enter the verification code.");
    return;
  }

  try {
    isVerifying = true;
    setFormLoading(elements.registerForm, true, "Verifying...");
    if (elements.verifyBtn) elements.verifyBtn.disabled = true;
    
    // 1. Verify OTP
    await fetchJSON(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    // 2. If OTP is valid, proceed with registration
    setAuthMessage("success", "Code verified! Creating account...");
    const data = await fetchJSON(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setAuthToken(data.token);
    redirectToApp();
  } catch (error) {
    // If verify-otp fails but it's already "Invalid OTP", it might be because
    // it was already verified and deleted. We should check if we can just proceed.
    // However, it's safer to just show the error and let the user try again if needed.
    setAuthMessage("error", error.message || "Verification failed.");
    if (elements.verifyBtn) elements.verifyBtn.disabled = false;
  } finally {
    isVerifying = false;
    setFormLoading(elements.registerForm, false);
  }
};

const handleRequestReset = async () => {
  const email = elements.loginEmail?.value.trim();
  if (!email) {
    setAuthMessage("error", "Please enter your email address first.");
    return;
  }

  try {
    setFormLoading(elements.loginForm, true, "Sending code...");
    await fetchJSON(`${API_BASE}/auth/forgot-password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setAuthMessage("success", "Reset code sent to your email.");
    elements.resetStep1?.classList.add("hidden");
    elements.resetStep2?.classList.remove("hidden");
  } catch (error) {
    setAuthMessage("error", error.message || "Failed to send reset code.");
  } finally {
    setFormLoading(elements.loginForm, false);
  }
};

const handleResetPassword = async () => {
  const email = elements.loginEmail?.value.trim();
  const otp = elements.resetOtp?.value.trim();
  const newPassword = elements.resetNewPassword?.value;
  const confirmPassword = elements.resetConfirmPassword?.value;

  if (!otp || !newPassword || !confirmPassword) {
    setAuthMessage("error", "Please fill in all fields.");
    return;
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    setAuthMessage("error", passwordError);
    elements.resetNewPassword?.classList.add("input-invalid");
    return;
  }

  if (newPassword !== confirmPassword) {
    setAuthMessage("error", "Passwords do not match.");
    elements.resetConfirmPassword?.classList.add("input-invalid");
    return;
  }


  try {
    setFormLoading(elements.loginForm, true, "Resetting password...");
    await fetchJSON(`${API_BASE}/auth/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    // Reset UI but keep the success message
    toggleForgotPassword(false, true); 
    setAuthMessage("success", "Password reset! You can now sign in.");
  } catch (error) {
    setAuthMessage("error", error.message || "Reset failed.");
  } finally {
    setFormLoading(elements.loginForm, false);
  }
};

const toggleForgotPassword = (show, skipClear = false) => {
  if (!skipClear) clearAuthMessage();
  if (show) {

    elements.loginBtn?.classList.add("hidden");
    elements.loginFooter?.classList.add("hidden");
    elements.forgotPasswordSection?.classList.remove("hidden");
    elements.resetStep1?.classList.remove("hidden");
    elements.resetStep2?.classList.add("hidden");
  } else {
    elements.loginBtn?.classList.remove("hidden");
    elements.loginFooter?.classList.remove("hidden");
    elements.forgotPasswordSection?.classList.add("hidden");
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
if (elements.verifyBtn) elements.verifyBtn.addEventListener("click", handleVerifyAndRegister);

if (elements.forgotPasswordLink) {
  elements.forgotPasswordLink.addEventListener("click", () => toggleForgotPassword(true));
}
if (elements.backToLoginBtn) {
  elements.backToLoginBtn.addEventListener("click", () => toggleForgotPassword(false));
}
if (elements.sendResetOtpBtn) {
  elements.sendResetOtpBtn.addEventListener("click", handleRequestReset);
}
if (elements.resetPasswordBtn) {
  elements.resetPasswordBtn.addEventListener("click", handleResetPassword);
}



elements.showPasswordToggles.forEach((checkbox) =>
  checkbox.addEventListener("change", handleTogglePassword)
);

if (elements.registerPassword) {
  elements.registerPassword.addEventListener("input", updatePasswordMeter);
  updatePasswordMeter();
}
