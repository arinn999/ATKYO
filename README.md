# ✏️ AlatTulisKu - Website Jual Beli Alat Tulis

**AlatTulisKu** adalah aplikasi web toko online (*e-commerce*) interaktif untuk membeli dan menjual berbagai perlengkapan alat tulis sekolah maupun kantor. Dibangun menggunakan **HTML5**, **CSS3**, dan **Vanilla JavaScript** dengan penyimpanan data lokal (`localStorage`).

## ✨ Fitur Utama
1. **Sistem Login & Logout:**
   - Pengguna dapat masuk menggunakan nama pengguna dan kata sandi.
   - Status sesi pengguna tersimpan otomatis di `localStorage`.
2. **Katalog & Gambar Realistis:**
   - Menampilkan daftar produk lengkap dengan foto asli produk yang tajam dan nyata, label merk, harga Rupiah, dan deskripsi.
3. **Pilihan & Filter Merk:**
   - Pengguna dapat menyaring produk berdasarkan merk populer: **Joyko**, **Faber-Castell**, **Kenko**, dan **Snowman**.
4. **Fitur Jual Barang (`+ Jual Barang`):**
   - Pengguna yang sudah login dapat menambahkan produk alat tulis baru ke katalog toko dengan memilih merk, menentukan harga, deskripsi, serta tautan gambar.
5. **Keranjang Belanja Interaktif:**
   - Menambah produk ke keranjang, mengatur jumlah barang (`+` / `-`), menghapus item, menghitung total harga otomatis, dan melakukan *checkout*.

## 📁 Struktur File
```text
toko-alat-tulis/
├── index.html   # Struktur halaman web, filter merk, serta modal login, jual, dan keranjang
├── style.css    # Desain tata letak kartu produk, badge merk, dan tampilan responsif
├── script.js    # Logika filter merk, tambah produk jualan, keranjang, dan autentikasi
└── README.md    # Dokumentasi proyek
