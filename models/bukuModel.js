// TODO A: Rancang Schema & Model Buku sesuai tabel skema pada README.md
//
// Ketentuan:
//   judul          String, wajib diisi, spasi di awal/akhir dibuang
//   isbn           String, wajib, UNIK, tepat 13 digit angka (contoh "9786021234567")
//   pengarang      Array of String (EMBEDDED), minimal 1 pengarang
//   detail         Subdocument (EMBEDDED, tanpa _id sendiri):
//                    halaman Number, wajib, 1 s.d. 10000
//                    edisi   Number, minimal 1, default 1
//   stok           Number, wajib, tidak boleh negatif
//   perpustakaanId ObjectId (REFERENCING ke model "Perpustakaan"), wajib
//   tersedia       Boolean, default true
//   createdAt      Date, default waktu saat ini
//
// Petunjuk: lihat models/perpustakaanModel.js sebagai contoh sintaks dasar,
// dan materi Pertemuan 9-10 (embedding vs referencing).

const mongoose = require("mongoose");

// TODO A1: buat schema subdocument detail
// TODO A2: buat bukuSchema
// TODO A3: export model dengan nama "Buku"

module.exports = {};
