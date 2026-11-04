const express = require("express");
const router = express.Router();
const perpustakaanController = require("../controllers/perpustakaanController");

router.get("/", perpustakaanController.getAll);
router.post("/", perpustakaanController.create);

module.exports = router;
