const Perpustakaan = require("../models/perpustakaanModel");

exports.getAll = async (req, res) => {
  const data = await Perpustakaan.find().sort({ nama: 1 });
  res.json(data);
};

exports.create = async (req, res) => {
  const perpustakaan = await Perpustakaan.create(req.body);
  res.status(201).json(perpustakaan);
};
