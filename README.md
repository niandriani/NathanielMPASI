# Dunia Nathaniel
Jadwal harian, menu MPASI, dan catatan bahan. Checklist harian dibagikan lewat server kecil (Node 18+, tanpa dependensi).

- Jalankan: `npm start` lalu buka http://localhost:3000
- Ubah daftar bahan: edit `public/bahan.json` (status: `ok`, `watch`, `new`).
- Data centang tersimpan di folder `data/` (atur dengan variabel `DATA_DIR`; pasang volume agar tidak hilang saat deploy ulang).
- Tanpa server (hosting statis), halaman tetap jalan dalam mode lokal: centang hanya tersimpan di perangkat masing-masing.
