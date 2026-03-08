const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const multer = require("multer");
require("dotenv").config();

const app = express();
const WEB_ROOT = path.join(__dirname, "..");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(express.static(WEB_ROOT));

app.get("/", (req, res) => {
  res.sendFile(path.join(WEB_ROOT, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(WEB_ROOT, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(WEB_ROOT, "register.html"));
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rupeewise",
  database: process.env.DB_NAME || "rupeewise",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_HOST && process.env.DB_HOST !== "127.0.0.1" && process.env.DB_HOST !== "db"
    ? { rejectUnauthorized: true }
    : undefined
});

const BILLS_DIR = path.join(__dirname, "..", "bills");
const RECEIPTS_DIR = path.join(BILLS_DIR, "receipts");
const AVATARS_DIR = path.join(BILLS_DIR, "avatars");

fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
fs.mkdirSync(AVATARS_DIR, { recursive: true });

app.use("/bills", express.static(BILLS_DIR));

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const AI_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const aiCache = new Map();

const callGemini = async ({ apiKey, model, payload }) => {
  const url = `${GEMINI_API_BASE}/${model}:generateContent`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Gemini API error");
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const getAiCacheKey = (userId, month) => `${userId}:${month}`;

const DEFAULT_CATEGORIES = [
  { label: "Groceries", color: "#22c55e" },
  { label: "Transport", color: "#0ea5e9" },
  { label: "Dining", color: "#f97316" },
  { label: "Rent", color: "#6366f1" },
  { label: "Shopping", color: "#ec4899" },
  { label: "Health", color: "#14b8a6" },
  { label: "Utilities", color: "#a855f7" },
  { label: "Entertainment", color: "#f43f5e" },
  { label: "Travel", color: "#38bdf8" },
  { label: "Education", color: "#eab308" },
  { label: "Subscriptions", color: "#84cc16" },
  { label: "Fuel", color: "#f59e0b" },
  { label: "Gifts", color: "#f472b6" },
  { label: "Insurance", color: "#0f766e" },
  { label: "Investments", color: "#4f46e5" },
  { label: "Personal care", color: "#ec4899" },
  { label: "Kids", color: "#fb7185" },
  { label: "Donations", color: "#22c55e" },
  { label: "Pets", color: "#94a3b8" },
  { label: "Home maintenance", color: "#f97316" },
  { label: "Other", color: "#64748b" },
];

const DEFAULT_PAYMENTS = [
  { type: "UPI", label: "UPI 1", detail: { upiId: "name@bank" }, isDefault: 1 },
  { type: "UPI", label: "UPI 2", detail: { upiId: "name2@upi" }, isDefault: 0 },
  { type: "Card", label: "Card 1", detail: { network: "Visa", last4: "1234" }, isDefault: 0 },
  { type: "Cash", label: "Cash", detail: null, isDefault: 0 },
  { type: "Wallet", label: "Wallet", detail: null, isDefault: 0 },
  { type: "NetBanking", label: "NetBanking", detail: null, isDefault: 0 },
];

const seedDefaultsForUser = async (userId) => {
  let templates = await query(
    "SELECT label, color FROM category_templates ORDER BY id ASC"
  );
  if (!templates.length) {
    templates = DEFAULT_CATEGORIES;
  }

  const categoryValues = templates.map((cat) => [
    userId,
    cat.label,
    cat.color,
    1,
  ]);

  await pool.query(
    "INSERT INTO categories (user_id, label, color, is_default) VALUES ?",
    [categoryValues]
  );

  const paymentValues = DEFAULT_PAYMENTS.map((method) => [
    userId,
    method.type,
    method.label,
    method.detail ? JSON.stringify(method.detail) : null,
    method.isDefault,
  ]);

  await pool.query(
    "INSERT INTO payment_methods (user_id, type, label, detail, is_default) VALUES ?",
    [paymentValues]
  );
};

const safeJsonParse = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const padNumber = (value) => String(value).padStart(2, "0");

const createSession = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await query(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
  return token;
};

const getSession = async (token) => {
  const rows = await query(
    "SELECT user_id, expires_at FROM sessions WHERE token = ? LIMIT 1",
    [token]
  );
  return rows[0] || null;
};

const deleteSession = async (token) => {
  await query("DELETE FROM sessions WHERE token = ?", [token]);
};

const ensureRecurringExpenses = async (userId) => {
  const recurring = await query(
    `SELECT id, label, amount, category_id, payment_method_id, day_of_month, note, last_run_month
     FROM recurring_expenses
     WHERE user_id = ? AND is_active = 1`,
    [userId]
  );
  if (!recurring.length) return;

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  for (const item of recurring) {
    if (item.last_run_month === monthKey) continue;
    try {
      const existing = await query(
        "SELECT id FROM expenses WHERE user_id = ? AND recurring_id = ? AND DATE_FORMAT(expense_date, '%Y-%m') = ? LIMIT 1",
        [userId, item.id, monthKey]
      );

      if (!existing.length) {
        const day = Math.min(Number(item.day_of_month) || 1, daysInMonth);
        const date = `${monthKey}-${padNumber(day)}`;
        await query(
          `INSERT INTO expenses (user_id, amount, category_id, payment_method_id, expense_date, note, recurring_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            item.amount,
            item.category_id,
            item.payment_method_id,
            date,
            item.note || item.label,
            item.id,
          ]
        );
      }

      await query("UPDATE recurring_expenses SET last_run_month = ? WHERE id = ?", [
        monthKey,
        item.id,
      ]);
    } catch (error) {
      console.error("Recurring expense error", error);
    }
  }
};

const recordBudgetHistory = async ({
  userId,
  scope,
  period,
  month,
  categoryId,
  previousAmount,
  newAmount,
}) => {
  if (previousAmount === newAmount) return;
  await query(
    `INSERT INTO budget_history (user_id, scope, period, month, category_id, previous_amount, new_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      scope,
      period,
      month || null,
      categoryId || null,
      previousAmount || 0,
      newAmount || 0,
    ]
  );
};

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, RECEIPTS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.user.userId}-${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, name);
  },
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATARS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.user.userId}-${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, name);
  },
});

const receiptUpload = multer({
  storage: receiptStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
    cb(ok ? null : new Error("Invalid file type"), ok);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Invalid file type"), ok);
  },
});

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const session = await getSession(token);
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      await deleteSession(token);
      return res.status(401).json({ error: "Session expired" });
    }
    req.user = { userId: session.user_id, token };
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Auth error" });
  }
};

const formatUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_path ? `/bills/${row.avatar_path}` : null,
  };
};

const getOtherCategoryId = async (userId) => {
  const rows = await query(
    "SELECT id FROM categories WHERE user_id = ? AND label = 'Other' LIMIT 1",
    [userId]
  );
  return rows[0]?.id || null;
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password too short" });
  }

  const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) {
    return res.status(400).json({ error: "Unable to create account" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );

  const userId = result.insertId;
  await seedDefaultsForUser(userId);

  const token = await createSession(userId);
  const user = formatUser({ id: userId, name, email, avatar_path: null });
  res.status(201).json({ token, user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Invalid payload" });

  const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
  if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

  const userRow = rows[0];
  const hash = userRow.password_hash || "";
  let match = false;

  if (hash.startsWith("$2")) {
    match = await bcrypt.compare(password, hash);
  } else if (hash.startsWith("sha256$")) {
    const stored = hash.split("$")[1] || "";
    const computed = crypto.createHash("sha256").update(password).digest("hex");
    match = stored === computed;
    if (match) {
      const upgraded = await bcrypt.hash(password, 10);
      await query("UPDATE users SET password_hash = ? WHERE id = ?", [upgraded, userRow.id]);
      userRow.password_hash = upgraded;
    }
  } else {
    match = await bcrypt.compare(password, hash).catch(() => false);
  }

  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = await createSession(userRow.id);
  res.json({ token, user: formatUser(userRow) });
});

app.delete("/api/auth/logout", authMiddleware, async (req, res) => {
  await deleteSession(req.user.token);
  res.json({ ok: true });
});

app.use("/api", (req, res, next) => {
  if (req.path.startsWith("/auth")) return next();
  return authMiddleware(req, res, next);
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  await ensureRecurringExpenses(req.user.userId);
  const rows = await query("SELECT id, name, email, avatar_path FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  res.json({ user: formatUser(rows[0]) });
});

app.put("/api/profile", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Invalid payload" });

  await query("UPDATE users SET name = ? WHERE id = ?", [name, req.user.userId]);

  const rows = await query("SELECT id, name, email, avatar_path FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  res.json({ user: formatUser(rows[0]) });
});

app.post("/api/profile/avatar", avatarUpload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const avatarPath = `avatars/${req.file.filename}`;
  await query("UPDATE users SET avatar_path = ? WHERE id = ?", [
    avatarPath,
    req.user.userId,
  ]);

  const rows = await query("SELECT id, name, email, avatar_path FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  res.json({ user: formatUser(rows[0]) });
});

app.put("/api/profile/password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: "Password too short" });
  }

  const rows = await query("SELECT id, password_hash FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  if (!rows.length) return res.status(404).json({ error: "User not found" });

  const userRow = rows[0];
  const hash = userRow.password_hash || "";
  let match = false;

  if (hash.startsWith("$2")) {
    match = await bcrypt.compare(currentPassword, hash);
  } else if (hash.startsWith("sha256$")) {
    const stored = hash.split("$")[1] || "";
    const computed = crypto.createHash("sha256").update(currentPassword).digest("hex");
    match = stored === computed;
  } else {
    match = await bcrypt.compare(currentPassword, hash).catch(() => false);
  }

  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const newHash = await bcrypt.hash(newPassword, 10);
  await query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, userRow.id]);
  res.json({ ok: true });
});

app.delete("/api/profile", async (req, res) => {
  await query("DELETE FROM users WHERE id = ?", [req.user.userId]);
  await deleteSession(req.user.token);
  res.json({ ok: true });
});

app.get("/api/categories", async (req, res) => {
  const rows = await query(
    "SELECT id, label, color, is_default AS locked FROM categories WHERE user_id = ? ORDER BY label ASC",
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/categories", async (req, res) => {
  const { label, color } = req.body;
  if (!label || !color) return res.status(400).json({ error: "Invalid payload" });

  const result = await query(
    "INSERT INTO categories (user_id, label, color, is_default) VALUES (?, ?, ?, 0)",
    [req.user.userId, label, color]
  );

  res.status(201).json({ id: result.insertId, label, color, locked: 0 });
});

app.delete("/api/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const rows = await query(
    "SELECT is_default FROM categories WHERE id = ? AND user_id = ?",
    [id, req.user.userId]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  if (rows[0].is_default) {
    return res.status(400).json({ error: "Default categories cannot be removed" });
  }

  const otherId = await getOtherCategoryId(req.user.userId);
  if (otherId) {
    await query("UPDATE expenses SET category_id = ? WHERE category_id = ? AND user_id = ?", [
      otherId,
      id,
      req.user.userId,
    ]);
  }
  await query("DELETE FROM categories WHERE id = ? AND user_id = ?", [id, req.user.userId]);
  res.json({ ok: true });
});

app.get("/api/payment-methods", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, type, label, detail, is_default AS isDefault FROM payment_methods WHERE user_id = ? ORDER BY type, label",
      [req.user.userId]
    );
    const items = rows.map((row) => ({
      ...row,
      detail: safeJsonParse(row.detail),
      isDefault: Boolean(row.isDefault),
    }));
    res.json({ items });
  } catch (error) {
    console.error("Failed to load payment methods", error);
    res.status(500).json({ error: "Failed to load payment methods" });
  }
});

app.post("/api/payment-methods", async (req, res) => {
  const { type, label, detail } = req.body;
  if (!type || !label) return res.status(400).json({ error: "Invalid payload" });

  const result = await query(
    "INSERT INTO payment_methods (user_id, type, label, detail, is_default) VALUES (?, ?, ?, ?, 0)",
    [req.user.userId, type, label, detail ? JSON.stringify(detail) : null]
  );

  res.status(201).json({ id: result.insertId });
});

app.put("/api/payment-methods/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { label, detail } = req.body;
  if (!label) return res.status(400).json({ error: "Invalid payload" });

  await query(
    "UPDATE payment_methods SET label = ?, detail = ? WHERE id = ? AND user_id = ?",
    [label, detail ? JSON.stringify(detail) : null, id, req.user.userId]
  );

  res.json({ ok: true });
});

app.put("/api/payment-methods/:id/default", async (req, res) => {
  const id = Number(req.params.id);
  await query("UPDATE payment_methods SET is_default = 0 WHERE user_id = ?", [
    req.user.userId,
  ]);
  await query("UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.delete("/api/payment-methods/:id", async (req, res) => {
  const id = Number(req.params.id);
  const rows = await query(
    "SELECT id, is_default FROM payment_methods WHERE id = ? AND user_id = ?",
    [id, req.user.userId]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  await query("UPDATE expenses SET payment_method_id = NULL WHERE payment_method_id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  await query("DELETE FROM payment_methods WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);

  if (rows[0].is_default) {
    const next = await query(
      "SELECT id FROM payment_methods WHERE user_id = ? ORDER BY id LIMIT 1",
      [req.user.userId]
    );
    if (next[0]) {
      await query("UPDATE payment_methods SET is_default = 1 WHERE id = ?", [next[0].id]);
    }
  }

  res.json({ ok: true });
});

app.get("/api/expenses", async (req, res) => {
  const { month, category, search, sort, all } = req.query;
  const params = [req.user.userId];
  const where = ["user_id = ?"];

  if (!all && month) {
    where.push("DATE_FORMAT(expense_date, '%Y-%m') = ?");
    params.push(month);
  }
  if (category && category !== "all") {
    where.push("category_id = ?");
    params.push(Number(category));
  }
  if (search) {
    where.push("note LIKE ?");
    params.push(`%${search}%`);
  }

  let orderBy = "expense_date DESC";
  if (sort === "oldest") orderBy = "expense_date ASC";
  if (sort === "high") orderBy = "amount DESC";
  if (sort === "low") orderBy = "amount ASC";

  const sql = `
    SELECT id, amount, category_id AS categoryId, payment_method_id AS paymentMethodId,
           expense_date AS date, note, receipt_path AS receiptPath, receipt_name AS receiptName
    FROM expenses
    WHERE ${where.join(" AND ")}
    ORDER BY ${orderBy}
  `;

  const rows = await query(sql, params);
  const items = rows.map((row) => ({
    ...row,
    receiptUrl: row.receiptPath ? `/bills/${row.receiptPath}` : null,
  }));
  res.json({ items });
});

app.post("/api/expenses", async (req, res) => {
  const { amount, categoryId, paymentMethodId, date, note } = req.body;
  if (!amount || !categoryId || !date || !paymentMethodId) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const result = await query(
    "INSERT INTO expenses (user_id, amount, category_id, payment_method_id, expense_date, note) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.userId, amount, categoryId, paymentMethodId || null, date, note || null]
  );

  res.status(201).json({ id: result.insertId });
});

app.put("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { amount, categoryId, paymentMethodId, date, note } = req.body;
  if (!amount || !categoryId || !date || !paymentMethodId) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  await query(
    "UPDATE expenses SET amount = ?, category_id = ?, payment_method_id = ?, expense_date = ?, note = ? WHERE id = ? AND user_id = ?",
    [amount, categoryId, paymentMethodId || null, date, note || null, id, req.user.userId]
  );
  res.json({ ok: true });
});

app.post("/api/expenses/:id/receipt", receiptUpload.single("receipt"), async (req, res) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: "No file" });

  const rows = await query("SELECT id FROM expenses WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const receiptPath = `receipts/${req.file.filename}`;
  await query(
    "UPDATE expenses SET receipt_path = ?, receipt_name = ?, receipt_type = ?, receipt_size = ? WHERE id = ? AND user_id = ?",
    [
      receiptPath,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      id,
      req.user.userId,
    ]
  );

  res.json({
    receiptUrl: `/bills/${receiptPath}`,
    receiptName: req.file.originalname,
  });
});

app.delete("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM expenses WHERE id = ? AND user_id = ?", [id, req.user.userId]);
  res.json({ ok: true });
});

app.get("/api/budget", async (req, res) => {
  const { month } = req.query;
  if (!month) return res.json({ month: "", amount: 0 });
  const rows = await query("SELECT amount FROM budgets WHERE user_id = ? AND month = ?", [
    req.user.userId,
    month,
  ]);
  res.json({ month, amount: rows[0]?.amount || 0 });
});

app.put("/api/budget", async (req, res) => {
  const { month, amount } = req.body;
  if (!month) return res.status(400).json({ error: "Month is required" });
  const existing = await query(
    "SELECT amount FROM budgets WHERE user_id = ? AND month = ?",
    [req.user.userId, month]
  );
  const previousAmount = existing[0]?.amount || 0;
  if (previousAmount !== (amount || 0)) {
    const rows = await query(
      "SELECT COUNT(*) AS count FROM budget_history WHERE user_id = ? AND scope = 'overall' AND period = 'monthly' AND month = ?",
      [req.user.userId, month]
    );
    const used = Number(rows[0]?.count || 0);
    if (used >= 5) {
      return res.status(429).json({
        error: "Budget change limit reached (5 per month).",
      });
    }
  }
  await query(
    "INSERT INTO budgets (user_id, month, amount) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE amount = VALUES(amount)",
    [req.user.userId, month, amount || 0]
  );
  if (previousAmount !== (amount || 0)) {
    await recordBudgetHistory({
      userId: req.user.userId,
      scope: "overall",
      period: "monthly",
      month,
      previousAmount,
      newAmount: amount || 0,
    });
  }
  res.json({ ok: true });
});

app.get("/api/budget-limit", async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.json({ limit: 5, used: 0, remaining: 5 });
  }
  const rows = await query(
    "SELECT COUNT(*) AS count FROM budget_history WHERE user_id = ? AND scope = 'overall' AND period = 'monthly' AND month = ?",
    [req.user.userId, month]
  );
  const used = Number(rows[0]?.count || 0);
  res.json({ limit: 5, used, remaining: Math.max(0, 5 - used) });
});

app.get("/api/category-budgets", async (req, res) => {
  const rows = await query(
    `SELECT id, category_id AS categoryId, period, amount
     FROM category_budgets
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/category-budgets", async (req, res) => {
  const { categoryId, period, amount } = req.body;
  if (!categoryId || !period || !amount) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const existing = await query(
    "SELECT id, amount FROM category_budgets WHERE user_id = ? AND category_id = ? AND period = ?",
    [req.user.userId, categoryId, period]
  );

  if (existing.length) {
    await query("UPDATE category_budgets SET amount = ? WHERE id = ?", [
      amount,
      existing[0].id,
    ]);
    await recordBudgetHistory({
      userId: req.user.userId,
      scope: "category",
      period,
      month: new Date().toISOString().slice(0, 7),
      categoryId,
      previousAmount: existing[0].amount || 0,
      newAmount: amount,
    });
    return res.json({ id: existing[0].id });
  }

  const result = await query(
    "INSERT INTO category_budgets (user_id, category_id, period, amount) VALUES (?, ?, ?, ?)",
    [req.user.userId, categoryId, period, amount]
  );
  await recordBudgetHistory({
    userId: req.user.userId,
    scope: "category",
    period,
    month: new Date().toISOString().slice(0, 7),
    categoryId,
    previousAmount: 0,
    newAmount: amount,
  });
  res.status(201).json({ id: result.insertId });
});

app.put("/api/category-budgets/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { amount } = req.body;
  if (!id || !amount) return res.status(400).json({ error: "Invalid payload" });

  const existing = await query(
    "SELECT amount, period, category_id FROM category_budgets WHERE id = ? AND user_id = ?",
    [id, req.user.userId]
  );
  if (!existing.length) return res.status(404).json({ error: "Not found" });

  await query("UPDATE category_budgets SET amount = ? WHERE id = ?", [amount, id]);
  await recordBudgetHistory({
    userId: req.user.userId,
    scope: "category",
    period: existing[0].period,
    month: new Date().toISOString().slice(0, 7),
    categoryId: existing[0].category_id,
    previousAmount: existing[0].amount || 0,
    newAmount: amount,
  });
  res.json({ ok: true });
});

app.delete("/api/category-budgets/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM category_budgets WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.get("/api/budget-history", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const rows = await query(
    `SELECT id, scope, period, month, category_id AS categoryId,
            previous_amount AS previousAmount, new_amount AS newAmount,
            changed_at AS changedAt
     FROM budget_history
     WHERE user_id = ?
     ORDER BY changed_at DESC
     LIMIT ${limit}`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.get("/api/recurring", async (req, res) => {
  const rows = await query(
    `SELECT id, label, amount, category_id AS categoryId, payment_method_id AS paymentMethodId,
            day_of_month AS dayOfMonth, note, is_active AS isActive
     FROM recurring_expenses
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/recurring", async (req, res) => {
  const { label, amount, categoryId, paymentMethodId, dayOfMonth, note } = req.body;
  if (!label || !amount || !categoryId || !dayOfMonth) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const result = await query(
    `INSERT INTO recurring_expenses
     (user_id, label, amount, category_id, payment_method_id, day_of_month, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.userId,
      label,
      amount,
      categoryId,
      paymentMethodId || null,
      dayOfMonth,
      note || null,
    ]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/recurring/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { label, amount, dayOfMonth } = req.body;
  if (!id || !label || !amount || !dayOfMonth) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  await query(
    "UPDATE recurring_expenses SET label = ?, amount = ?, day_of_month = ? WHERE id = ? AND user_id = ?",
    [label, amount, dayOfMonth, id, req.user.userId]
  );
  res.json({ ok: true });
});

app.delete("/api/recurring/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM recurring_expenses WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.get("/api/income-sources", async (req, res) => {
  const rows = await query(
    `SELECT id, name, type, is_active AS isActive
     FROM income_sources
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/income-sources", async (req, res) => {
  const { name, type } = req.body;
  if (!name) return res.status(400).json({ error: "Invalid payload" });
  const result = await query(
    "INSERT INTO income_sources (user_id, name, type) VALUES (?, ?, ?)",
    [req.user.userId, name, type || null]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/income-sources/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, type } = req.body;
  if (!id || !name) return res.status(400).json({ error: "Invalid payload" });
  await query("UPDATE income_sources SET name = ?, type = ? WHERE id = ? AND user_id = ?", [
    name,
    type || null,
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.delete("/api/income-sources/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM income_sources WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.get("/api/income", async (req, res) => {
  const { month } = req.query;
  const params = [req.user.userId];
  const where = ["user_id = ?"];
  if (month) {
    where.push("DATE_FORMAT(income_date, '%Y-%m') = ?");
    params.push(month);
  }
  const rows = await query(
    `SELECT id, source_id AS sourceId, amount, income_date AS date, note
     FROM income_entries
     WHERE ${where.join(" AND ")}
     ORDER BY income_date DESC`,
    params
  );
  res.json({ items: rows });
});

app.get("/api/investments", async (req, res) => {
  const rows = await query(
    `SELECT id, kind,
            fund_name AS fundName, fund_type AS fundType,
            investment_type AS investmentType,
            amount_invested AS amountInvested,
            current_value AS currentValue,
            investment_date AS investmentDate,
            stock_name AS stockName, stock_ticker AS stockTicker,
            quantity, avg_buy_price AS avgBuyPrice, current_price AS currentPrice
     FROM investments
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/investments", async (req, res) => {
  const {
    kind,
    fundName,
    fundType,
    investmentType,
    amountInvested,
    currentValue,
    investmentDate,
    stockName,
    stockTicker,
    quantity,
    avgBuyPrice,
    currentPrice,
  } = req.body;

  if (kind === "mutual_fund") {
    if (!fundName || !fundType || !investmentType || !amountInvested || !currentValue || !investmentDate) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  } else if (kind === "stock") {
    if ((!stockName && !stockTicker) || !quantity || !avgBuyPrice || !currentPrice) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  } else {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const result = await query(
    `INSERT INTO investments
     (user_id, kind, fund_name, fund_type, investment_type, amount_invested, current_value, investment_date,
      stock_name, stock_ticker, quantity, avg_buy_price, current_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.userId,
      kind,
      fundName || null,
      fundType || null,
      investmentType || null,
      amountInvested || null,
      currentValue || null,
      investmentDate || null,
      stockName || null,
      stockTicker || null,
      quantity || null,
      avgBuyPrice || null,
      currentPrice || null,
    ]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/investments/:id", async (req, res) => {
  const id = Number(req.params.id);
  const {
    kind,
    fundName,
    fundType,
    investmentType,
    amountInvested,
    currentValue,
    investmentDate,
    stockName,
    stockTicker,
    quantity,
    avgBuyPrice,
    currentPrice,
  } = req.body;

  if (kind === "mutual_fund") {
    if (!fundName || !fundType || !investmentType || !amountInvested || !currentValue || !investmentDate) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  } else if (kind === "stock") {
    if ((!stockName && !stockTicker) || !quantity || !avgBuyPrice || !currentPrice) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  } else {
    return res.status(400).json({ error: "Invalid payload" });
  }

  await query(
    `UPDATE investments
     SET fund_name = ?, fund_type = ?, investment_type = ?, amount_invested = ?, current_value = ?, investment_date = ?,
         stock_name = ?, stock_ticker = ?, quantity = ?, avg_buy_price = ?, current_price = ?
     WHERE id = ? AND user_id = ?`,
    [
      fundName || null,
      fundType || null,
      investmentType || null,
      amountInvested || null,
      currentValue || null,
      investmentDate || null,
      stockName || null,
      stockTicker || null,
      quantity || null,
      avgBuyPrice || null,
      currentPrice || null,
      id,
      req.user.userId,
    ]
  );
  res.json({ ok: true });
});

app.delete("/api/investments/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM investments WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.get("/api/goals", async (req, res) => {
  const rows = await query(
    `SELECT id, name, target_amount AS targetAmount, target_date AS targetDate,
            allocated_amount AS allocatedAmount
     FROM financial_goals
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json({ items: rows });
});

app.post("/api/goals", async (req, res) => {
  const { name, targetAmount, targetDate } = req.body;
  if (!name || !targetAmount || !targetDate) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const result = await query(
    "INSERT INTO financial_goals (user_id, name, target_amount, target_date, allocated_amount) VALUES (?, ?, ?, ?, 0)",
    [req.user.userId, name, targetAmount, targetDate]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/goals/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, targetAmount, targetDate } = req.body;
  if (!name || !targetAmount || !targetDate) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  await query(
    "UPDATE financial_goals SET name = ?, target_amount = ?, target_date = ? WHERE id = ? AND user_id = ?",
    [name, targetAmount, targetDate, id, req.user.userId]
  );
  res.json({ ok: true });
});

app.post("/api/goals/:id/allocate", async (req, res) => {
  const id = Number(req.params.id);
  const { amount } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  await query(
    "UPDATE financial_goals SET allocated_amount = allocated_amount + ? WHERE id = ? AND user_id = ?",
    [amount, id, req.user.userId]
  );
  res.json({ ok: true });
});

app.delete("/api/goals/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM financial_goals WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.post("/api/income", async (req, res) => {
  const { sourceId, amount, date, note } = req.body;
  if (!sourceId || !amount || !date) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const result = await query(
    "INSERT INTO income_entries (user_id, source_id, amount, income_date, note) VALUES (?, ?, ?, ?, ?)",
    [req.user.userId, sourceId, amount, date, note || null]
  );
  res.status(201).json({ id: result.insertId });
});

app.delete("/api/income/:id", async (req, res) => {
  const id = Number(req.params.id);
  await query("DELETE FROM income_entries WHERE id = ? AND user_id = ?", [
    id,
    req.user.userId,
  ]);
  res.json({ ok: true });
});

app.post("/api/ai/analysis", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(501).json({ error: "Gemini API key not configured." });
  }

  const month =
    (req.body && req.body.month) || new Date().toISOString().slice(0, 7);
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const cacheKey = getAiCacheKey(req.user.userId, month);
  const cached = aiCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.json({
      ...cached.payload,
      cached: true,
      cache_expires_at: cached.expiresAt,
    });
  }

  try {
    const userRows = await query("SELECT name FROM users WHERE id = ?", [
      req.user.userId,
    ]);
    const userName = userRows[0]?.name || "User";

    const budgetRows = await query(
      "SELECT amount FROM budgets WHERE user_id = ? AND month = ?",
      [req.user.userId, month]
    );
    const budget = Number(budgetRows[0]?.amount || 0);

    const incomeRows = await query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM income_entries WHERE user_id = ? AND DATE_FORMAT(income_date, '%Y-%m') = ?",
      [req.user.userId, month]
    );
    const incomeTotal = Number(incomeRows[0]?.total || 0);

    const expenseRows = await query(
      `SELECT e.amount, e.expense_date AS date, e.note,
              c.label AS category, pm.type AS paymentType, pm.label AS paymentLabel
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
       WHERE e.user_id = ? AND DATE_FORMAT(e.expense_date, '%Y-%m') = ?
       ORDER BY e.expense_date DESC
       LIMIT 200`,
      [req.user.userId, month]
    );

    const spentTotal = expenseRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    const expenses = expenseRows.map((row) => ({
      date: row.date,
      amount: Number(row.amount || 0),
      category: row.category || "Unknown",
      payment: row.paymentLabel
        ? `${row.paymentType || "Payment"} - ${row.paymentLabel}`
        : row.paymentType || "Unknown",
      note: row.note || "",
    }));

    const prompt = `You are a world-class AI Financial Advisor for India. Think like a senior personal finance planner combining behavioral finance, cashflow management, and practical Indian banking knowledge. Be precise, data-driven, and realistic. Do NOT invent facts; if data is missing, say so briefly.

User name: ${userName}
Month: ${month}
Monthly budget (INR): ${budget}
Total income (INR): ${incomeTotal}
Total spent (INR): ${spentTotal}
Expenses list (JSON array of {date, amount, category, payment, note}):
${JSON.stringify(expenses)}

Return JSON that matches the provided schema. Keep each list item under 100 characters. Provide at most 5 suggestions. Include:
- a one-line reason for the score (cite 1-2 key signals like savings rate, overspend, high-category share)
- a clear budget health status (over / under / at risk)
- a detailed_analysis paragraph that reads like a premium advisor review (tight, insightful)
- money_leaks: small but frequent spend patterns (if any)
- next_month_forecast: early warning + practical prep
Only recommend credit cards if it clearly fits the user's spending. Provide 0 to 3 credit card suggestions tailored to spending patterns (cashback on groceries/fuel/UPI, travel, premium). If no credit card is needed, return an empty list. Each suggestion should include card name + 1 short reason.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            spending_score: { type: "integer", minimum: 0, maximum: 100 },
            score_reason: { type: "string" },
            budget_health_status: { type: "string" },
            detailed_analysis: { type: "string" },
            money_leaks: {
              type: "array",
              items: { type: "string" },
              maxItems: 5,
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              maxItems: 5,
            },
            credit_card_suggestions: {
              type: "array",
              items: { type: "string" },
              minItems: 0,
              maxItems: 3,
            },
            next_month_forecast: { type: "string" },
          },
          required: [
            "spending_score",
            "score_reason",
            "budget_health_status",
            "detailed_analysis",
            "money_leaks",
            "suggestions",
            "credit_card_suggestions",
            "next_month_forecast",
          ],
        },
      },
    };

    const geminiResponse = await callGemini({ apiKey, model, payload });
    const text = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (error) {
      return res.status(502).json({ error: "Unable to parse Gemini response." });
    }

    const responsePayload = {
      month,
      meta: {
        budget,
        incomeTotal,
        spentTotal,
      },
      analysis,
    };
    aiCache.set(cacheKey, {
      expiresAt: Date.now() + AI_CACHE_TTL_MS,
      payload: responsePayload,
    });
    res.json({
      ...responsePayload,
      cached: false,
      cache_expires_at: Date.now() + AI_CACHE_TTL_MS,
    });
  } catch (error) {
    console.error("AI analysis failed", error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.delete("/api/reset", async (req, res) => {
  await query("DELETE FROM expenses WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM budgets WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM category_budgets WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM budget_history WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM recurring_expenses WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM income_entries WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM income_sources WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM investments WHERE user_id = ?", [req.user.userId]);
  await query("DELETE FROM financial_goals WHERE user_id = ?", [req.user.userId]);
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`RupeeWise API running on port ${port}`);
});
