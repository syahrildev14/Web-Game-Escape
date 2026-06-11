"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stabilizer_controller_1 = require("../controllers/stabilizer.controller");
const router = (0, express_1.Router)();
router.post("/validate-code", stabilizer_controller_1.validateCode);
exports.default = router;
