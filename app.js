const API_BASE =
  window.location.protocol === "file:"
    ? "http://localhost:3000/api"
    : `${window.location.origin}/api`;
const API_ORIGIN =
  window.location.protocol === "file:" ? "http://localhost:3000" : window.location.origin;
const TOKEN_KEY = "rupeewise-token";
const THEME_KEY = "rupeewise-theme";
const redirectToLogin = () => {
  if (window.location.protocol === "file:") {
    window.location.href = "login.html";
  } else {
    window.location.href = "/login";
  }
};

const elements = {
  tabs: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".tab-panel"),
  authTab: document.querySelector(".auth-tab"),
  userCard: document.querySelector("#user-card"),
  userAvatar: document.querySelector("#user-avatar"),
  userName: document.querySelector("#user-name"),
  userEmail: document.querySelector("#user-email"),
  form: document.querySelector("#expense-form"),
  amount: document.querySelector("#amount"),
  category: document.querySelector("#category"),
  date: document.querySelector("#date"),
  payment: document.querySelector("#payment"),
  note: document.querySelector("#note"),
  noteChips: document.querySelectorAll(".note-chip"),
  receipt: document.querySelector("#receipt"),
  receiptFileName: document.querySelector("#receipt-file-name"),
  submitButton: document.querySelector("#submit-button"),
  cancelEdit: document.querySelector("#cancel-edit"),
  totalSpent: document.querySelector("#total-spent"),
  avgSpent: document.querySelector("#avg-spent"),
  largestExpense: document.querySelector("#largest-expense"),
  remainingIncome: document.querySelector("#remaining-income"),
  snapshotRange: document.querySelector("#snapshot-range"),
  budgetMonth: document.querySelector("#budget-month"),
  budgetInput: document.querySelector("#budget-input"),
  saveBudget: document.querySelector("#save-budget"),
  budgetBar: document.querySelector("#budget-bar"),
  budgetNote: document.querySelector("#budget-note"),
  budgetLimitNote: document.querySelector("#budget-limit-note"),
  breakdownList: document.querySelector("#breakdown-list"),
  expenseList: document.querySelector("#expense-list"),
  emptyState: document.querySelector("#empty-state"),
  notificationButton: document.querySelector("#notification-button"),
  notificationCount: document.querySelector("#notification-count"),
  notificationModal: document.querySelector("#notification-modal"),
  notificationList: document.querySelector("#notification-list"),
  notificationClose: document.querySelector("#notification-close"),
  monthFilter: document.querySelector("#month-filter"),
  categoryFilter: document.querySelector("#category-filter"),
  searchFilter: document.querySelector("#search-filter"),
  sortFilter: document.querySelector("#sort-filter"),
  demoButton: document.querySelector("#demo-data"),
  resetButton: document.querySelector("#reset-data"),
  exportCsv: document.querySelector("#export-csv"),
  exportJson: document.querySelector("#export-json"),
  quickAddButtons: document.querySelectorAll(".quick-add .chip"),
  upiForm: document.querySelector("#upi-form"),
  upiLabel: document.querySelector("#upi-label"),
  upiId: document.querySelector("#upi-id"),
  cardForm: document.querySelector("#card-form"),
  cardLabel: document.querySelector("#card-label"),
  cardType: document.querySelector("#card-type"),
  cardNetwork: document.querySelector("#card-network"),
  cardLast4: document.querySelector("#card-last4"),
  simplePaymentForm: document.querySelector("#simple-payment-form"),
  simplePaymentType: document.querySelector("#simple-payment-type"),
  simplePaymentLabel: document.querySelector("#simple-payment-label"),
  paymentList: document.querySelector("#payment-list"),
  categoryForm: document.querySelector("#category-form"),
  categoryName: document.querySelector("#category-name"),
  categoryColor: document.querySelector("#category-color"),
  categoryList: document.querySelector("#category-list"),
  insightCount: document.querySelector("#insight-count"),
  insightTop: document.querySelector("#insight-top"),
  insightPayment: document.querySelector("#insight-payment"),
  insightRangeButtons: document.querySelectorAll(".insight-range .range-chip"),
  insightChart: document.querySelector("#insight-chart"),
  insightTitle: document.querySelector("#insight-title"),
  insightSubtitle: document.querySelector("#insight-subtitle"),
  insightValue: document.querySelector("#insight-value"),
  insightFeed: document.querySelector("#insight-feed"),
  insightPie: document.querySelector("#insight-pie"),
  insightPieLegend: document.querySelector("#insight-pie-legend"),
  insightLine: document.querySelector("#insight-line"),
  insightWeekTotal: document.querySelector("#insight-week-total"),
  insightMonthTotal: document.querySelector("#insight-month-total"),
  insightYearTotal: document.querySelector("#insight-year-total"),
  insightWeekLabel: document.querySelector("#insight-week-label"),
  insightMonthLabel: document.querySelector("#insight-month-label"),
  insightYearLabel: document.querySelector("#insight-year-label"),
  categoryBudgetForm: document.querySelector("#category-budget-form"),
  categoryBudgetCategory: document.querySelector("#category-budget-category"),
  categoryBudgetPeriod: document.querySelector("#category-budget-period"),
  categoryBudgetAmount: document.querySelector("#category-budget-amount"),
  categoryBudgetList: document.querySelector("#category-budget-list"),
  budgetHistoryList: document.querySelector("#budget-history-list"),
  budgetAlertsList: document.querySelector("#budget-alerts"),
  recurringForm: document.querySelector("#recurring-form"),
  recurringLabel: document.querySelector("#recurring-label"),
  recurringAmount: document.querySelector("#recurring-amount"),
  recurringCategory: document.querySelector("#recurring-category"),
  recurringPayment: document.querySelector("#recurring-payment"),
  recurringDay: document.querySelector("#recurring-day"),
  recurringNote: document.querySelector("#recurring-note"),
  recurringList: document.querySelector("#recurring-list"),
  incomeSourceForm: document.querySelector("#income-source-form"),
  incomeSourceName: document.querySelector("#income-source-name"),
  incomeSourceType: document.querySelector("#income-source-type"),
  incomeSourceList: document.querySelector("#income-source-list"),
  incomeEntryForm: document.querySelector("#income-entry-form"),
  incomeSourceSelect: document.querySelector("#income-source"),
  incomeAmount: document.querySelector("#income-amount"),
  incomeDate: document.querySelector("#income-date"),
  incomeNote: document.querySelector("#income-note"),
  incomeList: document.querySelector("#income-list"),
  incomeMonthFilter: document.querySelector("#income-month-filter"),
  incomeTotal: document.querySelector("#income-total"),
  loginForm: document.querySelector("#login-form"),
  loginEmail: document.querySelector("#login-email"),
  loginPassword: document.querySelector("#login-password"),
  registerForm: document.querySelector("#register-form"),
  registerName: document.querySelector("#register-name"),
  registerEmail: document.querySelector("#register-email"),
  registerPassword: document.querySelector("#register-password"),
  registerConfirm: document.querySelector("#register-confirm"),
  profileForm: document.querySelector("#profile-form"),
  profileName: document.querySelector("#profile-name"),
  profileEmail: document.querySelector("#profile-email"),
  avatarForm: document.querySelector("#avatar-form"),
  avatarInput: document.querySelector("#avatar-input"),
  avatarFileName: document.querySelector("#avatar-file-name"),
  profileAvatar: document.querySelector("#profile-avatar"),
  logoutButton: document.querySelector("#logout"),
  personalStreak: document.querySelector("#personal-streak"),
  personalTopCategory: document.querySelector("#personal-top-category"),
  personalPersonality: document.querySelector("#personal-personality"),
  themeSelect: document.querySelector("#theme-select"),
  themeRadios: document.querySelectorAll("input[name=\"theme\"]"),
  changePasswordButton: document.querySelector("#change-password"),
  deleteAccountButton: document.querySelector("#delete-account"),
  passwordForm: document.querySelector("#password-form"),
  currentPassword: document.querySelector("#current-password"),
  newPassword: document.querySelector("#new-password"),
  confirmPassword: document.querySelector("#confirm-password"),
  savePassword: document.querySelector("#save-password"),
  cancelPassword: document.querySelector("#cancel-password"),
  passwordToggles: document.querySelectorAll(".toggle-password"),
  showPasswordToggles: document.querySelectorAll(".show-password-toggle"),
  authMessage: document.querySelector("#auth-message"),
  passwordMeter: document.querySelector("#password-meter"),
  passwordMeterLabel: document.querySelector("#password-meter-label"),
};

const quickAddDefaults = Array.from(elements.quickAddButtons || []).map((button) => ({
  amount: button.dataset.amount,
  note: button.dataset.note,
  label: button.textContent,
}));

const today = new Date();
const defaultMonth = today.toISOString().slice(0, 7);

const getBudgetMonth = () =>
  elements.budgetMonth?.value || elements.monthFilter?.value || defaultMonth;

const syncBudgetMonth = () => {
  if (!elements.budgetMonth || !elements.monthFilter) return;
  if (elements.budgetMonth.value !== elements.monthFilter.value) {
    elements.budgetMonth.value = elements.monthFilter.value;
  }
};

let state = {
  token: localStorage.getItem(TOKEN_KEY) || "",
  user: null,
  expenses: [],
  allExpenses: [],
  budget: 0,
  categoryBudgets: [],
  budgetHistory: [],
  recurringExpenses: [],
  incomeSources: [],
  incomeEntries: [],
  paymentMethods: [],
  defaultPaymentId: "",
  categories: [],
  budgetLimit: { limit: 5, used: 0, remaining: 5 },
  insightRange: "month",
};

let editingId = null;
let editingExpenseId = null;
let editingPaymentId = null;
let editingCategoryBudgetId = null;
let editingRecurringId = null;
let editingIncomeSourceId = null;

const authHeaders = (headers = {}) => {
  if (!state.token) return headers;
  return { ...headers, Authorization: `Bearer ${state.token}` };
};

const fetchJSON = async (url, options = {}) => {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: authHeaders(options.headers || {}),
    });
  } catch (error) {
    error.isNetwork = true;
    throw error;
  }
  if (response.status === 401) {
    clearAuth();
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!response.ok) {
    let message = "Request failed";
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      message = data?.error || JSON.stringify(data) || message;
    } else {
      message = await response.text();
    }
    const err = new Error(message || "Request failed");
    err.status = response.status;
    throw err;
  }
  if (response.status === 204) return null;
  return response.json();
};

const setAuthToken = (token) => {
  state.token = token || "";
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const applyTheme = (theme) => {
  const safeTheme = theme || "system";
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const resolved = safeTheme === "system" ? (prefersDark ? "dark" : "light") : safeTheme;
  document.body.classList.remove("theme-dark", "theme-light");
  document.body.classList.add(`theme-${resolved}`);
  document.body.dataset.theme = safeTheme;
  if (elements.themeSelect) elements.themeSelect.value = safeTheme;
  if (elements.themeRadios?.length) {
    elements.themeRadios.forEach((radio) => {
      radio.checked = radio.value === safeTheme;
    });
  }
};

const initTheme = () => {
  const saved = localStorage.getItem(THEME_KEY) || "system";
  applyTheme(saved);
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (media?.addEventListener) {
    media.addEventListener("change", () => {
      const current = localStorage.getItem(THEME_KEY) || "system";
      if (current === "system") applyTheme("system");
    });
  }
};

const updateUserUI = () => {
  if (!state.user) {
    elements.userName.textContent = "Guest";
    elements.userEmail.textContent = "Not signed in";
    elements.userAvatar.src = "https://placehold.co/64x64?text=RW";
    elements.profileAvatar.src = "https://placehold.co/120x120?text=RW";
    return;
  }

  elements.userName.textContent = state.user.name || "User";
  elements.userEmail.textContent = state.user.email || "";
  const avatarUrl = state.user.avatarUrl
    ? `${API_ORIGIN}${state.user.avatarUrl}`
    : "https://placehold.co/120x120?text=RW";
  elements.userAvatar.src = avatarUrl;
  elements.profileAvatar.src = avatarUrl;
  elements.profileName.value = state.user.name || "";
  elements.profileEmail.value = state.user.email || "";
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
  if (!elements.passwordMeter || !elements.passwordMeterLabel || !elements.registerPassword) return;
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

const showToast = (message, tone = "info") => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("error", "success");
  if (tone) toast.classList.add(tone);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
};

const activateTab = (tabName) => {
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
  elements.panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
};

const setAuthUI = (isLoggedIn) => {
  if (!isLoggedIn) {
    redirectToLogin();
    return;
  }
  elements.tabs.forEach((tab) => {
    tab.classList.remove("hidden");
    tab.disabled = false;
  });
  activateTab("dashboard");
};

const clearAuth = () => {
  setAuthToken("");
  state.user = null;
  updateUserUI();
  setAuthUI(false);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatCurrencyShort = (value) => formatCurrency(value).replace(".00", "");

const extractNoteTags = (note = "") => {
  const tags = note.match(/#[\w-]+/g) || [];
  return Array.from(new Set(tags));
};

const appendNoteToken = (token) => {
  if (!elements.note) return;
  const current = elements.note.value.trim();
  const separator = current ? (current.endsWith(" ") ? "" : " ") : "";
  elements.note.value = `${current}${separator}${token}`.trim();
  elements.note.focus({ preventScroll: true });
};

const calculateSavingsStreak = (expenses) => {
  if (!expenses.length) return 0;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const expenseDates = new Set(
    expenses.map((expense) => normalizeDateValue(expense.date)).filter(Boolean)
  );
  let streak = 0;
  while (streak < 90) {
    const check = new Date(todayDate);
    check.setDate(todayDate.getDate() - streak);
    const key = check.toISOString().slice(0, 10);
    if (expenseDates.has(key)) break;
    streak += 1;
  }
  return streak;
};

const getTotalForMonth = (expenses, month) =>
  expenses.reduce((sum, expense) => {
    const date = normalizeDateValue(expense.date);
    if (!date || !month) return sum;
    if (date.startsWith(month)) return sum + Number(expense.amount || 0);
    return sum;
  }, 0);

const loadBudgetLimit = async () => {
  const month = getBudgetMonth();
  try {
    const data = await fetchJSON(`${API_BASE}/budget-limit?month=${month}`);
    state.budgetLimit = data;
  } catch (error) {
    state.budgetLimit = { limit: 5, used: 0, remaining: 5 };
  }
  if (elements.budgetLimitNote && state.budgetLimit) {
    elements.budgetLimitNote.textContent = `You can edit your overall budget up to ${
      state.budgetLimit.limit
    } times per month. Remaining: ${state.budgetLimit.remaining}.`;
  }
};

const normalizeDateValue = (value) => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const formatDate = (value) => {
  const safeValue = normalizeDateValue(value);
  if (!safeValue) return "";
  const date = new Date(`${safeValue}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getMonthKey = (date) => date.toISOString().slice(0, 7);

const getPreviousMonthKey = (date) => {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthKey(prev);
};

const sumIncomeEntries = (entries = []) =>
  entries.reduce((sum, item) => sum + Number(item.amount || 0), 0);

const getIncomeTotalForMonth = async (month) => {
  if (elements.incomeMonthFilter && elements.incomeMonthFilter.value === month) {
    return sumIncomeEntries(state.incomeEntries || []);
  }
  const data = await fetchJSON(`${API_BASE}/income?month=${month}`);
  return sumIncomeEntries(data.items || []);
};

const getMonthLabel = (monthValue) => {
  if (!monthValue) return "";
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

const pad = (value) => String(value).padStart(2, "0");

const parseExpenseDate = (value) => {
  const safeValue = normalizeDateValue(value);
  const [year, month, day] = safeValue.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const startOfWeek = (date) => {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7; // Monday = 0
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day);
  return start;
};

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const formatShortDate = (date) =>
  date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const sumInRange = (expenses, start, end) =>
  expenses.reduce((sum, expense) => {
    const date = parseExpenseDate(expense.date);
    if (date >= start && date <= end) return sum + expense.amount;
    return sum;
  }, 0);

const getWeekPoints = (expenses, anchorDate) => {
  const start = startOfWeek(anchorDate);
  const totals = Array.from({ length: 7 }, () => 0);
  expenses.forEach((expense) => {
    const date = parseExpenseDate(expense.date);
    if (date < start || date > addDays(start, 6)) return;
    const index = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    if (index >= 0 && index < totals.length) totals[index] += expense.amount;
  });
  return totals.map((value, index) => {
    const labelDate = addDays(start, index);
    return {
      label: labelDate.toLocaleDateString("en-IN", { weekday: "short" }),
      value,
    };
  });
};

const getMonthPoints = (expenses, anchorDate) => {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const totals = Array.from({ length: daysInMonth }, () => 0);
  expenses.forEach((expense) => {
    const [y, m, d] = String(expense.date).split("-").map(Number);
    if (y !== year || m !== month) return;
    totals[d - 1] += expense.amount;
  });
  return totals.map((value, index) => ({
    label: pad(index + 1),
    value,
  }));
};

const getYearPoints = (expenses, anchorDate) => {
  const year = anchorDate.getFullYear();
  const totals = Array.from({ length: 12 }, () => 0);
  expenses.forEach((expense) => {
    const [y, m] = String(expense.date).split("-").map(Number);
    if (y !== year) return;
    totals[m - 1] += expense.amount;
  });
  return totals.map((value, index) => {
    const labelDate = new Date(year, index, 1);
    return {
      label: labelDate.toLocaleDateString("en-IN", { month: "short" }),
      value,
    };
  });
};

const getCategory = (id) => state.categories.find((category) => category.id === id);

const getPaymentById = (id) =>
  state.paymentMethods.find((method) => method.id === id);

const getCardType = (method) => {
  if (!method || method.type !== "Card") return null;
  const fromDetail = method.detail?.cardType;
  if (fromDetail) return String(fromDetail).toLowerCase();
  const label = String(method.label || "").toLowerCase();
  if (label.includes("credit")) return "credit";
  if (label.includes("debit")) return "debit";
  return "debit";
};

const isCreditCard = (method) => getCardType(method) === "credit";

const getPaymentDisplay = (method) => {
  if (!method) return "Payment";
  if (method.type === "UPI") {
    return `${method.label} • ${method.detail?.upiId || "add UPI ID"}`;
  }
  if (method.type === "Card") {
    const network = method.detail?.network || "Card";
    const last4 = method.detail?.last4 || "0000";
    const cardType = getCardType(method);
    const typeLabel = cardType === "credit" ? "Credit" : "Debit";
    return `${method.label} • ${typeLabel} • ${network} • •••• ${last4}`;
  }
  return method.label;
};

const buildCategoryOptions = (selectedId) =>
  state.categories
    .map(
      (category) =>
        `<option value="${category.id}" ${
          category.id === selectedId ? "selected" : ""
        }>${category.label}</option>`
    )
    .join("");

const buildPaymentOptions = (selectedId) => {
  if (!state.paymentMethods.length) {
    return '<option value="">Add a payment method</option>';
  }
  const grouped = state.paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) acc[method.type] = [];
    acc[method.type].push(method);
    return acc;
  }, {});
  return Object.entries(grouped)
    .map(
      ([type, methods]) => `
        <optgroup label="${type}">
          ${methods
            .map(
              (method) =>
                `<option value="${method.id}" ${
                  method.id === selectedId ? "selected" : ""
                }>${getPaymentDisplay(method)}</option>`
            )
            .join("")}
        </optgroup>
      `
    )
    .join("");
};

const resetForm = () => {
  elements.form.reset();
  elements.date.value = today.toISOString().slice(0, 10);
  elements.payment.value = state.defaultPaymentId || "";
  if (elements.receipt) elements.receipt.value = "";
  if (elements.receiptFileName) elements.receiptFileName.textContent = "No file chosen";
  editingId = null;
  elements.submitButton.textContent = "Add expense";
  elements.cancelEdit.classList.add("hidden");
};

const setEditing = (expense) => {
  elements.amount.value = expense.amount;
  elements.category.value = expense.categoryId;
  elements.date.value = expense.date;
  elements.payment.value = expense.paymentMethodId || state.defaultPaymentId || "";
  elements.note.value = expense.note || "";
  editingId = expense.id;
  elements.submitButton.textContent = "Update expense";
  elements.cancelEdit.classList.remove("hidden");
};

const getFilteredParams = () => {
  const monthValue = elements.monthFilter.value;
  const categoryValue = elements.categoryFilter.value;
  const searchValue = elements.searchFilter.value.trim();
  const sortValue = elements.sortFilter.value;

  const params = new URLSearchParams();
  if (monthValue) params.set("month", monthValue);
  if (categoryValue && categoryValue !== "all") params.set("category", categoryValue);
  if (searchValue) params.set("search", searchValue);
  if (sortValue) params.set("sort", sortValue);

  return params;
};

const updateSnapshot = async (filtered) => {
  const monthValue = elements.monthFilter.value || defaultMonth;
  const label = getMonthLabel(monthValue);
  elements.snapshotRange.textContent = label ? `for ${label}` : "";

  const baseExpenses = state.allExpenses?.length ? state.allExpenses : filtered;
  const monthExpenses = baseExpenses.filter((expense) =>
    normalizeDateValue(expense.date).startsWith(monthValue)
  );
  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const [year, month] = monthValue.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const avg = total / daysInMonth;
  const largest = monthExpenses.reduce((max, expense) => Math.max(max, expense.amount), 0);

  elements.totalSpent.textContent = formatCurrency(total);
  elements.avgSpent.textContent = formatCurrency(avg);
  elements.largestExpense.textContent = formatCurrency(largest);

  if (elements.remainingIncome) {
    try {
      const incomeTotal = await getIncomeTotalForMonth(monthValue);
      const nonCreditTotal = monthExpenses.reduce((sum, expense) => {
        const method = getPaymentById(expense.paymentMethodId);
        if (isCreditCard(method)) return sum;
        return sum + expense.amount;
      }, 0);
      const remaining = incomeTotal - nonCreditTotal;
      elements.remainingIncome.textContent = formatCurrency(remaining);
      elements.remainingIncome.classList.toggle("negative", remaining < 0);
      elements.remainingIncome.classList.toggle("positive", remaining >= 0);
    } catch (error) {
      elements.remainingIncome.textContent = "—";
    }
  }

  updateBudget(total);
  updateInsights(filtered);
};

const updateBudget = (total) => {
  const budget = state.budget || 0;
  if (!budget) {
    elements.budgetBar.style.width = "0%";
    elements.budgetNote.textContent = "Set a budget to track your runway.";
    return;
  }

  const ratio = Math.min(total / budget, 1.2);
  elements.budgetBar.style.width = `${ratio * 100}%`;
  if (total <= budget) {
    elements.budgetBar.style.background =
      "linear-gradient(90deg, var(--accent-2), var(--accent))";
    elements.budgetNote.textContent = `${formatCurrency(
      budget - total
    )} left this month.`;
  } else {
    elements.budgetBar.style.background = "linear-gradient(90deg, #ef4444, #f97316)";
    elements.budgetNote.textContent = `Over budget by ${formatCurrency(
      total - budget
    )}.`;
  }

  const activeMonth = getBudgetMonth();
};

const updateInsights = (filtered) => {
  elements.insightCount.textContent = filtered.length.toString();

  const totals = {};
  filtered.forEach((expense) => {
    totals[expense.categoryId] = (totals[expense.categoryId] || 0) + expense.amount;
  });

  const topCategoryId = Object.keys(totals).sort((a, b) => totals[b] - totals[a])[0];
  const topCategory = getCategory(Number(topCategoryId));
  elements.insightTop.textContent = topCategory ? topCategory.label : "—";

  const paymentTotals = {};
  let paymentSum = 0;
  filtered.forEach((expense) => {
    if (!expense.paymentMethodId) return;
    paymentTotals[expense.paymentMethodId] =
      (paymentTotals[expense.paymentMethodId] || 0) + expense.amount;
    paymentSum += expense.amount;
  });
  const topPaymentId = Object.keys(paymentTotals).sort(
    (a, b) => paymentTotals[b] - paymentTotals[a]
  )[0];
  const topPayment = getPaymentById(Number(topPaymentId));
  if (!topPayment || !paymentSum) {
    elements.insightPayment.textContent = "—";
  } else {
    const percent = Math.round((paymentTotals[topPaymentId] / paymentSum) * 100);
    const paymentLabel =
      topPayment.type === "UPI"
        ? "UPI"
        : topPayment.type === "Card"
          ? "Card"
          : topPayment.label;
    elements.insightPayment.textContent = `You spend ${percent}% via ${paymentLabel}`;
  }
};

const renderBarChart = (container, points, title) => {
  if (!container) return;
  container.innerHTML = "";
  container.setAttribute("aria-label", title || "Spending chart");

  if (!points.length) {
    container.innerHTML = '<p class="hint">No expenses to chart yet.</p>';
    if (elements.insightValue) {
      elements.insightValue.textContent = "No data for this period yet.";
    }
    return;
  }

  const max = Math.max(...points.map((point) => point.value), 0);
  points.forEach((point) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("tabindex", "0");
    bar.setAttribute("role", "button");
    bar.setAttribute("aria-label", `${point.label}: ${formatCurrency(point.value)}`);
    const height = max > 0 ? Math.max((point.value / max) * 100, point.value ? 6 : 0) : 0;
    bar.title = `${point.label}: ${formatCurrency(point.value)}`;
    bar.innerHTML = `
      <div class="bar-track">
        <div class="bar-fill" style="--bar-height: ${height}%"></div>
      </div>
      <span class="bar-label">${point.label}</span>
    `;
    const showValue = () => {
      if (elements.insightValue) {
        elements.insightValue.textContent = `${point.label}: ${formatCurrency(point.value)}`;
      }
    };
    bar.addEventListener("mouseenter", showValue);
    bar.addEventListener("focus", showValue);
    bar.addEventListener("click", showValue);
    bar.addEventListener("pointerdown", showValue);
    container.appendChild(bar);
  });
};

const renderInsights = () => {
  if (!elements.insightChart) return;
  const expenses = state.allExpenses.length ? state.allExpenses : state.expenses;
  const now = new Date();

  const weekStart = startOfWeek(now);
  const weekEnd = addDays(weekStart, 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);

  const weekTotal = sumInRange(expenses, weekStart, weekEnd);
  const monthTotal = sumInRange(expenses, monthStart, monthEnd);
  const yearTotal = sumInRange(expenses, yearStart, yearEnd);

  if (elements.insightWeekTotal) elements.insightWeekTotal.textContent = formatCurrency(weekTotal);
  if (elements.insightMonthTotal) elements.insightMonthTotal.textContent = formatCurrency(monthTotal);
  if (elements.insightYearTotal) elements.insightYearTotal.textContent = formatCurrency(yearTotal);

  if (elements.insightWeekLabel)
    elements.insightWeekLabel.textContent = `${formatShortDate(weekStart)} - ${formatShortDate(
      weekEnd
    )}`;
  if (elements.insightMonthLabel)
    elements.insightMonthLabel.textContent = monthStart.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  if (elements.insightYearLabel)
    elements.insightYearLabel.textContent = yearStart.getFullYear().toString();

  let points = [];
  let title = "";
  let subtitle = "";

  if (state.insightRange === "week") {
    points = getWeekPoints(expenses, now);
    title = "Spending this week";
    subtitle = `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`;
  } else if (state.insightRange === "year") {
    points = getYearPoints(expenses, now);
    title = "Spending this year";
    subtitle = now.getFullYear().toString();
  } else {
    points = getMonthPoints(expenses, now);
    title = "Spending this month";
    subtitle = monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  if (elements.insightTitle) elements.insightTitle.textContent = title;
  if (elements.insightSubtitle) elements.insightSubtitle.textContent = subtitle;
  renderBarChart(elements.insightChart, points, title);
  renderInsightFeed();
  renderInsightPie(expenses, now);
  renderInsightLine(expenses, now);
};

const renderInsightPie = (expenses, now) => {
  if (!elements.insightPie || !elements.insightPieLegend) return;
  const monthKey = getMonthKey(now);
  const totals = getMonthTotalsByCategory(expenses, monthKey);
  const totalAmount = Object.values(totals).reduce((sum, value) => sum + value, 0);
  if (!totalAmount) {
    elements.insightPie.style.background = "rgba(15, 23, 42, 0.08)";
    elements.insightPieLegend.innerHTML = '<p class="hint">No data yet.</p>';
    return;
  }

  const slices = Object.entries(totals)
    .map(([categoryId, amount]) => ({
      category: getCategory(Number(categoryId)),
      amount,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const colors = [
    "#0f766e",
    "#f59e0b",
    "#38bdf8",
    "#f97316",
    "#ec4899",
  ];
  let currentAngle = 0;
  const stops = slices.map((slice, index) => {
    const angle = (slice.amount / totalAmount) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return `${colors[index % colors.length]} ${start.toFixed(0)}deg ${end.toFixed(0)}deg`;
  });

  elements.insightPie.style.background = `conic-gradient(${stops.join(", ")})`;
  elements.insightPieLegend.innerHTML = slices
    .map((slice, index) => {
      const percent = ((slice.amount / totalAmount) * 100).toFixed(0);
      return `<div class="legend-item">
        <span class="legend-dot" style="background:${colors[index % colors.length]}"></span>
        <span>${slice.category?.label || "Category"} • ${percent}%</span>
      </div>`;
    })
    .join("");
};

const renderInsightLine = (expenses, now) => {
  if (!elements.insightLine) return;
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: getMonthKey(date), label: date.toLocaleDateString("en-IN", { month: "short" }) });
  }
  const totals = months.map((month) =>
    Object.values(getMonthTotalsByCategory(expenses, month.key)).reduce((sum, value) => sum + value, 0)
  );
  const max = Math.max(...totals, 1);
  const width = 240;
  const height = 140;
  const points = totals
    .map((value, index) => {
      const x = (index / (totals.length - 1 || 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  elements.insightLine.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="url(#lineGradient)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${points}"
      />
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0f766e" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
    <div class="line-labels">
      ${months
        .map(
          (month) => `<span class="bar-label">${month.label}</span>`
        )
        .join("")}
    </div>
  `;
};

const renderInsightFeed = () => {
  if (!elements.insightFeed) return;
  const expenses = state.allExpenses.length ? state.allExpenses : state.expenses;
  if (!expenses.length) {
    elements.insightFeed.innerHTML = '<p class="hint">Add expenses to see insights.</p>';
    return;
  }

  const now = new Date();
  const currentMonth = getMonthKey(now);
  const previousMonth = getPreviousMonthKey(now);

  const currentTotals = getMonthTotalsByCategory(expenses, currentMonth);
  const previousTotals = getMonthTotalsByCategory(expenses, previousMonth);

  const insights = [];

  const totalCurrent = Object.values(currentTotals).reduce((sum, val) => sum + val, 0);
  const totalPrevious = Object.values(previousTotals).reduce((sum, val) => sum + val, 0);
  if (totalPrevious > 0) {
    const diff = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
    if (Math.abs(diff) >= 10) {
      insights.push(
        `Overall spending is ${Math.abs(diff).toFixed(0)}% ${
          diff >= 0 ? "higher" : "lower"
        } than last month.`
      );
    }
  }

  const categoryChanges = Object.keys(currentTotals)
    .map((categoryId) => {
      const current = currentTotals[categoryId] || 0;
      const previous = previousTotals[categoryId] || 0;
      const change = previous ? ((current - previous) / previous) * 100 : null;
      return { categoryId: Number(categoryId), current, previous, change };
    })
    .filter((item) => item.current > 0);

  categoryChanges
    .filter((item) => item.previous > 0 && Math.abs(item.change) >= 20)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 3)
    .forEach((item) => {
      const category = getCategory(item.categoryId);
      insights.push(
        `${category?.label || "Category"} spending is ${Math.abs(item.change).toFixed(0)}% ${
          item.change >= 0 ? "higher" : "lower"
        } than last month.`
      );
    });

  if (!insights.length) {
    elements.insightFeed.innerHTML = '<p class="hint">No big changes detected yet.</p>';
    return;
  }

  elements.insightFeed.innerHTML = insights
    .map((text) => `<div class="insight-message">${text}</div>`)
    .join("");
};

const setInsightRange = (range) => {
  state.insightRange = range;
  elements.insightRangeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.range === range);
  });
  renderInsights();
};

const renderBreakdown = (filtered) => {
  const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  elements.breakdownList.innerHTML = "";

  if (!filtered.length) {
    elements.breakdownList.innerHTML =
      '<p class="hint">No expenses to analyze yet.</p>';
    return;
  }

  state.categories.forEach((category) => {
    const categoryTotal = filtered
      .filter((expense) => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    if (!categoryTotal) return;

    const item = document.createElement("div");
    item.className = "breakdown-item";
    const percent = total ? Math.round((categoryTotal / total) * 100) : 0;

    item.innerHTML = `
      <span>${category.label}</span>
      <div class="breakdown-bar">
        <div class="breakdown-fill" style="width:${percent}%; background:${category.color}"></div>
      </div>
      <strong>${formatCurrency(categoryTotal)}</strong>
    `;
    elements.breakdownList.appendChild(item);
  });
};

const applyScrollLimit = (container, maxItems = 3) => {
  if (!container) return;
  if (!container.getClientRects().length) {
    container.dataset.scrollPending = "1";
    return;
  }
  container.dataset.scrollPending = "0";
  const items = Array.from(container.children).filter((node) => node.nodeType === 1);
  if (!items.length || items.length <= maxItems) {
    container.style.maxHeight = "none";
    container.style.overflowY = "visible";
    container.style.paddingRight = "0";
    return;
  }
  const visibleItems = items.slice(0, maxItems);
  const styles = window.getComputedStyle(container);
  const gapValue = styles.rowGap || styles.gap || "0";
  const gap = Number.parseFloat(gapValue) || 0;
  const totalHeight =
    visibleItems.reduce((sum, item) => sum + item.getBoundingClientRect().height, 0) +
    gap * Math.max(visibleItems.length - 1, 0);
  container.style.maxHeight = `${Math.ceil(totalHeight) + 6}px`;
  container.style.overflowY = "auto";
  container.style.paddingRight = "12px";
};

const getScrollContainers = () => [
  elements.expenseList,
  elements.paymentList,
  elements.categoryList,
  elements.categoryBudgetList,
  elements.budgetHistoryList,
  elements.incomeSourceList,
  elements.incomeList,
  elements.recurringList,
  elements.notificationList,
];

const refreshScrollLimits = () => {
  getScrollContainers().forEach((container) => applyScrollLimit(container));
};

const updateQuickAddButtons = () => {
  if (!elements.quickAddButtons?.length) return;
  const expenses = state.allExpenses?.length ? state.allExpenses : state.expenses;
  if (!expenses?.length) {
    quickAddDefaults.forEach((item, index) => {
      const button = elements.quickAddButtons[index];
      if (!button) return;
      button.dataset.amount = item.amount;
      button.dataset.note = item.note;
      button.textContent = item.label;
    });
    return;
  }

  const grouped = new Map();
  expenses.forEach((expense) => {
    const category = getCategory(expense.categoryId);
    const baseLabel = (expense.note || "").trim();
    const label = baseLabel || category?.label || "Expense";
    const dateValue = normalizeDateValue(expense.date);
    const timestamp = dateValue ? new Date(`${dateValue}T00:00:00`).getTime() : 0;
    const entry = grouped.get(label) || {
      label,
      count: 0,
      total: 0,
      latestAmount: 0,
      latestDate: 0,
    };
    entry.count += 1;
    entry.total += Number(expense.amount) || 0;
    if (timestamp >= entry.latestDate) {
      entry.latestDate = timestamp;
      entry.latestAmount = Number(expense.amount) || entry.latestAmount;
    }
    grouped.set(label, entry);
  });

  const entries = Array.from(grouped.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.latestDate - a.latestDate;
  });

  elements.quickAddButtons.forEach((button, index) => {
    const entry = entries[index];
    if (!entry) return;
    const amount = entry.latestAmount || Math.round((entry.total / entry.count) * 100) / 100;
    button.dataset.amount = String(amount);
    button.dataset.note = entry.label;
    button.textContent = `${formatCurrencyShort(amount)} ${entry.label}`;
  });
};

const renderList = (filtered) => {
  elements.expenseList.innerHTML = "";
  if (!filtered.length) {
    elements.emptyState.classList.remove("hidden");
    applyScrollLimit(elements.expenseList);
    return;
  }
  elements.emptyState.classList.add("hidden");

  filtered.forEach((expense) => {
    const category = getCategory(expense.categoryId);
  const paymentMethod = getPaymentById(expense.paymentMethodId);
  const paymentLabel = paymentMethod ? getPaymentDisplay(paymentMethod) : "Payment";
    const isCredit = isCreditCard(paymentMethod);
    const receiptUrl = expense.receiptUrl ? `${API_ORIGIN}${expense.receiptUrl}` : "";
    const receiptName = expense.receiptName || "receipt";
    const tags = extractNoteTags(expense.note || "");
    const tagsMarkup = tags.length
      ? `<div class="note-tags">${tags
          .map((tag) => `<span class="note-tag">${tag}</span>`)
          .join("")}</div>`
      : "";
    const receiptMarkup = receiptUrl
      ? `
        <div class="receipt-links">
          <a href="${receiptUrl}" target="_blank" rel="noopener">View receipt</a>
          <a href="${receiptUrl}" download="${receiptName}">Download</a>
        </div>
      `
      : "";

    const item = document.createElement("div");
    const isEditing = editingExpenseId === expense.id;
    item.className = `expense-item${isEditing ? " editing" : ""}`;
    if (isEditing) {
      item.innerHTML = `
        <div class="expense-edit-grid">
          <label>
            <span class="hint small">Amount (₹)</span>
            <input data-field="amount" type="number" min="0" step="0.01" value="${expense.amount}" />
          </label>
          <label>
            <span class="hint small">Category</span>
            <select data-field="category">${buildCategoryOptions(expense.categoryId)}</select>
          </label>
          <label>
            <span class="hint small">Date</span>
            <input data-field="date" type="date" value="${normalizeDateValue(expense.date)}" />
          </label>
          <label>
            <span class="hint small">Payment method</span>
            <select data-field="payment">${buildPaymentOptions(expense.paymentMethodId)}</select>
          </label>
          <label class="span-all">
            <span class="hint small">Note</span>
            <input data-field="note" type="text" value="${expense.note || ""}" />
          </label>
          ${receiptMarkup}
        </div>
        <div class="form-actions">
          <button class="primary" data-action="save" data-id="${expense.id}">Save</button>
          <button class="ghost" data-action="cancel" data-id="${expense.id}">Cancel</button>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="expense-meta">
          <span class="tag">
          <span class="tag-dot" style="background:${category?.color || "#94a3b8"}"></span>
          ${category?.label || "Other"}
        </span>
        <div class="expense-title">${expense.note || "Untitled expense"}</div>
        <div class="expense-details">${formatDate(expense.date)} • ${paymentLabel}</div>
        ${tagsMarkup}
        ${receiptMarkup}
      </div>
      <div class="expense-actions">
        <span class="amount${isCredit ? " credit" : ""}">${formatCurrency(expense.amount)}</span>
        <button class="ghost" data-action="edit" data-id="${expense.id}">Edit</button>
        <button class="ghost danger" data-action="delete" data-id="${expense.id}">Delete</button>
      </div>
      `;
    }
    elements.expenseList.appendChild(item);
  });
  applyScrollLimit(elements.expenseList);
};

const renderPaymentList = () => {
  if (!elements.paymentList) return;
  elements.paymentList.innerHTML = "";

  state.paymentMethods.forEach((method) => {
    const item = document.createElement("div");
    item.className = `method-item${editingPaymentId === method.id ? " editing" : ""}`;
    const isDefault = method.isDefault;

    if (editingPaymentId === method.id) {
      const detail = method.detail || {};
      const upiInput =
        method.type === "UPI"
          ? `<input class="method-input" data-field="upiId" type="text" placeholder="name@bank" value="${
              detail.upiId || ""
            }" />`
          : "";
      const cardInputs =
        method.type === "Card"
          ? `
            <select class="method-input" data-field="cardType">
              ${["debit", "credit"]
                .map(
                  (type) =>
                    `<option value="${type}" ${
                      getCardType(method) === type ? "selected" : ""
                    }>${type === "credit" ? "Credit card" : "Debit card"}</option>`
                )
                .join("")}
            </select>
            <select class="method-input" data-field="network">
              ${["Visa", "Mastercard", "RuPay", "Amex"]
                .map(
                  (network) =>
                    `<option value="${network}" ${
                      detail.network === network ? "selected" : ""
                    }>${network}</option>`
                )
                .join("")}
            </select>
            <input class="method-input" data-field="last4" type="text" maxlength="4" placeholder="Last 4 digits" value="${
              detail.last4 || ""
            }" />
          `
          : "";

      item.innerHTML = `
        <div class="method-meta">
          <div class="method-edit-grid">
            <label>
              <span class="hint small">Label</span>
              <input class="method-input" data-field="label" type="text" value="${method.label}" />
            </label>
            ${upiInput}
            ${cardInputs}
          </div>
        </div>
        <div class="form-actions">
          <button class="primary" data-action="save" data-id="${method.id}">Save</button>
          <button class="ghost" data-action="cancel" data-id="${method.id}">Cancel</button>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="method-meta">
          <strong>${getPaymentDisplay(method)}</strong>
          <span class="badge-lite">${method.type}${isDefault ? " • Default" : ""}</span>
        </div>
        <div class="form-actions">
          <button class="ghost" data-action="default" data-id="${method.id}">
            ${isDefault ? "Default" : "Make default"}
          </button>
          <button class="ghost" data-action="edit" data-id="${method.id}">Edit</button>
          <button class="ghost danger" data-action="delete" data-id="${method.id}">Remove</button>
        </div>
      `;
    }

    elements.paymentList.appendChild(item);
  });
  applyScrollLimit(elements.paymentList);
};

const renderCategoryList = () => {
  elements.categoryList.innerHTML = "";

  state.categories.forEach((category) => {
    const item = document.createElement("div");
    item.className = "category-item";
    item.innerHTML = `
      <div class="category-meta">
        <strong>${category.label}</strong>
        <span class="badge-lite" style="border-color:${category.color}">
          <span class="tag-dot" style="background:${category.color}"></span>
          ${category.locked ? "Default" : "Custom"}
        </span>
      </div>
      <div class="form-actions">
        <button class="ghost" data-action="remove" data-id="${category.id}" ${
          category.locked ? "disabled" : ""
        }>
          ${category.locked ? "Locked" : "Remove"}
        </button>
      </div>
    `;
    elements.categoryList.appendChild(item);
  });
  applyScrollLimit(elements.categoryList);
};

const getPeriodLabel = (period) => (period === "weekly" ? "Weekly" : "Monthly");

const getMonthTotalsByCategory = (expenses, monthKey) => {
  const totals = {};
  expenses.forEach((expense) => {
    if (getMonthKey(parseExpenseDate(expense.date)) !== monthKey) return;
    totals[expense.categoryId] = (totals[expense.categoryId] || 0) + expense.amount;
  });
  return totals;
};

const getWeekTotalsByCategory = (expenses, weekStartDate) => {
  const totals = {};
  const weekEnd = addDays(weekStartDate, 6);
  expenses.forEach((expense) => {
    const date = parseExpenseDate(expense.date);
    if (date < weekStartDate || date > weekEnd) return;
    totals[expense.categoryId] = (totals[expense.categoryId] || 0) + expense.amount;
  });
  return totals;
};

const renderCategoryBudgets = () => {
  if (!elements.categoryBudgetList) return;
  elements.categoryBudgetList.innerHTML = "";
  if (!state.categoryBudgets.length) {
    elements.categoryBudgetList.innerHTML =
      '<p class="hint">No category budgets set yet.</p>';
    applyScrollLimit(elements.categoryBudgetList);
    return;
  }

  const now = new Date();
  const monthKey = getMonthKey(now);
  const weekStart = startOfWeek(now);
  const monthTotals = getMonthTotalsByCategory(state.allExpenses, monthKey);
  const weekTotals = getWeekTotalsByCategory(state.allExpenses, weekStart);

  state.categoryBudgets.forEach((budget) => {
    const category = getCategory(Number(budget.categoryId));
    const spent =
      budget.period === "weekly"
        ? weekTotals[budget.categoryId] || 0
        : monthTotals[budget.categoryId] || 0;
    const percent = budget.amount
      ? Math.min((spent / budget.amount) * 100, 120)
      : 0;

    const item = document.createElement("div");
    item.className = `budget-item${editingCategoryBudgetId === budget.id ? " editing" : ""}`;

    if (editingCategoryBudgetId === budget.id) {
      item.innerHTML = `
        <div class="method-edit-grid">
          <label>
            <span class="hint small">Amount</span>
            <input class="method-input" data-field="amount" type="number" min="0" step="0.01" value="${budget.amount}" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary" data-action="save" data-id="${budget.id}">Save</button>
          <button class="ghost" data-action="cancel" data-id="${budget.id}">Cancel</button>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="budget-meta">
          <strong>${category?.label || "Category"} • ${getPeriodLabel(budget.period)}</strong>
          <span class="hint">Budget ${formatCurrency(budget.amount)} · Spent ${formatCurrency(
        spent
      )}</span>
          <div class="budget-progress">
            <div class="budget-bar" style="width:${percent}%;"></div>
          </div>
        </div>
        <div class="form-actions">
          <button class="ghost" data-action="edit" data-id="${budget.id}">Edit</button>
          <button class="ghost danger" data-action="delete" data-id="${budget.id}">Delete</button>
        </div>
      `;
    }

    elements.categoryBudgetList.appendChild(item);
  });
  applyScrollLimit(elements.categoryBudgetList);
};

const renderBudgetAlerts = () => {
  const alerts = [];
  const now = new Date();
  const monthKey = getMonthKey(now);
  const weekStart = startOfWeek(now);
  const monthTotalsAll = getMonthTotalsByCategory(state.allExpenses, monthKey);
  const monthTotal = Object.values(monthTotalsAll).reduce((sum, value) => sum + value, 0);
  if (state.budget > 0) {
    const ratio = monthTotal / state.budget;
    if (ratio >= 1) {
      alerts.push({
        level: 2,
        ratio,
        text: `Overall monthly budget exceeded by ${formatCurrency(monthTotal - state.budget)}.`,
      });
    } else if (ratio >= 0.8) {
      alerts.push({
        level: 1,
        ratio,
        text: `You’ve used ${Math.round(ratio * 100)}% of your monthly budget.`,
      });
    }
  }

  const monthTotals = getMonthTotalsByCategory(state.allExpenses, monthKey);
  const weekTotals = getWeekTotalsByCategory(state.allExpenses, weekStart);
  state.categoryBudgets.forEach((budget) => {
    const spent =
      budget.period === "weekly"
        ? weekTotals[budget.categoryId] || 0
        : monthTotals[budget.categoryId] || 0;
    if (!budget.amount) return;
    const ratio = spent / budget.amount;
    const category = getCategory(Number(budget.categoryId));
    if (ratio >= 1) {
      alerts.push({
        level: 2,
        ratio,
        text: `${category?.label || "Category"} budget exceeded by ${formatCurrency(
          spent - budget.amount
        )}.`,
      });
    } else if (ratio >= 0.8) {
      alerts.push({
        level: 1,
        ratio,
        text: `${category?.label || "Category"} budget is ${Math.round(ratio * 100)}% used.`,
      });
    }
  });

  if (elements.notificationCount) {
    elements.notificationCount.textContent = String(alerts.length);
    elements.notificationCount.classList.toggle("hidden", alerts.length === 0);
  }

  if (!alerts.length) {
    if (elements.notificationList) {
      elements.notificationList.innerHTML = '<p class="hint">No alerts right now.</p>';
      applyScrollLimit(elements.notificationList);
    }
    return;
  }

  alerts.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.ratio - a.ratio;
  });

  if (elements.notificationList) {
    elements.notificationList.innerHTML = alerts
      .map((alert) => `<div class="alert-item">${alert.text}</div>`)
      .join("");
    applyScrollLimit(elements.notificationList);
  }
};

const renderBudgetHistory = () => {
  if (!elements.budgetHistoryList) return;
  if (!state.budgetHistory.length) {
    elements.budgetHistoryList.innerHTML =
      '<p class="hint">Budget history will appear here.</p>';
    applyScrollLimit(elements.budgetHistoryList);
    return;
  }
  elements.budgetHistoryList.innerHTML = state.budgetHistory
    .map((item) => {
      const category = item.categoryId ? getCategory(Number(item.categoryId)) : null;
      const label = item.scope === "overall" ? "Overall budget" : category?.label || "Category";
      const period = getPeriodLabel(item.period);
      const dateLabel = item.changedAt
        ? formatDate(normalizeDateValue(item.changedAt))
        : item.month || "";
      return `<div class="history-item">
        <strong>${label} • ${period}</strong>
        <div>Budget updated from ${formatCurrency(item.previousAmount)} to ${formatCurrency(
        item.newAmount
      )}.</div>
        <span class="hint">Date - ${dateLabel}</span>
      </div>`;
    })
    .join("");
  applyScrollLimit(elements.budgetHistoryList);
};

const renderPersonalTouch = () => {
  if (!elements.personalStreak && !elements.personalTopCategory && !elements.personalPersonality)
    return;
  const allExpenses = state.allExpenses || [];
  const streak = calculateSavingsStreak(allExpenses);
  if (elements.personalStreak) {
    elements.personalStreak.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  }

  const monthKey = getMonthKey(new Date());
  const monthTotals = getMonthTotalsByCategory(allExpenses, monthKey);
  const topEntry = Object.entries(monthTotals).sort((a, b) => b[1] - a[1])[0];
  if (elements.personalTopCategory) {
    const topCategory = topEntry ? getCategory(Number(topEntry[0]))?.label : "—";
    elements.personalTopCategory.textContent = topCategory || "—";
  }

  if (elements.personalPersonality) {
    const monthTotal = Object.values(monthTotals).reduce((sum, value) => sum + value, 0);
    const budget = state.budget || 0;
    let personality = "Balanced";
    if (budget > 0) {
      const ratio = monthTotal / budget;
      if (ratio < 0.7) personality = "Saver";
      else if (ratio > 1) personality = "Spender";
    }
    elements.personalPersonality.textContent = personality;
  }
};

const populateIncomeSources = () => {
  if (!elements.incomeSourceSelect) return;
  elements.incomeSourceSelect.innerHTML = "";
  state.incomeSources.forEach((source) => {
    const option = document.createElement("option");
    option.value = source.id;
    option.textContent = source.name;
    elements.incomeSourceSelect.appendChild(option);
  });
};

const renderIncomeSources = () => {
  if (!elements.incomeSourceList) return;
  elements.incomeSourceList.innerHTML = "";
  if (!state.incomeSources.length) {
    elements.incomeSourceList.innerHTML =
      '<p class="hint">Add your first income source.</p>';
    applyScrollLimit(elements.incomeSourceList);
    return;
  }
  state.incomeSources.forEach((source) => {
    const item = document.createElement("div");
    item.className = `method-item${editingIncomeSourceId === source.id ? " editing" : ""}`;
    if (editingIncomeSourceId === source.id) {
      item.innerHTML = `
        <div class="method-edit-grid">
          <label>
            <span class="hint small">Name</span>
            <input class="method-input" data-field="name" type="text" value="${source.name}" />
          </label>
          <label>
            <span class="hint small">Type</span>
            <input class="method-input" data-field="type" type="text" value="${source.type || ""}" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary" data-action="save" data-id="${source.id}">Save</button>
          <button class="ghost" data-action="cancel" data-id="${source.id}">Cancel</button>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="method-meta">
          <strong>${source.name}</strong>
          <span class="badge-lite">${source.type || "Income source"}</span>
        </div>
        <div class="form-actions">
          <button class="ghost" data-action="edit" data-id="${source.id}">Edit</button>
          <button class="ghost danger" data-action="delete" data-id="${source.id}">Remove</button>
        </div>
      `;
    }
    elements.incomeSourceList.appendChild(item);
  });
  applyScrollLimit(elements.incomeSourceList);
};

const renderIncomeEntries = () => {
  if (!elements.incomeList) return;
  elements.incomeList.innerHTML = "";
  const total = state.incomeEntries.reduce((sum, item) => sum + Number(item.amount), 0);
  if (elements.incomeTotal) elements.incomeTotal.textContent = formatCurrency(total);

  if (!state.incomeEntries.length) {
    elements.incomeList.innerHTML = '<p class="hint">No income entries for this month.</p>';
    applyScrollLimit(elements.incomeList);
    return;
  }

  state.incomeEntries.forEach((entry) => {
    const source = state.incomeSources.find((item) => item.id === entry.sourceId);
    const item = document.createElement("div");
    item.className = "expense-item";
    item.innerHTML = `
      <div class="expense-meta">
        <span class="tag">
          <span class="tag-dot" style="background:#22c55e"></span>
          ${source?.name || "Income"}
        </span>
        <div class="expense-title">${entry.note || "Income entry"}</div>
        <div class="expense-details">${formatDate(entry.date)} • ${source?.type || "Source"}</div>
      </div>
      <div class="expense-actions">
        <span class="amount">${formatCurrency(entry.amount)}</span>
        <button class="ghost danger" data-action="delete" data-id="${entry.id}">Delete</button>
      </div>
    `;
    elements.incomeList.appendChild(item);
  });
  applyScrollLimit(elements.incomeList);
};

const renderRecurringList = () => {
  if (!elements.recurringList) return;
  elements.recurringList.innerHTML = "";
  if (!state.recurringExpenses.length) {
    elements.recurringList.innerHTML =
      '<p class="hint">No recurring expenses yet.</p>';
    applyScrollLimit(elements.recurringList);
    return;
  }
  state.recurringExpenses.forEach((recurring) => {
    const category = getCategory(Number(recurring.categoryId));
    const payment = getPaymentById(Number(recurring.paymentMethodId));
    const item = document.createElement("div");
    item.className = `method-item${editingRecurringId === recurring.id ? " editing" : ""}`;
    if (editingRecurringId === recurring.id) {
      item.innerHTML = `
        <div class="method-edit-grid">
          <label>
            <span class="hint small">Label</span>
            <input class="method-input" data-field="label" type="text" value="${recurring.label}" />
          </label>
          <label>
            <span class="hint small">Amount</span>
            <input class="method-input" data-field="amount" type="number" min="0" step="0.01" value="${recurring.amount}" />
          </label>
          <label>
            <span class="hint small">Day of month</span>
            <input class="method-input" data-field="day" type="number" min="1" max="31" value="${recurring.dayOfMonth}" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary" data-action="save" data-id="${recurring.id}">Save</button>
          <button class="ghost" data-action="cancel" data-id="${recurring.id}">Cancel</button>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="method-meta">
          <strong>${recurring.label} • ${formatCurrency(recurring.amount)}</strong>
          <span class="badge-lite">Day ${recurring.dayOfMonth} • ${category?.label || "Category"} • ${
        payment ? getPaymentDisplay(payment) : "Payment"
      }</span>
        </div>
        <div class="form-actions">
          <button class="ghost" data-action="edit" data-id="${recurring.id}">Edit</button>
          <button class="ghost danger" data-action="delete" data-id="${recurring.id}">Remove</button>
        </div>
      `;
    }
    elements.recurringList.appendChild(item);
  });
  applyScrollLimit(elements.recurringList);
};

const render = () => {
  updateSnapshot(state.expenses);
  renderBreakdown(state.expenses);
  renderList(state.expenses);
  renderPaymentList();
  renderCategoryList();
  renderInsights();
  renderCategoryBudgets();
  renderBudgetAlerts();
  renderPersonalTouch();
  refreshScrollLimits();
};

const populateCategories = () => {
  elements.category.innerHTML = "";
  elements.categoryFilter.innerHTML = '<option value="all">All categories</option>';
  if (elements.categoryBudgetCategory) elements.categoryBudgetCategory.innerHTML = "";
  if (elements.recurringCategory) elements.recurringCategory.innerHTML = "";

  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    elements.category.appendChild(option);

    const filterOption = option.cloneNode(true);
    elements.categoryFilter.appendChild(filterOption);

    if (elements.categoryBudgetCategory) {
      const budgetOption = option.cloneNode(true);
      elements.categoryBudgetCategory.appendChild(budgetOption);
    }

    if (elements.recurringCategory) {
      const recurringOption = option.cloneNode(true);
      elements.recurringCategory.appendChild(recurringOption);
    }
  });
};

const populatePayments = () => {
  elements.payment.innerHTML = "";
  if (elements.recurringPayment) elements.recurringPayment.innerHTML = "";
  const grouped = state.paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) acc[method.type] = [];
    acc[method.type].push(method);
    return acc;
  }, {});

  Object.keys(grouped).forEach((type) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = type;
    grouped[type].forEach((method) => {
      const option = document.createElement("option");
      option.value = method.id;
      option.textContent = getPaymentDisplay(method);
      optgroup.appendChild(option);
    });
    elements.payment.appendChild(optgroup);

    if (elements.recurringPayment) {
      elements.recurringPayment.appendChild(optgroup.cloneNode(true));
    }
  });

  elements.payment.value = state.defaultPaymentId || state.paymentMethods[0]?.id || "";
  if (elements.recurringPayment)
    elements.recurringPayment.value =
      state.defaultPaymentId || state.paymentMethods[0]?.id || "";
};

const loadCategories = async () => {
  const data = await fetchJSON(`${API_BASE}/categories`);
  state.categories = (data.items || []).map((item) => ({
    id: Number(item.id),
    label: item.label,
    color: item.color,
    locked: Boolean(item.locked),
  }));
  populateCategories();
};

const loadPayments = async () => {
  const data = await fetchJSON(`${API_BASE}/payment-methods`);
  state.paymentMethods = (data.items || []).map((method) => {
    if (method.type !== "Card") return method;
    const cardType = getCardType(method);
    const detail = { ...(method.detail || {}), cardType: cardType || "debit" };
    return { ...method, detail };
  });
  const defaultMethod = state.paymentMethods.find((method) => method.isDefault);
  state.defaultPaymentId = defaultMethod ? defaultMethod.id : state.paymentMethods[0]?.id || "";
  editingPaymentId = null;
  populatePayments();
  renderPaymentList();
};

const loadCategoryBudgets = async () => {
  const data = await fetchJSON(`${API_BASE}/category-budgets`);
  state.categoryBudgets = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    categoryId: Number(item.categoryId),
    amount: Number(item.amount),
  }));
  editingCategoryBudgetId = null;
  renderCategoryBudgets();
  renderBudgetAlerts();
};

const loadBudgetHistory = async () => {
  const data = await fetchJSON(`${API_BASE}/budget-history?limit=12`);
  state.budgetHistory = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    categoryId: item.categoryId ? Number(item.categoryId) : null,
    previousAmount: Number(item.previousAmount),
    newAmount: Number(item.newAmount),
  }));
  renderBudgetHistory();
};

const loadRecurringExpenses = async () => {
  const data = await fetchJSON(`${API_BASE}/recurring`);
  state.recurringExpenses = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    amount: Number(item.amount),
    categoryId: Number(item.categoryId),
    paymentMethodId: item.paymentMethodId ? Number(item.paymentMethodId) : null,
    dayOfMonth: Number(item.dayOfMonth),
  }));
  editingRecurringId = null;
  renderRecurringList();
};

const loadIncomeSources = async () => {
  const data = await fetchJSON(`${API_BASE}/income-sources`);
  state.incomeSources = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
  }));
  editingIncomeSourceId = null;
  populateIncomeSources();
  renderIncomeSources();
};

const loadIncomeEntries = async () => {
  const month = elements.incomeMonthFilter?.value || defaultMonth;
  const data = await fetchJSON(`${API_BASE}/income?month=${month}`);
  state.incomeEntries = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    amount: Number(item.amount),
    sourceId: Number(item.sourceId),
    date: normalizeDateValue(item.date),
  }));
  renderIncomeEntries();
};

const loadBudget = async () => {
  const month = getBudgetMonth();
  const data = await fetchJSON(`${API_BASE}/budget?month=${month}`);
  state.budget = Number(data.amount) || 0;
  if (elements.budgetInput) elements.budgetInput.value = state.budget || "";
  await loadBudgetLimit();
};

const loadExpenses = async () => {
  const params = getFilteredParams();
  const data = await fetchJSON(`${API_BASE}/expenses?${params.toString()}`);
  state.expenses = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    amount: Number(item.amount),
    categoryId: Number(item.categoryId),
    paymentMethodId: item.paymentMethodId ? Number(item.paymentMethodId) : null,
    date: normalizeDateValue(item.date),
  }));
  render();
};

const loadAllExpenses = async () => {
  const data = await fetchJSON(`${API_BASE}/expenses?all=1&sort=newest`);
  state.allExpenses = (data.items || []).map((item) => ({
    ...item,
    id: Number(item.id),
    amount: Number(item.amount),
    categoryId: Number(item.categoryId),
    paymentMethodId: item.paymentMethodId ? Number(item.paymentMethodId) : null,
    date: normalizeDateValue(item.date),
  }));
  updateQuickAddButtons();
  renderInsights();
  renderCategoryBudgets();
  renderBudgetAlerts();
  renderPersonalTouch();
};

const refreshExpenses = async () => {
  await Promise.all([loadExpenses(), loadAllExpenses()]);
};

const refreshAll = async () => {
  await loadCategories();
  await loadPayments();
  await Promise.all([loadCategoryBudgets(), loadRecurringExpenses(), loadIncomeSources()]);
  await loadBudget();
  await refreshExpenses();
  await Promise.all([loadBudgetHistory(), loadIncomeEntries()]);
  resetForm();
};

const uploadReceipt = async (expenseId) => {
  const file = elements.receipt?.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("receipt", file);
  await fetchJSON(`${API_BASE}/expenses/${expenseId}/receipt`, {
    method: "POST",
    body: formData,
  });
  if (elements.receipt) elements.receipt.value = "";
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const amount = Number(elements.amount.value);
  if (!amount || amount <= 0) return;
  const paymentValue = Number(elements.payment.value);
  if (!paymentValue) {
    alert("Please select a payment method.");
    return;
  }

  const payload = {
    amount,
    categoryId: Number(elements.category.value),
    date: elements.date.value,
    paymentMethodId: paymentValue,
    note: elements.note.value.trim(),
  };

  let expenseId = editingId;

  if (editingId) {
    await fetchJSON(`${API_BASE}/expenses/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } else {
    const result = await fetchJSON(`${API_BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expenseId = result.id;
  }

  if (expenseId) {
    await uploadReceipt(expenseId);
  }

  resetForm();
  await refreshExpenses();
};

const handleListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  const expense = state.expenses.find((item) => item.id === id);
  if (button.dataset.action === "edit" && expense) {
    editingExpenseId = id;
    renderList(state.expenses);
    requestAnimationFrame(refreshScrollLimits);
    return;
  }
  if (button.dataset.action === "cancel") {
    editingExpenseId = null;
    renderList(state.expenses);
    requestAnimationFrame(refreshScrollLimits);
    return;
  }
  if (button.dataset.action === "save") {
    const row = button.closest(".expense-item");
    if (!row) return;
    const amount = Number(row.querySelector("[data-field=\"amount\"]")?.value);
    const categoryId = Number(row.querySelector("[data-field=\"category\"]")?.value);
    const date = row.querySelector("[data-field=\"date\"]")?.value;
    const paymentMethodId = Number(row.querySelector("[data-field=\"payment\"]")?.value);
    const note = row.querySelector("[data-field=\"note\"]")?.value?.trim() || "";
    if (!amount || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    if (!categoryId || !date || !paymentMethodId) {
      alert("Please select category, date, and payment method.");
      return;
    }
    await fetchJSON(`${API_BASE}/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, categoryId, date, paymentMethodId, note }),
    });
    editingExpenseId = null;
    await refreshExpenses();
    return;
  }
  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/expenses/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await refreshExpenses();
  }
};

const handleBudgetSave = async () => {
  const value = Number(elements.budgetInput.value);
  const activeMonth = getBudgetMonth();
  let incomeTotal = 0;
  try {
    incomeTotal = await getIncomeTotalForMonth(activeMonth);
  } catch (error) {
    alert("Unable to verify income for this month. Please try again.");
    return;
  }
  if (incomeTotal <= 0) {
    showToast("Please add income for this month before setting a budget.", "error");
    return;
  }
  if (state.budgetLimit?.remaining === 0 && value !== state.budget) {
    showToast(
      "You have reached the 5 changes limit for this month’s budget.",
      "error"
    );
    return;
  }
  if (value >= incomeTotal) {
    showToast(
      `Monthly budget must be less than your total income of ${formatCurrency(
        incomeTotal
      )} for this month.`,
      "error"
    );
    return;
  }
  const previous = state.budget || 0;
  state.budget = value > 0 ? value : 0;
  try {
    await fetchJSON(`${API_BASE}/budget`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: activeMonth,
        amount: state.budget,
      }),
    });
  } catch (error) {
    showToast(error.message || "Unable to update budget.", "error");
    return;
  }
  render();
  await loadBudgetHistory();
  await loadBudgetLimit();
};

const handleDemoData = async () => {
  const base = elements.monthFilter.value || defaultMonth;
  const defaultPayment = state.paymentMethods[0];
  const groceries = state.categories.find((cat) => cat.label === "Groceries")?.id;
  const transport = state.categories.find((cat) => cat.label === "Transport")?.id;
  const rent = state.categories.find((cat) => cat.label === "Rent")?.id;

  const demo = [
    {
      amount: 1800,
      categoryId: groceries || state.categories[0]?.id,
      date: `${base}-03`,
      paymentMethodId: defaultPayment?.id || null,
      note: "Big Bazaar",
    },
    {
      amount: 320,
      categoryId: transport || state.categories[0]?.id,
      date: `${base}-05`,
      paymentMethodId: defaultPayment?.id || null,
      note: "Cab ride",
    },
    {
      amount: 2500,
      categoryId: rent || state.categories[0]?.id,
      date: `${base}-01`,
      paymentMethodId: defaultPayment?.id || null,
      note: "PG rent",
    },
  ];

  await Promise.all(
    demo.map((item) =>
      fetchJSON(`${API_BASE}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
    )
  );

  await refreshExpenses();
};

const handleReset = async () => {
  const confirmed = window.confirm("This will delete all saved expenses. Continue?");
  if (!confirmed) return;
  await fetchJSON(`${API_BASE}/reset`, { method: "DELETE" });
  await refreshAll();
  elements.budgetInput.value = "";
};

const downloadFile = (blob, filename) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const handleExportCsv = async () => {
  const data = await fetchJSON(`${API_BASE}/expenses?all=1&sort=newest`);
  const header = ["Date", "Amount", "Category", "Payment", "Note", "Receipt"];
  const rows = data.items.map((expense) => {
    const category = getCategory(Number(expense.categoryId));
    const paymentMethod = getPaymentById(Number(expense.paymentMethodId));
    return [
      expense.date,
      expense.amount,
      category?.label || "Other",
      paymentMethod ? getPaymentDisplay(paymentMethod) : "Payment",
      expense.note || "",
      expense.receiptName || "",
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadFile(new Blob([csv], { type: "text/csv" }), "rupeewise-expenses.csv");
};

const handleExportJson = async () => {
  const data = await fetchJSON(`${API_BASE}/expenses?all=1&sort=newest`);
  const payload = JSON.stringify(
    {
      user: state.user,
      categories: state.categories,
      paymentMethods: state.paymentMethods,
      expenses: data.items,
    },
    null,
    2
  );
  downloadFile(new Blob([payload], { type: "application/json" }), "rupeewise-data.json");
};

const handlePaymentListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "edit") {
    editingPaymentId = id;
    renderPaymentList();
    return;
  }

  if (button.dataset.action === "cancel") {
    editingPaymentId = null;
    renderPaymentList();
    return;
  }

  if (button.dataset.action === "save") {
    const item = button.closest(".method-item");
    if (!item) return;
    const method = state.paymentMethods.find((m) => m.id === id);
    if (!method) return;

    const labelInput = item.querySelector('[data-field="label"]');
    const label = labelInput ? labelInput.value.trim() : "";
    if (!label) {
      alert("Payment label is required.");
      return;
    }

    let detail = method.detail || null;
    if (method.type === "UPI") {
      const upiInput = item.querySelector('[data-field="upiId"]');
      const upiId = upiInput ? upiInput.value.trim() : "";
      if (!upiId) {
        alert("UPI ID is required.");
        return;
      }
      detail = { upiId };
    } else if (method.type === "Card") {
      const networkSelect = item.querySelector('[data-field="network"]');
      const last4Input = item.querySelector('[data-field="last4"]');
      const cardTypeSelect = item.querySelector('[data-field="cardType"]');
      const network = networkSelect ? networkSelect.value : "Visa";
      const last4 = last4Input ? last4Input.value.trim() : "";
      const cardType = cardTypeSelect ? cardTypeSelect.value : "debit";
      if (!last4 || last4.length !== 4) {
        alert("Enter the last 4 digits.");
        return;
      }
      detail = { network, last4, cardType };
    }

    try {
      await fetchJSON(`${API_BASE}/payment-methods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, detail }),
      });
      editingPaymentId = null;
      await loadPayments();
      render();
    } catch (error) {
      alert("Unable to update payment method.");
    }
    return;
  }

  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/payment-methods/${id}`, { method: "DELETE" });
    await loadPayments();
    await refreshExpenses();
  }

  if (button.dataset.action === "default") {
    await fetchJSON(`${API_BASE}/payment-methods/${id}/default`, { method: "PUT" });
    await loadPayments();
    render();
  }
};

const handleCategoryBudgetSubmit = async (event) => {
  event.preventDefault();
  if (!elements.categoryBudgetCategory || !elements.categoryBudgetPeriod) return;
  const categoryId = Number(elements.categoryBudgetCategory.value);
  const period = elements.categoryBudgetPeriod.value;
  const amount = Number(elements.categoryBudgetAmount.value);
  if (!categoryId || !amount) return;

  await fetchJSON(`${API_BASE}/category-budgets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, period, amount }),
  });

  elements.categoryBudgetForm.reset();
  await loadCategoryBudgets();
  await loadBudgetHistory();
};

const handleCategoryBudgetListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "edit") {
    editingCategoryBudgetId = id;
    renderCategoryBudgets();
    return;
  }

  if (button.dataset.action === "cancel") {
    editingCategoryBudgetId = null;
    renderCategoryBudgets();
    return;
  }

  if (button.dataset.action === "save") {
    const item = button.closest(".budget-item");
    const amountInput = item?.querySelector('[data-field="amount"]');
    const amount = amountInput ? Number(amountInput.value) : 0;
    if (!amount) return;
    await fetchJSON(`${API_BASE}/category-budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    editingCategoryBudgetId = null;
    await loadCategoryBudgets();
    await loadBudgetHistory();
    return;
  }

  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/category-budgets/${id}`, { method: "DELETE" });
    await loadCategoryBudgets();
    await loadBudgetHistory();
  }
};

const handleRecurringSubmit = async (event) => {
  event.preventDefault();
  const label = elements.recurringLabel?.value.trim();
  const amount = Number(elements.recurringAmount?.value);
  const categoryId = Number(elements.recurringCategory?.value);
  const paymentMethodId = Number(elements.recurringPayment?.value) || null;
  const dayOfMonth = Number(elements.recurringDay?.value);
  const note = elements.recurringNote?.value.trim() || "";
  if (!label || !amount || !categoryId || !dayOfMonth) return;

  await fetchJSON(`${API_BASE}/recurring`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, amount, categoryId, paymentMethodId, dayOfMonth, note }),
  });

  elements.recurringForm.reset();
  await loadRecurringExpenses();
  await refreshExpenses();
};

const handleRecurringListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "edit") {
    editingRecurringId = id;
    renderRecurringList();
    return;
  }
  if (button.dataset.action === "cancel") {
    editingRecurringId = null;
    renderRecurringList();
    return;
  }
  if (button.dataset.action === "save") {
    const item = button.closest(".method-item");
    if (!item) return;
    const label = item.querySelector('[data-field="label"]')?.value.trim() || "";
    const amount = Number(item.querySelector('[data-field="amount"]')?.value);
    const dayOfMonth = Number(item.querySelector('[data-field="day"]')?.value);
    if (!label || !amount || !dayOfMonth) return;
    await fetchJSON(`${API_BASE}/recurring/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, amount, dayOfMonth }),
    });
    editingRecurringId = null;
    await loadRecurringExpenses();
    await refreshExpenses();
    return;
  }
  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/recurring/${id}`, { method: "DELETE" });
    await loadRecurringExpenses();
    await refreshExpenses();
  }
};

const handleIncomeSourceSubmit = async (event) => {
  event.preventDefault();
  const name = elements.incomeSourceName?.value.trim();
  const type = elements.incomeSourceType?.value.trim() || "";
  if (!name) return;

  await fetchJSON(`${API_BASE}/income-sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type }),
  });

  elements.incomeSourceForm.reset();
  await loadIncomeSources();
};

const handleIncomeSourceListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "edit") {
    editingIncomeSourceId = id;
    renderIncomeSources();
    return;
  }
  if (button.dataset.action === "cancel") {
    editingIncomeSourceId = null;
    renderIncomeSources();
    return;
  }
  if (button.dataset.action === "save") {
    const item = button.closest(".method-item");
    if (!item) return;
    const name = item.querySelector('[data-field="name"]')?.value.trim() || "";
    const type = item.querySelector('[data-field="type"]')?.value.trim() || "";
    if (!name) return;
    await fetchJSON(`${API_BASE}/income-sources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    editingIncomeSourceId = null;
    await loadIncomeSources();
    return;
  }
  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/income-sources/${id}`, { method: "DELETE" });
    await loadIncomeSources();
    await loadIncomeEntries();
  }
};

const handleIncomeEntrySubmit = async (event) => {
  event.preventDefault();
  const sourceId = Number(elements.incomeSourceSelect?.value);
  const amount = Number(elements.incomeAmount?.value);
  const date = elements.incomeDate?.value;
  const note = elements.incomeNote?.value.trim() || "";
  if (!sourceId || !amount || !date) return;

  await fetchJSON(`${API_BASE}/income`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceId, amount, date, note }),
  });

  elements.incomeEntryForm.reset();
  elements.incomeDate.value = today.toISOString().slice(0, 10);
  await loadIncomeEntries();
};

const handleIncomeListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "delete") {
    await fetchJSON(`${API_BASE}/income/${id}`, { method: "DELETE" });
    await loadIncomeEntries();
  }
};

const handleAddUpi = async (event) => {
  event.preventDefault();
  const label = elements.upiLabel.value.trim();
  const upiId = elements.upiId.value.trim();
  if (!label || !upiId) return;

  try {
    await fetchJSON(`${API_BASE}/payment-methods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "UPI",
        label,
        detail: { upiId },
      }),
    });
  } catch (error) {
    alert(error.message === "Unauthorized" ? "Please sign in again." : error.message);
    return;
  }

  elements.upiForm.reset();
  await loadPayments();
};

const handleAddCard = async (event) => {
  event.preventDefault();
  const label = elements.cardLabel.value.trim();
  const cardType = elements.cardType?.value || "debit";
  const network = elements.cardNetwork.value;
  const last4 = elements.cardLast4.value.trim();
  if (!label || !last4) return;

  try {
    await fetchJSON(`${API_BASE}/payment-methods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Card",
        label,
        detail: { network, last4, cardType },
      }),
    });
  } catch (error) {
    alert(error.message === "Unauthorized" ? "Please sign in again." : error.message);
    return;
  }

  elements.cardForm.reset();
  await loadPayments();
};

const handleAddSimplePayment = async (event) => {
  event.preventDefault();
  const type = elements.simplePaymentType.value;
  const label = elements.simplePaymentLabel.value.trim() || type;

  try {
    await fetchJSON(`${API_BASE}/payment-methods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        label,
        detail: null,
      }),
    });
  } catch (error) {
    alert(error.message === "Unauthorized" ? "Please sign in again." : error.message);
    return;
  }

  elements.simplePaymentForm.reset();
  await loadPayments();
};


const handleAddCategory = async (event) => {
  event.preventDefault();
  const name = elements.categoryName.value.trim();
  const color = elements.categoryColor.value || "#f59e0b";
  if (!name) return;

  await fetchJSON(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label: name, color }),
  });

  elements.categoryForm.reset();
  await loadCategories();
  await refreshExpenses();
};

const handleCategoryListClick = async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!id) return;

  if (button.dataset.action === "remove") {
    await fetchJSON(`${API_BASE}/categories/${id}`, { method: "DELETE" });
    await loadCategories();
    await refreshExpenses();
  }
};

const handleTabClick = (event) => {
  const button = event.target.closest(".tab");
  if (!button || button.disabled) return;
  const target = button.dataset.tab;
  activateTab(target);
  requestAnimationFrame(refreshScrollLimits);
};

const handleFiltersChange = async () => {
  if (!state.user) return;
  syncBudgetMonth();
  await loadBudget();
  await loadExpenses();
};

const handleLogin = async (event) => {
  event.preventDefault();
  clearAuthMessage();
  elements.loginPassword.classList.remove("input-invalid");
  const email = elements.loginEmail.value.trim();
  const password = elements.loginPassword.value;
  if (!email || !password) return;

  try {
    setFormLoading(elements.loginForm, true, "Signing in...");
    const data = await fetchJSON(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setAuthToken(data.token);
    state.user = data.user;
    updateUserUI();
    setAuthUI(true);
    await refreshAll();
    elements.loginForm.reset();
    clearAuthMessage();
  } catch (error) {
    setAuthMessage("error", "Login failed. Check your email and password.");
    elements.loginPassword.classList.add("input-invalid");
  } finally {
    setFormLoading(elements.loginForm, false);
  }
};

const handleRegister = async (event) => {
  event.preventDefault();
  clearAuthMessage();
  elements.registerPassword.classList.remove("input-invalid");
  if (elements.registerConfirm) elements.registerConfirm.classList.remove("input-invalid");
  const name = elements.registerName.value.trim();
  const email = elements.registerEmail.value.trim();
  const password = elements.registerPassword.value;
  const confirm = elements.registerConfirm?.value || "";
  if (!name || !email || !password) return;
  if (password.length < 8) {
    setAuthMessage("error", "Password must be at least 8 characters.");
    elements.registerPassword.classList.add("input-invalid");
    return;
  }
  if (password !== confirm) {
    setAuthMessage("error", "Passwords do not match.");
    if (elements.registerConfirm) elements.registerConfirm.classList.add("input-invalid");
    return;
  }

  try {
    setFormLoading(elements.registerForm, true, "Creating account...");
    const data = await fetchJSON(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setAuthToken(data.token);
    state.user = data.user;
    updateUserUI();
    setAuthUI(true);
    await refreshAll();
    elements.registerForm.reset();
    clearAuthMessage();
  } catch (error) {
    setAuthMessage(
      "error",
      "Unable to create account. Please try a different email or password."
    );
    elements.registerPassword.classList.add("input-invalid");
  } finally {
    setFormLoading(elements.registerForm, false);
  }
};

const handleProfileSave = async (event) => {
  event.preventDefault();
  const name = elements.profileName.value.trim();
  if (!name) return;

  const data = await fetchJSON(`${API_BASE}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  state.user = data.user;
  updateUserUI();
};

const handleAvatarUpload = async (event) => {
  event.preventDefault();
  const file = elements.avatarInput.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);
  const data = await fetchJSON(`${API_BASE}/profile/avatar`, {
    method: "POST",
    body: formData,
  });
  state.user = data.user;
  updateUserUI();
  elements.avatarForm.reset();
  if (elements.avatarFileName) {
    elements.avatarFileName.textContent = "No file chosen";
  }
};

const handleLogout = () => {
  if (state.token) {
    fetchJSON(`${API_BASE}/auth/logout`, { method: "DELETE" }).catch(() => {});
  }
  clearAuth();
};

const openNotifications = () => {
  if (!elements.notificationModal) return;
  renderBudgetAlerts();
  elements.notificationModal.classList.remove("hidden");
};

const closeNotifications = () => {
  if (!elements.notificationModal) return;
  elements.notificationModal.classList.add("hidden");
};

const handleThemeChange = (event) => {
  const theme = event.target.value;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

const handleTogglePasswordForm = () => {
  if (!elements.passwordForm) return;
  elements.passwordForm.classList.toggle("hidden");
};

const handleCancelPassword = () => {
  if (!elements.passwordForm) return;
  elements.passwordForm.classList.add("hidden");
  if (elements.currentPassword) elements.currentPassword.value = "";
  if (elements.newPassword) elements.newPassword.value = "";
  if (elements.confirmPassword) elements.confirmPassword.value = "";
};

const handlePasswordUpdate = async () => {
  const currentPassword = elements.currentPassword?.value || "";
  const newPassword = elements.newPassword?.value || "";
  const confirmPassword = elements.confirmPassword?.value || "";
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill in all password fields.");
    return;
  }
  if (newPassword.length < 8) {
    alert("New password must be at least 8 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }
  await fetchJSON(`${API_BASE}/profile/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  alert("Password updated successfully.");
  handleCancelPassword();
};

const handleDeleteAccount = async () => {
  const confirmation = prompt('Type "DELETE" to confirm account deletion.');
  if (confirmation !== "DELETE") return;
  await fetchJSON(`${API_BASE}/profile`, { method: "DELETE" });
  clearAuth();
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
  } else {
    control.setAttribute("aria-pressed", shouldShow ? "true" : "false");
    control.classList.toggle("is-visible", shouldShow);
    control.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
  }
};

const init = async () => {
  elements.monthFilter.value = defaultMonth;
  elements.date.value = today.toISOString().slice(0, 10);
  if (elements.budgetMonth) elements.budgetMonth.value = defaultMonth;
  if (elements.incomeMonthFilter) elements.incomeMonthFilter.value = defaultMonth;
  if (elements.incomeDate) elements.incomeDate.value = today.toISOString().slice(0, 10);

  if (!state.token) {
    redirectToLogin();
    return;
  }

  try {
    const data = await fetchJSON(`${API_BASE}/auth/me`);
    state.user = data.user;
    updateUserUI();
    setAuthUI(true);
    await refreshAll();
  } catch (error) {
    if (!state.token || error?.status === 401) return;
    console.error("Auth check failed. Keeping session and retrying later.", error);
  }
};

initTheme();
init();

// Event listeners

elements.form.addEventListener("submit", handleSubmit);
elements.cancelEdit.addEventListener("click", resetForm);
elements.expenseList.addEventListener("click", handleListClick);
elements.saveBudget.addEventListener("click", handleBudgetSave);
elements.demoButton.addEventListener("click", handleDemoData);
elements.resetButton.addEventListener("click", handleReset);
elements.exportCsv.addEventListener("click", handleExportCsv);
elements.exportJson.addEventListener("click", handleExportJson);

if (elements.paymentList) elements.paymentList.addEventListener("click", handlePaymentListClick);
if (elements.upiForm) elements.upiForm.addEventListener("submit", handleAddUpi);
if (elements.cardForm) elements.cardForm.addEventListener("submit", handleAddCard);
if (elements.simplePaymentForm)
  elements.simplePaymentForm.addEventListener("submit", handleAddSimplePayment);

elements.categoryForm.addEventListener("submit", handleAddCategory);
elements.categoryList.addEventListener("click", handleCategoryListClick);
if (elements.categoryBudgetForm)
  elements.categoryBudgetForm.addEventListener("submit", handleCategoryBudgetSubmit);
if (elements.categoryBudgetList)
  elements.categoryBudgetList.addEventListener("click", handleCategoryBudgetListClick);
if (elements.recurringForm) elements.recurringForm.addEventListener("submit", handleRecurringSubmit);
if (elements.recurringList) elements.recurringList.addEventListener("click", handleRecurringListClick);
if (elements.incomeSourceForm)
  elements.incomeSourceForm.addEventListener("submit", handleIncomeSourceSubmit);
if (elements.incomeSourceList)
  elements.incomeSourceList.addEventListener("click", handleIncomeSourceListClick);
if (elements.incomeEntryForm)
  elements.incomeEntryForm.addEventListener("submit", handleIncomeEntrySubmit);
if (elements.incomeList) elements.incomeList.addEventListener("click", handleIncomeListClick);
if (elements.incomeMonthFilter)
  elements.incomeMonthFilter.addEventListener("input", loadIncomeEntries);
if (elements.budgetMonth)
  elements.budgetMonth.addEventListener("input", () => {
    if (elements.monthFilter) elements.monthFilter.value = elements.budgetMonth.value;
    handleFiltersChange();
  });

window.addEventListener("resize", () => {
  refreshScrollLimits();
});

if (elements.loginForm) elements.loginForm.addEventListener("submit", handleLogin);
if (elements.registerForm) elements.registerForm.addEventListener("submit", handleRegister);
if (elements.profileForm) elements.profileForm.addEventListener("submit", handleProfileSave);
if (elements.avatarForm) elements.avatarForm.addEventListener("submit", handleAvatarUpload);
if (elements.avatarInput && elements.avatarFileName) {
  elements.avatarInput.addEventListener("change", () => {
    const file = elements.avatarInput.files?.[0];
    elements.avatarFileName.textContent = file ? file.name : "No file chosen";
  });
}
if (elements.notificationButton) {
  elements.notificationButton.addEventListener("click", openNotifications);
}
if (elements.notificationClose) {
  elements.notificationClose.addEventListener("click", closeNotifications);
}
if (elements.notificationModal) {
  elements.notificationModal.addEventListener("click", (event) => {
    if (event.target === elements.notificationModal) closeNotifications();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNotifications();
  });
}
if (elements.receipt && elements.receiptFileName) {
  elements.receipt.addEventListener("change", () => {
    const file = elements.receipt.files?.[0];
    elements.receiptFileName.textContent = file ? file.name : "No file chosen";
  });
}
if (elements.logoutButton) elements.logoutButton.addEventListener("click", handleLogout);
if (elements.themeSelect) elements.themeSelect.addEventListener("change", handleThemeChange);
if (elements.themeRadios?.length) {
  elements.themeRadios.forEach((radio) =>
    radio.addEventListener("change", handleThemeChange)
  );
}
if (elements.changePasswordButton)
  elements.changePasswordButton.addEventListener("click", handleTogglePasswordForm);
if (elements.cancelPassword)
  elements.cancelPassword.addEventListener("click", handleCancelPassword);
if (elements.savePassword) elements.savePassword.addEventListener("click", handlePasswordUpdate);
if (elements.deleteAccountButton)
  elements.deleteAccountButton.addEventListener("click", handleDeleteAccount);
elements.passwordToggles.forEach((button) =>
  button.addEventListener("click", handleTogglePassword)
);
elements.passwordToggles.forEach((button) =>
  button.addEventListener("pointerdown", (event) => event.preventDefault())
);
elements.showPasswordToggles.forEach((checkbox) =>
  checkbox.addEventListener("change", handleTogglePassword)
);
if (elements.registerPassword) {
  elements.registerPassword.addEventListener("input", updatePasswordMeter);
  updatePasswordMeter();
}
if (elements.loginPassword) {
  elements.loginPassword.addEventListener("input", () =>
    elements.loginPassword.classList.remove("input-invalid")
  );
}
if (elements.registerPassword) {
  elements.registerPassword.addEventListener("input", () =>
    elements.registerPassword.classList.remove("input-invalid")
  );
}
if (elements.registerConfirm) {
  elements.registerConfirm.addEventListener("input", () =>
    elements.registerConfirm.classList.remove("input-invalid")
  );
}

if (elements.insightRangeButtons.length) {
  elements.insightRangeButtons.forEach((button) =>
    button.addEventListener("click", () => setInsightRange(button.dataset.range))
  );
  setInsightRange(state.insightRange);
}

elements.tabs.forEach((tab) => tab.addEventListener("click", handleTabClick));

[elements.monthFilter, elements.categoryFilter, elements.searchFilter, elements.sortFilter].forEach(
  (input) => input.addEventListener("input", handleFiltersChange)
);

elements.quickAddButtons.forEach((button) => {
  button.addEventListener("click", () => {
    elements.amount.value = button.dataset.amount;
    elements.note.value = button.dataset.note;
  });
});

if (elements.noteChips.length) {
  elements.noteChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const token = chip.dataset.note;
      if (token) appendNoteToken(token);
    });
  });
}
