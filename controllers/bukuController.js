const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

// GET /buku
// Query opsional:
//   perpustakaanId  filter berdasarkan perpustakaan
//   sort            nama field, urut ascending (default: createdAt)
//   page            default 1
//   limit           default 10, maksimum 100
//   fields          projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat perpustakaanId yang ter-populate (objek Perpustakaan)
exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.perpustakaanId) {
    filter.perpustakaanId = req.query.perpustakaanId;
  }

  const sortField = req.query.sort || "createdAt";
  const sortOption = {};
  if (sortField.startsWith("-")) {
    sortOption[sortField.substring(1)] = -1;
  } else {
    sortOption[sortField] = 1;
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);

  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  const total = await Buku.countDocuments(filter);

  let query = Buku.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate("perpustakaanId");

  if (req.query.fields) {
    const fields = req.query.fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean)
      .join(" ");
    query = query.select(fields);
  }

  const data = await query;

  res.json({
    data,
    page,
    limit,
    total,
  });
};

// GET /buku/:id
//   - 200 -> dokumen buku, perpustakaanId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  const buku = await Buku.findById(req.params.id).populate("perpustakaanId");
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.json(buku);
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  const buku = await Buku.create(req.body);
  res.status(201).json(buku);
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  const buku = await Buku.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.json(buku);
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  const buku = await Buku.findByIdAndDelete(req.params.id);
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.status(204).send();
};
