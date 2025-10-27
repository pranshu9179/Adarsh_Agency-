const express = require("express");
const router = express.Router();
const salesCtrl = require("../Controller/SalesManCtrl");
const upload = require("../config/multer.js");

router.post("/", upload.single("photo"), salesCtrl.createSalesman);
router.get("/", salesCtrl.Display); 
router.get("/beats", salesCtrl.getAllBeats);
router.get("/:id", salesCtrl.getSingleSalesman);
router.put("/:id", upload.single("photo"), salesCtrl.updateSalesman);
router.delete("/:id", salesCtrl.deleteSalesman);

module.exports = router;
