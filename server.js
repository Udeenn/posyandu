const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Fungsi Helper: Baca File
const readData = (file) => {
  const filePath = path.join(__dirname, "data", `${file}.json`);

  // Cek apakah file benar-benar ada
  if (!fs.existsSync(filePath)) {
    console.error(
      `Peringatan: File ${file}.json tidak ditemukan di folder data.`,
    );
    return []; // Kembalikan array kosong jika file tidak ada, jangan biarkan crash
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error membaca file ${file}:`, err);
    return [];
  }
};

// Fungsi Helper: Tulis File
const writeData = (file, data) => {
  fs.writeFileSync(
    path.join(__dirname, "data", `${file}.json`),
    JSON.stringify(data, null, 2),
  );
};

// Endpoint untuk mengambil data
app.get("/api/:table", (req, res) => res.json(readData(req.params.table)));
app.post("/api/:table", (req, res) => {
  const data = readData(req.params.table);
  data.push({ id: Date.now(), ...req.body });
  writeData(req.params.table, data);
  res.json({ message: "Data berhasil disimpan!" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, "public", "pages", `${page}.html`));
});

// DELETE
app.delete('/api/:table/:id', (req, res) => {
    const { table, id } = req.params;
    let data = readData(table);
    
    // Filter data: simpan semua data KECUALI yang memiliki ID tersebut
    const dataBaru = data.filter(item => item.id != id);
    
    if (data.length === dataBaru.length) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    
    writeData(table, dataBaru);
    res.json({ message: 'Data berhasil dihapus!' });
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
