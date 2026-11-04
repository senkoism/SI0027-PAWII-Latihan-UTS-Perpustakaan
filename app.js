// Latihan UTS PAW II - Buku Perpustakaan Kampus (Starter)
// Koneksi MongoDB, CORS, parser JSON, dan route /perpustakaan sudah tersedia.
// Lengkapi bagian bertanda TODO (lihat README.md bagian C dan D).

require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const perpustakaanRoutes = require("./routes/perpustakaanRoutes");
// TODO C2: require route buku dari ./routes/bukuRoutes
// TODO D2: require middleware errorHandler dari ./middlewares/errorHandler

app.use(cors());
app.use(express.json());

app.use("/perpustakaan", perpustakaanRoutes);
// TODO C3: daftarkan route buku pada path "/buku"

// TODO D3: daftarkan errorHandler sebagai middleware PALING AKHIR (setelah semua route)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });
