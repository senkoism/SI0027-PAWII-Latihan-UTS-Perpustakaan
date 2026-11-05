const express = require("express");
const router = express.Router();
const bukuController = require("../controllers/bukuController");

router.get("/", bukuController.getAll);
router.get("/:id", bukuController.getById);
router.post("/", bukuController.create);
router.put("/:id", bukuController.update);
router.delete("/:id", bukuController.remove);

module.exports = router;
