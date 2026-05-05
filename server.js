const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Fungsi Helper: Baca File (Ditambahkan auto-create file jika tidak ada)
const readData = (file) => {
  const filePath = path.join(__dirname, "data", `${file}.json`);

  if (!fs.existsSync(filePath)) {
    // Jika file data/balita.json dsb belum ada, buat file baru dengan array kosong
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
app.get("/api/:table", (req, res) => res.json(readData(req.params.table)));

app.post("/api/:table", (req, res) => {
  const data = readData(req.params.table);
  // Tambahkan ID unik dan data dari body
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, "public", "pages", `${page}.html`));
});

app.listen(PORT, () =>
  console.log(`SIPOLTA Server running: http://localhost:${PORT}`),
);
