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
    location.reload(); // Refresh halaman setelah simpan
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    alert("Terjadi kesalahan server.");
  }
}

async function hapusData(endpoint, id) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    try {
      const response = await fetch(`/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      alert(result.message);
      location.reload(); // Refresh halaman untuk memperbarui tabel
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }
}

// Fungsi Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      // Hapus data sesi
      sessionStorage.clear();
      // Arahkan ke halaman login (index.html berada di root)
      window.location.href = "/";
    }
  });
}

// Proteksi Halaman: Cek apakah user sudah login
// Jika tidak ada data login, tendang balik ke halaman login
if (
  window.location.pathname !== "/" &&
  window.location.pathname !== "/index.html"
) {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/";
  }
}
