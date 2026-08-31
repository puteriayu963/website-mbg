# Folder gambar menu

Taruh file logo resmi Badan Gizi Nasional di sini dengan nama `logo-BGN.png` (download dari sumber resmi BGN, jangan pakai logo hasil generate AI). Kalau file belum ada, header akan menampilkan kotak placeholder bertuliskan "BGN".

Taruh foto menu harian di sini, beri nama sesuai **tanggal** (bukan nama hari), format:

```
menu-YYYY-MM-DD.jpg
```

Contoh:
- `menu-2026-08-31.jpg` → foto menu tanggal 31 Agustus 2026
- `menu-2026-09-01.jpg` → foto menu tanggal 1 September 2026

Setelah upload foto, jangan lupa isi nama file itu di `menu.json`, pada tanggal yang sesuai, di field `"foto"`. Contoh:

```json
"2026-08-31": {
  "foto": "image/menu-2026-08-31.jpg"
}
```

Kalau foto untuk hari itu belum diunggah, website akan otomatis menampilkan kotak placeholder "Foto menu belum diunggah" — tidak akan error atau blank.
