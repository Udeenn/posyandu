const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Fungsi Helper: Baca File (Auto-create folder & file jika tidak ada)
const readData = (file) => {
  const dataDir = path.join(__dirname, "data");
  const filePath = path.join(dataDir, `${file}.json`);

  // Pastikan folder 'data' ada
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error membaca file ${file}:`, err);
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(
    path.join(__dirname, "data", `${file}.json`),
    JSON.stringify(data, null, 2),
  );
};

// --- API ENDPOINTS ---

// 1. Endpoint Login (Membaca dari users.json)
app.post("/api/login", (req, res) => {
  const users = readData("users");
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.json({
      success: true,
      adminName: user.username,
      message: "Login berhasil!",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Username atau password salah!",
    });
  }
});

// 2. Endpoint Register
app.post("/api/register", (req, res) => {
  const users = readData("users");
  const { username, password } = req.body;

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username sudah digunakan!" });
  }

  users.push({ id: Date.now(), username, password });
  writeData("users", users);
  res.json({ message: "Registrasi berhasil! Silakan login." });
});

// 3. API CRUD General (:table bisa balita, kunjungan, pemeriksaan)
app.get("/api/:table", (req, res) => res.json(readData(req.params.table)));

app.post("/api/:table", (req, res) => {
  const data = readData(req.params.table);
  data.push({ id: Date.now(), ...req.body });
  writeData(req.params.table, data);
  res.json({ message: "Data SIPOLTA berhasil disimpan!" });
});

app.delete("/api/:table/:id", (req, res) => {
  const { table, id } = req.params;
  let data = readData(table);
  const dataBaru = data.filter((item) => item.id != id);

  if (data.length === dataBaru.length) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  writeData(table, dataBaru);
  res.json({ message: "Data berhasil dihapus!" });
});

// --- PAGE ROUTING ---

// Halaman Utama (Login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rute Register (Harus di atas rute dinamis /:page)
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Rute Dinamis untuk halaman di folder 'pages' (dashboard, data-balita, dll)
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, "public", "pages", `${page}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Halaman tidak ditemukan di folder pages");
  }
});

app.listen(PORT, () =>
  console.log(`SIPOLTA Server running: http://localhost:${PORT}`),
);
