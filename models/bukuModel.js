const mongoose = require("mongoose");

// Detail subdocument schema (embedded, tanpa _id sendiri)
const detailSchema = new mongoose.Schema(
  {
    halaman: {
      type: Number,
      required: true,
      min: [1, "Halaman minimal 1"],
      max: [10000, "Halaman maksimal 10000"],
    },
    edisi: {
      type: Number,
      min: [1, "Edisi minimal 1"],
      default: 1,
    },
  },
  { _id: false }
);

// Schema Buku
const bukuSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{13}$/, "ISBN harus tepat 13 digit angka"],
  },
  pengarang: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Minimal 1 pengarang",
    },
  },
  detail: {
    type: detailSchema,
    required: true,
  },
  stok: {
    type: Number,
    required: true,
    min: [0, "Stok tidak boleh negatif"],
  },
  perpustakaanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Perpustakaan",
    required: true,
  },
  tersedia: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Buku", bukuSchema);
