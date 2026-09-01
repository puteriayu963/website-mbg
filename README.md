# Folder gambar menu

Taruh file logo resmi Badan Gizi Nasional di sini dengan nama `logo-BGN.png` (download dari sumber resmi BGN, jangan pakai logo hasil generate AI). Kalau file belum ada, header akan menampilkan kotak placeholder bertuliskan "BGN".

Taruh foto menu harian di sini. Karena sekarang **porsi kecil dan porsi besar punya foto masing-masing**, beri nama sesuai tanggal + jenis porsi, format:

```
menu-YYYY-MM-DD-kecil.jpg
menu-YYYY-MM-DD-besar.jpg
```

Contoh untuk tanggal 31 Agustus 2026:
- `menu-2026-08-31-kecil.jpg` → foto ompreng porsi kecil
- `menu-2026-08-31-besar.jpg` → foto ompreng porsi besar

Setelah upload foto, isi nama file itu di `menu.json`, pada tanggal yang sesuai:

```json
"porsi": {
  "kecil": { "foto": "image/menu-2026-08-31-kecil.jpg" },
  "besar": { "foto": "image/menu-2026-08-31-besar.jpg" }
}
```

Kalau salah satu foto belum diunggah, kotak fotonya akan tetap polos (tidak error/blank), tinggal nunggu diisi kapan pun siap.
