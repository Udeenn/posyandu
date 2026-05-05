// Fungsi umum untuk menambah data ke JSON via API
async function simpanData(endpoint, dataObj) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj),
    });
    const result = await response.json();
    alert(result.message);
    location.reload();
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    alert("Terjadi kesalahan server SIPOLTA.");
  }
}

// Fungsi hapus data
async function hapusData(endpoint, id) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    try {
      const response = await fetch(`/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      alert(result.message);
      location.reload();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }
}

// Fungsi Hitung Umur Bulan (Sangat penting untuk Balita)
function hitungUmurBulan(tanggalLahir) {
  const tglLahir = new Date(tanggalLahir);
  const tglSekarang = new Date();
  let bulan = (tglSekarang.getFullYear() - tglLahir.getFullYear()) * 12;
  bulan += tglSekarang.getMonth() - tglLahir.getMonth();
  return bulan;
}

// Penyesuaian Nama Admin di Header
const adminName = sessionStorage.getItem("adminName");
const adminDisplay = document.querySelector("header strong");
if (adminDisplay && adminName) {
  adminDisplay.innerText = adminName;
}

// Fungsi Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Keluar dari sistem SIPOLTA?")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  });
}

// Proteksi Halaman
if (
  window.location.pathname !== "/" &&
  window.location.pathname !== "/index.html"
) {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/";
  }
}
